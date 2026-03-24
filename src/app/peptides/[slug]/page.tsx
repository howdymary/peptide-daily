import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { computeTrustScore, bestFinnrickGrade } from "@/lib/finnrick/trust-score";
import { PriceTable } from "@/components/peptides/price-table";
import { StarRating } from "@/components/ui/star-rating";
import { GradeBadge, GradeBadgeEmpty } from "@/components/finnrick/grade-badge";
import { TrustScoreBar } from "@/components/finnrick/trust-score-bar";
import { Badge } from "@/components/ui/badge";
import { TrustBadge, deriveTrustBadge } from "@/components/ui/trust-badge";
import { GradeScaleTip, TrustScoreTip } from "@/components/ui/onboarding-tip";
import { MedicalDisclaimer } from "@/components/ui/info-banner";
import { getPeptideGuide, getCategoryRiskThemes } from "@/lib/learn/content-service";
import { REGULATORY_LABELS, REGULATORY_COLORS } from "@/lib/learn/peptide-data";
import { ReviewSectionClient } from "@/components/reviews/review-form-client";
import type { FinnrickRatingItem, FinnrickGrade, FinnrickTestItem, PeptideDetail } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// DATA FETCHING
// ─────────────────────────────────────────────────────────────────────────────

async function getPeptideBySlug(slug: string): Promise<PeptideDetail | null> {
  const peptide = await prisma.peptide.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    include: {
      prices: {
        include: {
          vendor: {
            select: { id: true, name: true, slug: true, website: true },
          },
        },
        orderBy: { price: "asc" },
      },
      reviews: {
        where: { flagged: false },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      finnrickRatings: {
        include: {
          tests: {
            orderBy: { testDate: "desc" },
            take: 10,
          },
          vendor: { select: { slug: true } },
        },
      },
    },
  });

  if (!peptide) return null;

  const ratings = peptide.reviews.map((r) => r.rating);
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

  const bestPrice = peptide.prices.length > 0 ? peptide.prices[0] : null;

  // Build finnrickRatings map keyed by vendor slug
  const finnrickRatingsMap: Record<string, FinnrickRatingItem> = {};
  const finnrickTestsMap: Record<string, FinnrickTestItem[]> = {};
  for (const fr of peptide.finnrickRatings) {
    finnrickRatingsMap[fr.vendor.slug] = {
      grade: fr.grade as FinnrickGrade,
      averageScore: Number(fr.averageScore),
      testCount: fr.testCount,
      minScore: Number(fr.minScore),
      maxScore: Number(fr.maxScore),
      oldestTestDate: fr.oldestTestDate.toISOString(),
      newestTestDate: fr.newestTestDate.toISOString(),
      finnrickUrl: fr.finnrickUrl,
    };
    finnrickTestsMap[fr.vendor.slug] = fr.tests.map((t) => ({
      id: t.id,
      testDate: t.testDate.toISOString(),
      testScore: Number(t.testScore),
      advertisedQuantity: Number(t.advertisedQuantity),
      actualQuantity: Number(t.actualQuantity),
      quantityVariance: Number(t.quantityVariance),
      purity: Number(t.purity),
      batchId: t.batchId,
      containerType: t.containerType,
      labId: t.labId,
      source: t.source,
      endotoxinsStatus: t.endotoxinsStatus,
      certificateLink: t.certificateLink,
      identityResult: t.identityResult,
    }));
  }

  // Pricing signal: median price across vendors
  const allPrices = peptide.prices.map((pr) => Number(pr.price)).sort((a, b) => a - b);
  const median = allPrices.length > 0 ? allPrices[Math.floor(allPrices.length / 2)] : null;

  return {
    id: peptide.id,
    name: peptide.name,
    slug: peptide.slug,
    description: peptide.description,
    category: peptide.category,
    sequence: (peptide as Record<string, unknown>).sequence as string | undefined,
    averageRating: Math.round(avgRating * 10) / 10,
    reviewCount: ratings.length,
    bestPrice: bestPrice ? Number(bestPrice.price) : null,
    bestPriceVendor: bestPrice ? bestPrice.vendor.name : null,
    priceCount: peptide.prices.length,
    bestFinnrickGrade: bestFinnrickGrade(Object.values(finnrickRatingsMap)),
    trustScore: bestPrice
      ? computeTrustScore({
          finnrickRating: finnrickRatingsMap[bestPrice.vendor.slug] ?? null,
          averageReviewRating: avgRating,
          reviewCount: ratings.length,
          priceRelativeToMedian:
            median && median > 0 ? Number(bestPrice.price) / median : undefined,
        })
      : null,
    finnrickRatings: finnrickRatingsMap,
    prices: peptide.prices.map((p) => {
      const vendorFinnrick = finnrickRatingsMap[p.vendor.slug] ?? null;
      const trustScore = computeTrustScore({
        finnrickRating: vendorFinnrick,
        averageReviewRating: avgRating,
        reviewCount: ratings.length,
        priceRelativeToMedian:
          median && median > 0 ? Number(p.price) / median : undefined,
      });
      return {
        id: p.id,
        vendorId: p.vendor.id,
        vendorName: p.vendor.name,
        vendorSlug: p.vendor.slug,
        vendorWebsite: p.vendor.website,
        price: Number(p.price),
        currency: p.currency,
        concentration: p.concentration,
        sku: p.sku,
        productUrl: p.productUrl,
        availabilityStatus: p.availabilityStatus,
        lastUpdated: p.lastUpdated,
        finnrickRating: vendorFinnrick,
        trustScore,
        finnrickTests: finnrickTestsMap[p.vendor.slug] ?? [],
      };
    }),
    reviews: peptide.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      body: r.body,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      user: {
        id: r.user.id,
        name: r.user.name,
        image: r.user.image,
      },
    })),
  } as PeptideDetail;
}

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const peptide = await getPeptideBySlug(slug);

  if (!peptide) {
    return { title: "Peptide Not Found | Peptide Daily" };
  }

  const priceSnippet =
    peptide.bestPrice !== null
      ? ` from $${peptide.bestPrice.toFixed(2)}`
      : "";
  const vendorSnippet =
    peptide.priceCount > 0
      ? ` across ${peptide.priceCount} vendor${peptide.priceCount !== 1 ? "s" : ""}`
      : "";

  return {
    title: `${peptide.name} Prices, Lab Data & Reviews | Peptide Daily`,
    description: `Compare ${peptide.name} prices${priceSnippet}${vendorSnippet}. ${peptide.reviewCount} community reviews, Finnrick lab grades, and trust scores. ${peptide.description ?? ""}`.trim(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATIONAL GUIDE PANEL
// ─────────────────────────────────────────────────────────────────────────────

function PeptideGuidePanel({ slug }: { slug: string }) {
  const guide = getPeptideGuide(slug);
  if (!guide) return null;

  const regColor = REGULATORY_COLORS[guide.regulatoryStatus];
  const risks = getCategoryRiskThemes(guide.category);

  return (
    <section
      className="mb-8 rounded-2xl border overflow-hidden"
      style={{
        borderColor: "var(--card-border)",
        background: "var(--surface)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      {/* Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4"
        style={{ borderColor: "var(--border)", background: "var(--surface-raised)" }}
      >
        <div className="flex items-center gap-3">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--brand-gold)" }}
            >
              What is this peptide?
            </p>
            <p className="text-base font-bold" style={{ color: "var(--foreground)" }}>
              {guide.name}
            </p>
          </div>
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{
              background: regColor.bg,
              color: regColor.text,
              border: `1px solid ${regColor.border}`,
            }}
          >
            {REGULATORY_LABELS[guide.regulatoryStatus]}
          </span>
        </div>
        <Link
          href={`/learn/${guide.slug}`}
          className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[var(--surface-raised)]"
          style={{
            borderColor: "var(--border)",
            color: "var(--accent)",
          }}
        >
          Full research explainer →
        </Link>
      </div>

      {/* Body */}
      <div className="grid gap-0 sm:grid-cols-2">
        {/* Overview */}
        <div className="p-6 border-b sm:border-b-0 sm:border-r" style={{ borderColor: "var(--border)" }}>
          <h3 className="mb-3 text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Overview
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
            {guide.shortSummary}
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
            {guide.overview[0]}
          </p>
          <div className="mt-4">
            <p
              className="mb-0.5 text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted)" }}
            >
              Regulatory note
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              {guide.statusNote}
            </p>
          </div>
        </div>

        {/* Safety overview */}
        <div className="p-6">
          <h3 className="mb-3 text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Safety &amp; Research Context
          </h3>
          {guide.safetyNotes.slice(0, 2).map((note, i) => (
            <p
              key={i}
              className="mb-2 text-sm leading-relaxed"
              style={{ color: "var(--foreground-secondary)" }}
            >
              {note}
            </p>
          ))}
          {risks.length > 0 && (
            <div className="mt-4">
              <p
                className="mb-2 text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                Common research-noted risk themes
              </p>
              <ul className="space-y-1">
                {risks.slice(0, 3).map((risk, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1.5 text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--warning)" }} aria-hidden="true" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link
            href={`/learn/${guide.slug}`}
            className="mt-5 inline-block text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            Read the full safety &amp; research overview →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT (Server Component)
// ─────────────────────────────────────────────────────────────────────────────

export default async function PeptideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const peptide = await getPeptideBySlug(slug);

  if (!peptide) {
    notFound();
  }

  // Build finnrick tests map keyed by vendor slug
  const finnrickTests: Record<string, FinnrickTestItem[]> = {};
  if (peptide.prices) {
    for (const price of peptide.prices) {
      const rat = (price as unknown as { finnrickTests?: FinnrickTestItem[] }).finnrickTests;
      if (rat) finnrickTests[price.vendorSlug] = rat;
    }
  }

  // Best Finnrick grade across all vendors
  const gradeOrder: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };
  const allGrades = peptide.prices
    .map((p) => p.finnrickRating?.grade)
    .filter(Boolean) as string[];
  const topGrade = allGrades.length > 0
    ? allGrades.reduce((best, g) => (gradeOrder[g] ?? 0) > (gradeOrder[best] ?? 0) ? g : best)
    : null;

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <Link
        href="/peptides"
        className="mb-6 inline-flex items-center gap-1 text-sm transition-colors hover:text-[var(--accent)]"
        style={{ color: "var(--muted)" }}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Catalog
      </Link>

      {/* Hero section */}
      <div
        className="mb-6 rounded-xl p-6 sm:p-8"
        style={{
          background: "var(--brand-navy)",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {/* Category pill */}
            {peptide.category && (
              <span
                className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
              >
                {peptide.category}
              </span>
            )}
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {peptide.name}
            </h1>
            {peptide.description && (
              <p
                className="mt-2 max-w-xl text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {peptide.description}
              </p>
            )}
          </div>

          {/* Key metrics */}
          <div className="flex shrink-0 flex-wrap gap-3 sm:flex-col sm:items-end">
            {peptide.bestPrice !== null && (
              <div className="text-right">
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Best price
                </p>
                <p className="text-2xl font-bold text-white">
                  ${peptide.bestPrice.toFixed(2)}
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {peptide.bestPriceVendor}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="mt-6 flex flex-wrap gap-4 border-t pt-4"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}
        >
          {/* Rating */}
          <div className="flex items-center gap-2">
            <StarRating rating={peptide.averageRating} size="sm" />
            <span className="text-sm text-white/80">
              {peptide.averageRating.toFixed(1)}
              <span className="text-white/50"> ({peptide.reviewCount} reviews)</span>
            </span>
          </div>

          {/* Best lab grade */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">Best lab grade:</span>
            {topGrade ? (
              <GradeBadge grade={topGrade as FinnrickGrade} compact />
            ) : (
              <GradeBadgeEmpty />
            )}
          </div>

          {/* Trust score */}
          {peptide.trustScore && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Trust:</span>
              <TrustScoreBar trustScore={peptide.trustScore} size="md" />
            </div>
          )}

          {/* Vendor count */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">
              {peptide.priceCount} vendor{peptide.priceCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Vendor comparison */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Vendor Prices
          </h2>
          <div className="flex items-center gap-2">
            {/* Trust badge for the peptide overall */}
            <TrustBadge
              type={deriveTrustBadge({
                hasLabData: allGrades.length > 0,
                grade: topGrade,
                trustScore: peptide.trustScore?.overall,
                testCount: peptide.prices.reduce(
                  (sum, p) => sum + (p.finnrickRating?.testCount ?? 0),
                  0,
                ),
              })}
              grade={topGrade ?? undefined}
            />
            <Badge variant="info" size="sm">Refreshed every 15 min</Badge>
          </div>
        </div>

        {/* Grade scale tip */}
        <GradeScaleTip className="mb-4" />

        <PriceTable
          prices={peptide.prices}
          peptideName={peptide.name}
          finnrickTests={finnrickTests}
        />
      </section>

      {/* Educational guide panel */}
      <PeptideGuidePanel slug={slug} />

      {/* Trust score explainer */}
      {peptide.trustScore && <TrustScoreTip className="mb-8" />}

      {/* Data transparency note */}
      <MedicalDisclaimer className="mb-8" />

      {/* Reviews (client component for interactivity) */}
      <ReviewSectionClient peptideId={peptide.id} reviews={peptide.reviews} />
    </div>
  );
}
