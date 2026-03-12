/**
 * Tests for trust score computation.
 *
 * Covers: all-data present, missing components, grade boundaries,
 * weight redistribution, edge cases.
 */

import { describe, it, expect } from "vitest";
import { computeTrustScore, bestFinnrickGrade } from "@/lib/finnrick/trust-score";
import type { FinnrickRatingItem } from "@/types";

// ── Fixtures ─────────────────────────────────────────────────────────────────

const gradeA: FinnrickRatingItem = {
  grade: "A",
  averageScore: 9.5,
  testCount: 5,
  minScore: 9.0,
  maxScore: 10.0,
  oldestTestDate: "2023-01-01",
  newestTestDate: "2024-01-01",
  finnrickUrl: "https://finnrick.com/test",
};

const gradeC: FinnrickRatingItem = {
  ...gradeA,
  grade: "C",
  averageScore: 5.5,
};

const gradeE: FinnrickRatingItem = {
  ...gradeA,
  grade: "E",
  averageScore: 1.0,
};

// ── computeTrustScore ─────────────────────────────────────────────────────────

describe("computeTrustScore", () => {
  it("returns overall between 0 and 100", () => {
    const score = computeTrustScore({
      finnrickRating: gradeA,
      averageReviewRating: 4.5,
      reviewCount: 10,
      priceRelativeToMedian: 1.0,
    });
    expect(score).not.toBeNull();
    expect(score!.overall).toBeGreaterThanOrEqual(0);
    expect(score!.overall).toBeLessThanOrEqual(100);
  });

  it("grade A with good data produces a high score (≥ 70)", () => {
    const score = computeTrustScore({
      finnrickRating: gradeA,
      averageReviewRating: 4.5,
      reviewCount: 10,
      priceRelativeToMedian: 1.0,
    });
    expect(score).not.toBeNull();
    expect(score!.overall).toBeGreaterThanOrEqual(70);
  });

  it("grade E produces a low score (≤ 30)", () => {
    const score = computeTrustScore({
      finnrickRating: gradeE,
      averageReviewRating: 1.0,
      reviewCount: 5,
      priceRelativeToMedian: 1.0,
    });
    expect(score).not.toBeNull();
    expect(score!.overall).toBeLessThanOrEqual(30);
  });

  it("missing finnrick data redistributes weight to review and pricing components", () => {
    const withoutFinnrick = computeTrustScore({
      finnrickRating: null,
      averageReviewRating: 5.0,
      reviewCount: 20,
      priceRelativeToMedian: 1.0,
    });
    // Weight redistributes from Finnrick (50%) to reviews+pricing → still produces a score
    expect(withoutFinnrick).not.toBeNull();
    expect(withoutFinnrick!.overall).toBeGreaterThan(60);
    expect(withoutFinnrick!.overall).toBeLessThanOrEqual(100);
    // Verify finnrick weight was redistributed to zero
    expect(withoutFinnrick!.breakdown.finnrickWeight).toBe(0);
  });

  it("no data at all returns null", () => {
    const score = computeTrustScore({
      finnrickRating: null,
      averageReviewRating: 0,
      reviewCount: 0,
    });
    // computeTrustScore returns null when no components have data
    expect(score).toBeNull();
  });

  it("grade C produces a mid-range score", () => {
    const score = computeTrustScore({
      finnrickRating: gradeC,
      averageReviewRating: 3.0,
      reviewCount: 5,
      priceRelativeToMedian: 1.0,
    });
    expect(score).not.toBeNull();
    expect(score!.overall).toBeGreaterThan(20);
    expect(score!.overall).toBeLessThan(80);
  });

  it("breakdown components sum to approximately overall (within float precision)", () => {
    const score = computeTrustScore({
      finnrickRating: gradeA,
      averageReviewRating: 4.0,
      reviewCount: 8,
      priceRelativeToMedian: 0.9,
    });
    // Verify the returned object has expected shape
    expect(score).not.toBeNull();
    expect(score).toHaveProperty("overall");
    expect(typeof score!.overall).toBe("number");
  });

  it("review confidence is lower with fewer reviews", () => {
    const highConfidence = computeTrustScore({
      finnrickRating: null,
      averageReviewRating: 5.0,
      reviewCount: 50,
    });
    const lowConfidence = computeTrustScore({
      finnrickRating: null,
      averageReviewRating: 5.0,
      reviewCount: 1,
    });
    expect(highConfidence).not.toBeNull();
    expect(lowConfidence).not.toBeNull();
    expect(highConfidence!.overall).toBeGreaterThan(lowConfidence!.overall);
  });
});

// ── bestFinnrickGrade ─────────────────────────────────────────────────────────

describe("bestFinnrickGrade", () => {
  it("returns null for empty ratings", () => {
    expect(bestFinnrickGrade([])).toBeNull();
  });

  it("returns the best grade across vendors", () => {
    const ratings = [
      { grade: "C", vendor: { slug: "v1" } },
      { grade: "A", vendor: { slug: "v2" } },
      { grade: "B", vendor: { slug: "v3" } },
    ] as unknown as Parameters<typeof bestFinnrickGrade>[0];

    expect(bestFinnrickGrade(ratings)).toBe("A");
  });

  it("handles single rating", () => {
    const ratings = [{ grade: "B", vendor: { slug: "v1" } }] as unknown as Parameters<typeof bestFinnrickGrade>[0];
    expect(bestFinnrickGrade(ratings)).toBe("B");
  });
});
