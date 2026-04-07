import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { computeTrustScore, bestFinnrickGrade } from "@/lib/finnrick/trust-score";
import { getPeptideGuide } from "@/lib/learn/content-service";
import { PeptideDetailHeader } from "@/components/peptides/peptide-detail-header";
import { VendorPriceRow } from "@/components/peptides/vendor-price-row";
import { PurityDistribution } from "@/components/peptides/purity-distribution";
import { PriceHistoryChart } from "@/components/peptides/price-history-chart";
import { ArticleCard } from "@/components/primitives/article-card";
import { DataSourceTag } from "@/components/primitives/data-source-tag";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";
import { SourceFinder } from "@/components/peptides/source-finder";
import type { FinnrickGrade } from "@/types";

async function getPeptideDetail(slug: string) {
  const peptide = await prisma.peptide.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    include: {
      prices: {
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { price: "asc" },
      },
      reviews: {
        where: { flagged: false },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      },
      finnrickRatings: {
        include: {
          vendor: {
            select: {
              name: true,
              slug: true,
            },
          },
          tests: {
            orderBy: { testDate: "desc" },
            take: 6,
          },
        },
      },
    },
  });

  if (!peptide) return null;

  // Source Finder: get providers that may carry this peptide
  // (clinics, pharmacies, telehealth with relevant services)
  const relevantProviders = await prisma.provider.findMany({
    where: {
      isActive: true,
      OR: [
        { services: { has: "peptide-therapy" } },
        { services: { has: "peptide-formulation" } },
        { services: { has: "compounding" } },
      ],
    },
    select: {
      slug: true,
      name: true,
      type: true,
      city: true,
      state: true,
      offersTelehealth: true,
      fdaRegistered: true,
      cpsVerified: true,
    },
    orderBy: [{ fdaRegistered: "desc" }, { name: "asc" }],
    take: 6,
  });

  const relatedNews = await prisma.newsArticle.findMany({
    where: {
      isHidden: false,
      OR: [
        { tags: { has: peptide.name } },
        { title: { contains: peptide.name, mode: "insensitive" } },
        { excerpt: { contains: peptide.name, mode: "insensitive" } },
      ],
    },
    include: {
      source: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [{ isEditorsPick: "desc" }, { publishedAt: "desc" }],
    take: 3,
  });

  const averageReviewRating =
    peptide.reviews.length > 0
      ? peptide.reviews.reduce((sum, review) => sum + review.rating, 0) / peptide.reviews.length
      : 0;
  const numericPrices = peptide.prices.map((price) => Number(price.price)).sort((a, b) => a - b);
  const medianPrice =
    numericPrices.length > 0 ? numericPrices[Math.floor(numericPrices.length / 2)] : null;
  const bestPrice = peptide.prices[0] ?? null;

  const ratings = peptide.finnrickRatings.map((rating) => ({
    vendorSlug: rating.vendor.slug,
    vendorName: rating.vendor.name,
    grade: rating.grade as FinnrickGrade,
    averageScore: Number(rating.averageScore),
    testCount: rating.testCount,
    minScore: Number(rating.minScore),
    maxScore: Number(rating.maxScore),
    oldestTestDate: rating.oldestTestDate.toISOString(),
    newestTestDate: rating.newestTestDate.toISOString(),
    finnrickUrl: rating.finnrickUrl,
    tests: rating.tests.map((test) => ({
      id: test.id,
      testDate: test.testDate.toISOString(),
      purity: Number(test.purity),
      quantityVariance: Number(test.quantityVariance),
      identityResult: test.identityResult,
      vendorName: rating.vendor.name,
    })),
  }));

  const bestGrade = bestFinnrickGrade(ratings);
  const bestVendorRating =
    bestPrice ? ratings.find((rating) => rating.vendorSlug === bestPrice.vendor.slug) ?? null : null;
  const bestTrust = bestPrice
    ? computeTrustScore({
        finnrickRating: bestVendorRating
          ? {
              grade: bestVendorRating.grade,
              averageScore: bestVendorRating.averageScore,
              testCount: bestVendorRating.testCount,
              minScore: bestVendorRating.minScore,
              maxScore: bestVendorRating.maxScore,
              oldestTestDate: bestVendorRating.oldestTestDate,
              newestTestDate: bestVendorRating.newestTestDate,
              finnrickUrl: bestVendorRating.finnrickUrl,
            }
          : null,
        averageReviewRating,
        reviewCount: peptide.reviews.length,
        priceRelativeToMedian:
          bestPrice && medianPrice ? Number(bestPrice.price) / medianPrice : undefined,
      })
    : null;

  return {
    name: peptide.name,
    slug: peptide.slug,
    description: peptide.description,
    category: peptide.category,
    bestGrade,
    bestPrice: bestPrice ? Number(bestPrice.price) : null,
    bestPriceVendor: bestPrice?.vendor.name ?? null,
    trustScore: bestTrust?.overall ?? null,
    priceRows: peptide.prices.map((price) => ({
      id: price.id,
      vendorName: price.vendor.name,
      vendorSlug: price.vendor.slug,
      price: Number(price.price),
      currency: price.currency,
      concentration: price.concentration,
      grade:
        ratings.find((rating) => rating.vendorSlug === price.vendor.slug)?.grade ?? null,
      lastUpdated: price.lastUpdated,
      productUrl: price.productUrl,
    })),
    relatedNews: relatedNews.map((article) => ({
      id: article.id,
      title: article.title,
      sourceUrl: article.sourceUrl,
      summary: article.excerpt,
      category: article.tags[0] ?? "Research",
      date: article.publishedAt,
      source: article.source.name,
      tags: article.tags,
      featuredLabel: article.isEditorsPick ? "Editor's pick" : null,
    })),
    purityEntries: ratings.flatMap((rating) => rating.tests),
    labCards: ratings,
    reviews: peptide.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      body: review.body,
      author: review.user.name ?? "Anonymous",
      createdAt: review.createdAt,
    })),
    relevantProviders,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const peptide = await getPeptideDetail(slug);

  if (!peptide) {
    return { title: "Peptide not found | Peptide Daily" };
  }

  return {
    title: `${peptide.name} prices, lab grades, and research context`,
    description: `Compare ${peptide.name} pricing, see Finnrick lab data, and read related research context in a cleaner clinical-authority layout.`,
  };
}

