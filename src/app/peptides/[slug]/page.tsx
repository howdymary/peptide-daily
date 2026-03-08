"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PriceTable } from "@/components/peptides/price-table";
import { ReviewList } from "@/components/reviews/review-list";
import { ReviewForm } from "@/components/reviews/review-form";
import { StarRating } from "@/components/ui/star-rating";
import { GradeBadge, GradeBadgeEmpty } from "@/components/finnrick/grade-badge";
import { TrustScoreBar } from "@/components/finnrick/trust-score-bar";
import { Badge } from "@/components/ui/badge";
import type { PeptideDetail, ReviewItem } from "@/types";

export default function PeptideDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [peptide, setPeptide] = useState<PeptideDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);

  const fetchPeptide = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/peptides/${slug}`);
      if (!res.ok) throw new Error("Failed to load peptide");
      const data = await res.json();
      setPeptide(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPeptide();
  }, [fetchPeptide]);

  const handleReviewSubmit = async (data: {
    rating: number;
    title: string;
    body: string;
  }) => {
    if (!peptide) return;
    const res = await fetch(`/api/peptides/${peptide.id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to submit review");
    }
    await fetchPeptide();
  };

  const handleReviewEdit = async (data: {
    rating: number;
    title: string;
    body: string;
  }) => {
    if (!editingReview) return;
    const res = await fetch(`/api/reviews/${editingReview.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update review");
    }
    setEditingReview(null);
    await fetchPeptide();
  };

  const handleReviewDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to delete review");
      return;
    }
    await fetchPeptide();
  };

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container-page py-8">
        <div className="skeleton mb-2 h-4 w-32 rounded" />
        <div className="skeleton mb-6 h-8 w-64 rounded" />
        <div className="skeleton mb-8 h-24 w-full rounded-xl" />
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────
  if (error || !peptide) {
    return (
      <div className="container-page py-12">
        <div
          className="rounded-xl p-8 text-center"
          style={{ border: "1px solid var(--danger-border)", background: "var(--danger-bg)" }}
        >
          <p className="font-medium" style={{ color: "var(--danger)" }}>
            {error || "Peptide not found"}
          </p>
          <Link
            href="/peptides"
            className="mt-4 inline-block text-sm font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            ← Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  // Build finnrick tests map keyed by vendor slug
  const finnrickTests: Record<string, import("@/types").FinnrickTestItem[]> = {};
  if (peptide.prices) {
    for (const price of peptide.prices) {
      // Tests are embedded in price items via the [id] API
      const rat = (price as unknown as { finnrickTests?: import("@/types").FinnrickTestItem[] }).finnrickTests;
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

      {/* ── Hero section ──────────────────────────────────────────────── */}
      <div
        className="mb-6 rounded-2xl p-6 sm:p-8"
        style={{
          background: "linear-gradient(135deg, var(--brand-navy) 0%, #164e63 100%)",
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
              <GradeBadge grade={topGrade as import("@/types").FinnrickGrade} compact />
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

      {/* ── Vendor comparison ─────────────────────────────────────────── */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Vendor Prices
          </h2>
          <Badge variant="info" size="sm">
            Updated every 15 min
          </Badge>
        </div>
        <PriceTable
          prices={peptide.prices}
          peptideName={peptide.name}
          finnrickTests={finnrickTests}
        />
      </section>

      {/* ── Data transparency note ──────────────────────────────────── */}
      <div
        className="mb-8 rounded-xl p-4"
        style={{
          background: "var(--info-bg)",
          border: "1px solid var(--info-border)",
        }}
      >
        <div className="flex gap-3">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: "var(--info)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--info)" }}>
              About the data shown
            </p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
              <strong>Finnrick grades</strong> are independent third-party lab testing results published at{" "}
              <a href="https://www.finnrick.com" target="_blank" rel="noopener noreferrer" className="underline">
                finnrick.com
              </a>
              . PeptidePal imports this data and displays it without modification.{" "}
              <strong>Trust Scores</strong> are PeptidePal&apos;s own derived metric (not Finnrick&apos;s) combining lab data, community reviews, and pricing signals.{" "}
              <strong>This is not medical advice.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ── Reviews ───────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--foreground)" }}>
          Community Reviews
        </h2>
        <ReviewList
          reviews={peptide.reviews}
          onEdit={setEditingReview}
          onDelete={handleReviewDelete}
        />
      </section>

      {/* ── Review form ───────────────────────────────────────────────── */}
      <section
        className="rounded-xl p-6"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <h2 className="mb-4 text-lg font-bold" style={{ color: "var(--foreground)" }}>
          {editingReview ? "Edit Your Review" : "Write a Review"}
        </h2>
        {editingReview ? (
          <div>
            <ReviewForm
              peptideId={peptide.id}
              onSubmit={handleReviewEdit}
              initialValues={{
                rating: editingReview.rating,
                title: editingReview.title,
                body: editingReview.body,
              }}
              isEditing
            />
            <button
              onClick={() => setEditingReview(null)}
              className="mt-3 text-sm transition hover:opacity-70"
              style={{ color: "var(--muted)" }}
            >
              Cancel editing
            </button>
          </div>
        ) : (
          <ReviewForm peptideId={peptide.id} onSubmit={handleReviewSubmit} />
        )}
      </section>
    </div>
  );
}
