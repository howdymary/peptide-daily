import { prisma } from "@/lib/db/prisma";
import { computeTrustScore, bestFinnrickGrade } from "@/lib/finnrick/trust-score";
import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/home/hero";
import { LiveDataBar } from "@/components/home/live-data-bar";
import { EditorialPicks } from "@/components/home/editorial-picks";
import { PriceSnapshot } from "@/components/home/price-snapshot";
import { MethodologyStrip } from "@/components/home/methodology-strip";
import type { FinnrickGrade } from "@/types";

export const metadata = {
  title: "Peptide Daily — Independent peptide prices and lab-verified data",
  description:
    "Compare peptide prices across vendors with third-party Finnrick lab testing, transparent trust scores, and evidence-led research coverage.",
};

export const revalidate = 300;

async function getHomepageData() {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      articles,
      peptideCount,
      vendorCount,
      articleCount,
      latestPrice,
      latestLab,
      peptides,
    ] = await Promise.all([
      prisma.newsArticle.findMany({
        where: { isHidden: false },
        orderBy: [{ isEditorsPick: "desc" }, { publishedAt: "desc" }],
        take: 4,
        include: {
          source: { select: { name: true } },
        },
      }),
      prisma.peptide.count(),
      prisma.vendor.count({ where: { isActive: true } }),
      prisma.newsArticle.count({
        where: { isHidden: false, publishedAt: { gte: weekAgo } },
      }),
      prisma.peptidePrice.findFirst({
        orderBy: { lastUpdated: "desc" },
        select: { lastUpdated: true },
      }),
      prisma.finnrickVendorRating.findFirst({
        orderBy: { newestTestDate: "desc" },
        select: { newestTestDate: true },
      }),
      prisma.peptide.findMany({
        include: {
          prices: {
            orderBy: { price: "asc" },
            include: { vendor: { select: { name: true, slug: true } } },
          },
          finnrickRatings: {
            select: {
              grade: true,
              averageScore: true,
              testCount: true,
              minScore: true,
              maxScore: true,
              oldestTestDate: true,
              newestTestDate: true,
              finnrickUrl: true,
              vendor: { select: { slug: true } },
            },
          },
          reviews: { select: { rating: true } },
        },
      }),
    ]);

    const preparedPeptides = peptides
      .map((peptide) => {
        const bestPrice = peptide.prices[0] ?? null;
        const ratings = peptide.finnrickRatings.map((item) => ({
          grade: item.grade as FinnrickGrade,
          averageScore: Number(item.averageScore),
          testCount: item.testCount,
          minScore: Number(item.minScore),
          maxScore: Number(item.maxScore),
          oldestTestDate: item.oldestTestDate.toISOString(),
          newestTestDate: item.newestTestDate.toISOString(),
          finnrickUrl: item.finnrickUrl,
        }));
        const grade = bestFinnrickGrade(ratings);
        const averageReviewRating =
          peptide.reviews.length > 0
            ? peptide.reviews.reduce((sum, review) => sum + review.rating, 0) / peptide.reviews.length
            : 0;
        const prices = peptide.prices.map((item) => Number(item.price)).sort((a, b) => a - b);
        const median = prices.length ? prices[Math.floor(prices.length / 2)] : null;
        const vendorFinnrick = bestPrice
          ? peptide.finnrickRatings.find((item) => item.vendor.slug === bestPrice.vendor.slug)
          : null;

        return {
          id: peptide.id,
          slug: peptide.slug,
          name: peptide.name,
          category: peptide.category,
          grade,
          lowestPrice: bestPrice ? Number(bestPrice.price) : null,
          vendor: bestPrice?.vendor.name ?? null,
          vendorCount: peptide.prices.length,
          lastUpdated: bestPrice?.lastUpdated ?? null,
          trust: bestPrice
            ? computeTrustScore({
                finnrickRating: vendorFinnrick
                  ? {
                      grade: vendorFinnrick.grade as FinnrickGrade,
                      averageScore: Number(vendorFinnrick.averageScore),
                      testCount: vendorFinnrick.testCount,
                      minScore: Number(vendorFinnrick.minScore),
                      maxScore: Number(vendorFinnrick.maxScore),
                      oldestTestDate: vendorFinnrick.oldestTestDate.toISOString(),
                      newestTestDate: vendorFinnrick.newestTestDate.toISOString(),
                      finnrickUrl: vendorFinnrick.finnrickUrl,
                    }
                  : null,
                averageReviewRating,
                reviewCount: peptide.reviews.length,
                priceRelativeToMedian:
                  bestPrice && median ? Number(bestPrice.price) / median : undefined,
              })
            : null,
        };
      })
      .sort(
        (a, b) =>
          (b.trust?.overall ?? 0) - (a.trust?.overall ?? 0) ||
          (b.vendorCount ?? 0) - (a.vendorCount ?? 0),
      );

    return {
      featured: articles[0]
        ? {
            id: articles[0].id,
            title: articles[0].title,
            sourceUrl: articles[0].sourceUrl,
            summary: articles[0].excerpt,
            category: articles[0].tags[0] ?? "Research",
            date: articles[0].publishedAt,
            source: articles[0].source.name,
            tags: articles[0].tags,
            featuredLabel: articles[0].isEditorsPick ? "Editor's pick" : "Latest",
          }
        : null,
      articles: articles.slice(1).map((article) => ({
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
      categories: [...new Set(articles.flatMap((article) => article.tags).filter(Boolean))],
      quickLinks: preparedPeptides.slice(0, 8).map((item) => ({
        name: item.name,
        slug: item.slug,
        grade: item.grade,
      })),
      stats: [
        { value: `${peptideCount}+`, label: "Peptides tracked" },
        { value: `${vendorCount}`, label: "Vendors compared" },
        { value: "Every 15 min", label: "Price updates" },
      ],
      priceRows: preparedPeptides.slice(0, 6),
      latestPriceUpdated: latestPrice?.lastUpdated ?? null,
      latestLabUpdated: latestLab?.newestTestDate ?? null,
      articleCount,
      compoundCount: peptideCount,
    };
  } catch (error) {
    console.warn("[homepage] falling back to empty state", error);
    return {
      featured: null,
      articles: [],
      categories: [],
      quickLinks: [],
      stats: [
        { value: "50+", label: "Peptides tracked" },
        { value: "10", label: "Vendors compared" },
        { value: "Every 15 min", label: "Price updates" },
      ],
      priceRows: [],
      latestPriceUpdated: null,
      latestLabUpdated: null,
      articleCount: 0,
      compoundCount: 50,
    };
  }
}

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <>
      <JsonLd path="/" />
      <Hero quickLinks={data.quickLinks} stats={data.stats} />
      <LiveDataBar
        priceUpdatedAt={data.latestPriceUpdated}
        articleCount={data.articleCount}
        labUpdatedAt={data.latestLabUpdated}
        compoundCount={data.compoundCount}
      />
      <EditorialPicks
        featured={data.featured}
        articles={data.articles}
        categories={data.categories}
      />
      <PriceSnapshot rows={data.priceRows} lastUpdated={data.latestPriceUpdated} />
      <MethodologyStrip />
    </>
  );
}
