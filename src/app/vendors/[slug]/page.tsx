import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { bestFinnrickGrade } from "@/lib/finnrick/trust-score";
import { computeVendorTrustScore } from "@/lib/vendors/metrics";
import { VendorDetailHeader } from "@/components/vendors/vendor-detail-header";
import { VendorProductTable } from "@/components/vendors/vendor-product-table";
import { VendorReviewSection } from "@/components/vendors/vendor-review-section";
import { VendorTrustBreakdown } from "@/components/vendors/vendor-trust-breakdown";
import { FinnrickGradeBadge } from "@/components/primitives/finnrick-grade-badge";
import { DataSourceTag } from "@/components/primitives/data-source-tag";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";
import type { FinnrickGrade } from "@/types";

async function getVendorDetail(slug: string) {
  const vendor = await prisma.vendor.findUnique({
    where: { slug },
    include: {
      prices: {
        include: {
          peptide: {
            select: {
              id: true,
              name: true,
              slug: true,
              category: true,
            },
          },
        },
        orderBy: { price: "asc" },
      },
      finnrickRatings: {
        include: {
          peptide: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tests: {
            orderBy: { testDate: "desc" },
            take: 4,
          },
        },
        orderBy: [{ averageScore: "desc" }, { newestTestDate: "desc" }],
      },
      vendorMapping: {
        select: {
          vendorDomain: true,
        },
      },
    },
  });

  if (!vendor) return null;

  const peptideIds = [...new Set(vendor.prices.map((price) => price.peptide.id))];
  const recentReviews =
    peptideIds.length > 0
      ? await prisma.review.findMany({
          where: {
            peptideId: { in: peptideIds },
            flagged: false,
          },
          include: {
            peptide: {
              select: {
                name: true,
                slug: true,
              },
            },
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 6,
        })
      : [];

  const averageScore =
    vendor.finnrickRatings.length > 0
      ? vendor.finnrickRatings.reduce((sum, item) => sum + Number(item.averageScore), 0) /
        vendor.finnrickRatings.length
      : null;
  const totalTestCount = vendor.finnrickRatings.reduce((sum, item) => sum + item.testCount, 0);
  const latestTestDate =
    vendor.finnrickRatings.length > 0
      ? vendor.finnrickRatings.reduce(
          (latest, item) =>
            item.newestTestDate > latest ? item.newestTestDate : latest,
          vendor.finnrickRatings[0].newestTestDate,
        )
      : null;
  const bestGrade = bestFinnrickGrade(
    vendor.finnrickRatings.map((item) => ({
      grade: item.grade as FinnrickGrade,
    })),
  );
  const trust = computeVendorTrustScore({
    averageFinnrickScore: averageScore,
    totalTestCount,
    peptideCount: peptideIds.length,
    latestTestDate,
  });
  const ratingByPeptideId = new Map(
    vendor.finnrickRatings.map((item) => [item.peptideId, item.grade as FinnrickGrade]),
  );

  return {
    name: vendor.name,
    slug: vendor.slug,
    website: vendor.website,
    vendorDomain: vendor.vendorMapping?.vendorDomain ?? null,
    bestGrade,
    averageScore: averageScore != null ? Math.round(averageScore * 10) / 10 : null,
    totalTestCount,
    latestTestDate,
    peptideCount: peptideIds.length,
    trustScore: trust.overall,
    trustBreakdown: trust.breakdown,
    priceRows: vendor.prices.map((price) => ({
      id: price.id,
      peptideName: price.peptide.name,
      peptideSlug: price.peptide.slug,
      peptideCategory: price.peptide.category,
      price: Number(price.price),
      currency: price.currency,
      concentration: price.concentration,
      productUrl: price.productUrl,
      availabilityStatus: price.availabilityStatus,
      lastUpdated: price.lastUpdated,
      grade: ratingByPeptideId.get(price.peptide.id) ?? null,
    })),
    ratings: vendor.finnrickRatings.map((rating) => ({
      id: rating.id,
      peptideName: rating.peptide.name,
      peptideSlug: rating.peptide.slug,
      grade: rating.grade as FinnrickGrade,
      averageScore: Number(rating.averageScore),
      testCount: rating.testCount,
      newestTestDate: rating.newestTestDate,
      finnrickUrl: rating.finnrickUrl,
      tests: rating.tests.map((test) => ({
        id: test.id,
        testDate: test.testDate,
        purity: Number(test.purity),
        quantityVariance: Number(test.quantityVariance),
        identityResult: test.identityResult,
      })),
    })),
    recentReviews: recentReviews.map((review) => ({
      id: review.id,
      peptideName: review.peptide.name,
      peptideSlug: review.peptide.slug,
      rating: review.rating,
      title: review.title,
      body: review.body,
      author: review.user.name ?? "Anonymous",
      createdAt: review.createdAt,
    })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await getVendorDetail(slug);

  if (!vendor) {
    return {
      title: "Vendor not found | Peptide Daily",
    };
  }

  return {
    title: `${vendor.name} vendor profile, lab testing, and prices`,
    description: `${vendor.name} vendor profile with Finnrick lab grades, tracked peptides, live pricing, and a transparent Peptide Daily trust breakdown.`,
  };
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vendor = await getVendorDetail(slug);

  if (!vendor) {
    notFound();
  }

  return (
    <div className="section-spacing">
      <div className="container-page">
        <Link
          href="/vendors"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          ← Back to vendors
        </Link>

        <VendorDetailHeader
          vendor={{
            name: vendor.name,
            website: vendor.website,
            vendorDomain: vendor.vendorDomain,
            bestGrade: vendor.bestGrade,
            trustScore: vendor.trustScore,
            peptideCount: vendor.peptideCount,
            totalTestCount: vendor.totalTestCount,
            averageScore: vendor.averageScore,
            latestTestDate: vendor.latestTestDate,
          }}
        />

        <section className="mt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">Catalog</span>
              <h2 className="section-heading mt-3">Tracked products and current pricing</h2>
              <p className="section-subheading">
                This table is sorted by live price, with Finnrick grades inline wherever
                independent testing exists.
              </p>
            </div>
            <DataSourceTag source="Vendor websites" lastUpdated={vendor.priceRows[0]?.lastUpdated ?? null} href="/about#pricing" />
          </div>

          <div className="mt-8">
            <VendorProductTable rows={vendor.priceRows} />
          </div>
        </section>

        <section className="mt-14">
          <div className="max-w-2xl">
            <span className="eyebrow">Lab history</span>
            <h2 className="section-heading mt-3">Finnrick results across this vendor&apos;s catalog</h2>
            <p className="section-subheading">
              We surface the latest test windows, not just a single headline grade, so you
              can see where confidence comes from.
            </p>
          </div>

          {vendor.ratings.length > 0 ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {vendor.ratings.map((rating) => (
                <article key={rating.id} className="surface-card rounded-[1.75rem] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/peptides/${rating.peptideSlug}`}
                        className="font-[var(--font-newsreader)] text-3xl leading-none text-[var(--text-primary)] hover:text-[var(--accent-primary)]"
                      >
                        {rating.peptideName}
                      </Link>
                      <p className="mt-3 text-sm text-[var(--text-secondary)]">
                        {rating.testCount} test{rating.testCount === 1 ? "" : "s"} · average lab score{" "}
                        <span className="font-mono">{rating.averageScore.toFixed(1)}/10</span>
                      </p>
                    </div>
                    <FinnrickGradeBadge grade={rating.grade} size="lg" />
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <span>Latest test {new Date(rating.newestTestDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    {rating.finnrickUrl && (
                      <>
                        <span aria-hidden="true">·</span>
                        <a
                          href={rating.finnrickUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--info)] underline-offset-4 hover:underline"
                        >
                          Original Finnrick page ↗
                        </a>
                      </>
                    )}
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {rating.tests.slice(0, 3).map((test) => (
                      <div key={test.id} className="rounded-[1.25rem] bg-[var(--bg-tertiary)] p-4">
                        <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                          {new Date(test.testDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </p>
                        <p className="mt-2 font-mono text-lg text-[var(--text-primary)]">
                          {test.purity.toFixed(1)}% purity
                        </p>
                        <p className="mt-2 text-xs text-[var(--text-secondary)]">
                          Qty variance {test.quantityVariance.toFixed(1)}% · {test.identityResult}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-[var(--border-default)] px-6 py-12">
              <p className="font-[var(--font-newsreader)] text-3xl text-[var(--text-primary)]">
                Pending Finnrick review
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                This vendor is in the directory, but we do not yet have independent Finnrick
                data to summarize. That absence is intentional and visible, rather than being
                hidden behind inflated defaults.
              </p>
            </div>
          )}
        </section>

        <section className="mt-14 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="max-w-2xl">
              <span className="eyebrow">Reader signal</span>
              <h2 className="section-heading mt-3">Recent reviews from tracked peptides</h2>
              <p className="section-subheading">
                Reviews stay attached to individual compounds. Here we surface the latest ones
                for peptides this vendor currently sells.
              </p>
            </div>
            <div className="mt-8">
              <VendorReviewSection reviews={vendor.recentReviews} />
            </div>
          </div>

          <VendorTrustBreakdown breakdown={vendor.trustBreakdown} />
        </section>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="surface-card rounded-[1.75rem] p-6">
            <span className="eyebrow">Source integrity</span>
            <h2 className="mt-4 font-[var(--font-newsreader)] text-3xl text-[var(--text-primary)]">
              What this page does not do
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              We do not convert vendor marketing copy into editorial claims. Grades come from
              Finnrick, prices come from the vendor site, and the trust score is a Peptide
              Daily composite that is visible and explainable.
            </p>
          </div>

          <MedicalDisclaimer variant="callout" />
        </div>
      </div>
    </div>
  );
}
