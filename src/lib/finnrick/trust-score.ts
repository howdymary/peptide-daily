import type { FinnrickGrade, FinnrickRatingItem, TrustScore } from "@/types";

/**
 * Computes PeptidePal's combined "trust score" (0–100) for a vendor+peptide offer.
 *
 * Components:
 *  - Finnrick (default weight 0.50): official lab-testing grade from finnrick.com
 *  - Reviews  (default weight 0.30): community review rating on this platform
 *  - Pricing  (default weight 0.20): price signal relative to median across vendors
 *
 * When a component is absent its weight is redistributed proportionally to
 * whichever components ARE present.  If no components are present, null is returned.
 *
 * IMPORTANT: this score is labelled as PeptidePal-derived and never presented
 * as Finnrick's own rating.  Raw Finnrick values are stored and displayed separately.
 */

const GRADE_BASE: Record<string, number> = {
  A: 90,
  B: 75,
  C: 55,
  D: 35,
  E: 15,
};

/** Numeric ordering for grades (higher = better). Used for sorting and comparisons. */
export const GRADE_ORDER: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };

/** Returns the best (highest-letter) grade from an array of rated objects. */
export function bestFinnrickGrade<T extends { grade: string }>(
  ratings: T[],
): FinnrickGrade | null {
  if (ratings.length === 0) return null;
  return ratings.reduce((best, r) =>
    (GRADE_ORDER[r.grade] ?? 0) > (GRADE_ORDER[best.grade] ?? 0) ? r : best,
  ).grade as FinnrickGrade;
}

/** Grade band half-widths for score adjustment */
const GRADE_BAND: Record<string, [number, number]> = {
  A: [8.0, 10.0],
  B: [6.5, 7.9],
  C: [5.0, 6.4],
  D: [3.5, 4.9],
  E: [0.0, 3.4],
};

function finnrickToComponent(rating: FinnrickRatingItem): number {
  const base = GRADE_BASE[rating.grade] ?? 55;
  const [lo, hi] = GRADE_BAND[rating.grade] ?? [0, 10];
  const range = hi - lo;
  if (range <= 0) return base;
  const pos = Math.max(0, Math.min(1, (rating.averageScore - lo) / range));
  // ±10 adjustment within the band
  return base + (pos - 0.5) * 20;
}

function reviewToComponent(avgRating: number, reviewCount: number): number {
  const confidence = Math.min(1, reviewCount / 10);
  return (avgRating / 5) * 100 * confidence;
}

function pricingToComponent(priceRelativeToMedian: number): number {
  // Ideal range: 0.7x–1.3x median → score 100, tapering towards extremes
  const deviation = Math.abs(priceRelativeToMedian - 1.0);
  if (deviation <= 0.3) return 100;
  // Linear taper from 100 at 0.3 deviation to 60 at 1.0 deviation
  return Math.max(60, 100 - ((deviation - 0.3) / 0.7) * 40);
}

export interface TrustScoreParams {
  finnrickRating: FinnrickRatingItem | null;
  averageReviewRating: number; // 0–5 scale
  reviewCount: number;
  /** price / median price across vendors; undefined → pricing signal skipped */
  priceRelativeToMedian?: number;
}

export function computeTrustScore(params: TrustScoreParams): TrustScore | null {
  const { finnrickRating, averageReviewRating, reviewCount, priceRelativeToMedian } = params;

  const finnrickScore = finnrickRating ? finnrickToComponent(finnrickRating) : null;
  const reviewScore = reviewCount > 0 ? reviewToComponent(averageReviewRating, reviewCount) : null;
  const pricingScore =
    priceRelativeToMedian != null ? pricingToComponent(priceRelativeToMedian) : null;

  // Determine which components are present
  const components: Array<{ score: number; defaultWeight: number; key: keyof TrustScore["breakdown"] }> = [];
  if (finnrickScore !== null) components.push({ score: finnrickScore, defaultWeight: 0.5, key: "finnrickWeight" });
  if (reviewScore !== null) components.push({ score: reviewScore, defaultWeight: 0.3, key: "reviewWeight" });
  if (pricingScore !== null) components.push({ score: pricingScore, defaultWeight: 0.2, key: "pricingWeight" });

  if (components.length === 0) return null;

  // Redistribute weights proportionally
  const totalDefault = components.reduce((s, c) => s + c.defaultWeight, 0);
  const adjusted = components.map((c) => ({
    ...c,
    weight: c.defaultWeight / totalDefault,
  }));

  const overall = adjusted.reduce((s, c) => s + c.score * c.weight, 0);

  const getWeight = (key: keyof TrustScore["breakdown"]) =>
    adjusted.find((c) => c.key === key)?.weight ?? 0;

  return {
    overall: Math.round(overall),
    finnrickScore: finnrickScore !== null ? Math.round(finnrickScore) : null,
    reviewScore: reviewScore !== null ? Math.round(reviewScore) : null,
    pricingScore: pricingScore !== null ? Math.round(pricingScore) : null,
    breakdown: {
      finnrickWeight: getWeight("finnrickWeight"),
      reviewWeight: getWeight("reviewWeight"),
      pricingWeight: getWeight("pricingWeight"),
    },
  };
}
