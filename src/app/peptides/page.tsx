import { prisma } from "@/lib/db/prisma";
import { computeTrustScore, bestFinnrickGrade, GRADE_ORDER } from "@/lib/finnrick/trust-score";
import { PeptideFilters } from "@/components/peptides/peptide-filters";
import { ComparisonTable } from "@/components/peptides/comparison-table";
import { JsonLd } from "@/components/seo/json-ld";
import type { FinnrickGrade } from "@/types";
import { normalizeCategory } from "@/lib/presentation";

export const metadata = {
  title: "Compare peptide prices and lab grades",
  description:
    "Server-rendered peptide comparison with live vendor pricing, Finnrick grades, and transparent trust scores.",
};

async function getPeptides(params: {
  search?: string;
  category?: string;
  grade?: string;
  sort?: string;
}) {
  const peptides = await prisma.peptide.findMany({
    include: {
      prices: {
        orderBy: { price: "asc" },
        include: { vendor: { select: { slug: true } } },
      },
      reviews: { select: { rating: true } },
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
    },
  });

  const rows = peptides.map((peptide) => {
    const bestPrice = peptide.prices[0] ?? null;
    const averageReviewRating =
      peptide.reviews.length > 0
        ? peptide.reviews.reduce((sum, review) => sum + review.rating, 0) / peptide.reviews.length
        : 0;
    const medianPrices = peptide.prices.map((price) => Number(price.price)).sort((a, b) => a - b);
    const median = medianPrices.length ? medianPrices[Math.floor(medianPrices.length / 2)] : null;
    const vendorFinnrick = bestPrice
      ? peptide.finnrickRatings.find((item) => item.vendor.slug === bestPrice.vendor.slug)
      : null;

    const grade = bestFinnrickGrade(
      peptide.finnrickRatings.map((item) => ({
        grade: item.grade as FinnrickGrade,
        averageScore: Number(item.averageScore),
        testCount: item.testCount,
        minScore: Number(item.minScore),
        maxScore: Number(item.maxScore),
        oldestTestDate: item.oldestTestDate.toISOString(),
        newestTestDate: item.newestTestDate.toISOString(),
        finnrickUrl: item.finnrickUrl,
      })),
    );

    const trustScore = bestPrice
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
      : null;

    return {
      id: peptide.id,
      slug: peptide.slug,
      name: peptide.name,
      category: peptide.category,
      grade,
      lowestPrice: bestPrice ? Number(bestPrice.price) : null,
      vendorCount: peptide.prices.length,
      trustScore: trustScore?.overall ?? null,
      lastUpdated: bestPrice?.lastUpdated ?? null,
    };
  });

  let filtered = rows;

  if (params.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter((row) => row.name.toLowerCase().includes(query));
  }

  if (params.category) {
    filtered = filtered.filter((row) => normalizeCategory(row.category) === params.category);
  }

  if (params.grade === "ab") {
    filtered = filtered.filter((row) => row.grade === "A" || row.grade === "B");
  } else if (params.grade === "tested") {
    filtered = filtered.filter((row) => row.grade != null);
  }

  const sort = params.sort ?? "trust";
  filtered = [...filtered].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "price") return (a.lowestPrice ?? Number.MAX_SAFE_INTEGER) - (b.lowestPrice ?? Number.MAX_SAFE_INTEGER);
    if (sort === "grade") return (GRADE_ORDER[b.grade ?? ""] ?? 0) - (GRADE_ORDER[a.grade ?? ""] ?? 0);
    if (sort === "vendors") return b.vendorCount - a.vendorCount;
    return (b.trustScore ?? 0) - (a.trustScore ?? 0);
  });

  const lastUpdated = filtered.find((row) => row.lastUpdated)?.lastUpdated ?? null;

  return { rows: filtered, lastUpdated };
}

export default async function PeptidesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const category = typeof params.category === "string" ? params.category : "";
  const grade = typeof params.grade === "string" ? params.grade : "all";
  const sort = typeof params.sort === "string" ? params.sort : "trust";
  const { rows, lastUpdated } = await getPeptides({ search, category, grade, sort });

  return (
    <div className="section-spacing">
      <div className="container-page">
        <JsonLd path="/peptides" />

        <div className="max-w-3xl">
          <span className="eyebrow">Core product</span>
          <h1 className="section-heading mt-4">Compare peptide prices and lab grades</h1>
          <p className="section-subheading">
            Server-rendered comparison data with current vendor pricing, Finnrick lab grades,
            and a visible trust signal for every row.
          </p>
        </div>

        <div className="mt-8">
          <PeptideFilters search={search} category={category} grade={grade} sort={sort} />
        </div>

        <div className="mt-8">
          <ComparisonTable rows={rows} lastUpdated={lastUpdated} />
        </div>
      </div>
    </div>
  );
}