export default async function PeptideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const peptide = await getPeptideDetail(slug);

  if (!peptide) {
    notFound();
  }

  const guide = getPeptideGuide(peptide.slug);

  return (
    <div className="section-spacing">
      <PeptideDetailHeader
        name={peptide.name}
        description={peptide.description}
        category={peptide.category}
        grade={peptide.bestGrade}
        bestPrice={peptide.bestPrice}
        bestPriceVendor={peptide.bestPriceVendor}
        trustScore={peptide.trustScore}
      />

      <div className="container-page">
        <Link
          href="/peptides"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          ← Back to peptide comparison
        </Link>

        <section>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">Price comparison</span>
              <h2 className="section-heading mt-3">Current offers across tracked vendors</h2>
              <p className="section-subheading">
                Lowest price first, with Finnrick grades in the same row so cost never gets
                divorced from lab context.
              </p>
            </div>
            <DataSourceTag source="Vendor websites" lastUpdated={peptide.priceRows[0]?.lastUpdated ?? null} href="/about#pricing" />
          </div>

          <div className="table-shell mt-8 overflow-x-auto rounded-[1.5rem]">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--bg-tertiary)] text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Vendor</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Concentration</th>
                  <th className="px-5 py-3 font-medium">Grade</th>
                  <th className="px-5 py-3 font-medium">Updated</th>
                  <th className="px-5 py-3 font-medium">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {peptide.priceRows.map((row) => (
                  <VendorPriceRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <SourceFinder
          peptideName={peptide.name}
          providers={peptide.relevantProviders}
        />

        <section className="mt-14">
          <div className="max-w-2xl">
            <span className="eyebrow">Lab data</span>
            <h2 className="section-heading mt-3">What the Finnrick results actually show</h2>
            <p className="section-subheading">
              We highlight current purity and quantity results without implying every vendor
              or every batch has been tested equally.
            </p>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <PurityDistribution entries={peptide.purityEntries} />

            <div className="space-y-4">
              {peptide.labCards.length > 0 ? (
                peptide.labCards.map((rating) => (
                  <article key={rating.vendorSlug} className="surface-card rounded-[1.5rem] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{rating.vendorName}</p>
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                          {rating.testCount} test{rating.testCount === 1 ? "" : "s"} · avg lab score{" "}
                          <span className="font-mono">{rating.averageScore.toFixed(1)}/10</span>
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--bg-tertiary)] px-3 py-1.5 font-mono text-sm text-[var(--text-primary)]">
                        {rating.grade}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-[var(--text-secondary)]">
                      Latest Finnrick test {new Date(rating.newestTestDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </article>
                ))
              ) : (
                <div className="surface-card rounded-[1.5rem] p-6">
                  <p className="text-sm leading-7 text-[var(--text-secondary)]">
                    No Finnrick lab results are attached to this peptide yet. We leave that
                    state explicit rather than inferring confidence that hasn&apos;t been earned.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="max-w-2xl">
            <span className="eyebrow">Price history</span>
            <h2 className="section-heading mt-3">Historical tracking comes next</h2>
            <p className="section-subheading">
              The current schema gives us a trustworthy live market snapshot. It does not yet
              store price snapshots over time, so the chart module stays honest about that gap.
            </p>
          </div>

          <div className="mt-8">
            <PriceHistoryChart />
          </div>
        </section>

        {(guide || peptide.relatedNews.length > 0 || peptide.reviews.length > 0) && (
          <section className="mt-14">
            <div className="max-w-2xl">
              <span className="eyebrow">Research context</span>
              <h2 className="section-heading mt-3">Editorial context beyond the price table</h2>
              <p className="section-subheading">
                The goal is to keep market data inside a broader research and safety frame,
                not let the price table become the whole story.
              </p>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
              <div className="space-y-6">
                {guide && (
                  <div className="surface-card rounded-[1.75rem] p-6">
                    <span className="eyebrow">Guide</span>
                    <h3 className="mt-4 font-[var(--font-newsreader)] text-3xl text-[var(--text-primary)]">
                      {guide.name} explainer
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                      {guide.shortSummary}
                    </p>
                    <Link
                      href={`/learn/${guide.slug}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)]"
                    >
                      Read the full research guide →
                    </Link>
                  </div>
                )}

                {peptide.reviews.length > 0 && (
                  <div className="surface-card rounded-[1.75rem] p-6">
                    <span className="eyebrow">Community</span>
                    <h3 className="mt-4 font-[var(--font-newsreader)] text-3xl text-[var(--text-primary)]">
                      Recent reader notes
                    </h3>
                    <div className="mt-5 space-y-5">
                      {peptide.reviews.slice(0, 3).map((review) => (
                        <article key={review.id} className="border-b border-[var(--border-default)] pb-5 last:border-b-0 last:pb-0">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-[var(--text-primary)]">{review.title}</p>
                            <span className="font-mono text-sm text-[var(--text-secondary)]">
                              {review.rating}/5
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                            {review.body}
                          </p>
                          <p className="mt-3 text-xs text-[var(--text-tertiary)]">
                            {review.author} · {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                {peptide.relatedNews.length > 0 ? (
                  peptide.relatedNews.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="standard" />
                  ))
                ) : (
                  <div className="surface-card rounded-[1.75rem] p-6">
                    <span className="eyebrow">Coverage</span>
                    <h3 className="mt-4 font-[var(--font-newsreader)] text-3xl text-[var(--text-primary)]">
                      No related headlines yet
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                      This compound hasn&apos;t been tagged in the news feed yet. When new
                      coverage lands, we&apos;ll surface it here instead of stuffing the section
                      with irrelevant filler.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <MedicalDisclaimer variant="callout" className="mt-14" />
      </div>
    </div>
  );
}
