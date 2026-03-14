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
import { TrustBadge, deriveTrustBadge } from "@/components/ui/trust-badge";
import { GradeScaleTip, TrustScoreTip } from "@/components/ui/onboarding-tip";
import { MedicalDisclaimer } from "@/components/ui/info-banner";
import { getPeptideGuide, getCategoryRiskThemes } from "@/lib/learn/content-service";
import { REGULATORY_LABELS, REGULATORY_COLORS } from "@/lib/learn/peptide-data";
import type { PeptideDetail, ReviewItem } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATIONAL GUIDE PANEL — shown on each peptide price/review page
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
            <Badge variant="info" size="sm">Updated every 15 min</Badge>
          </div>
        </div>

        {/* Grade scale tip — shown once, then dismissed */}
        <GradeScaleTip className="mb-4" />

        <PriceTable
          prices={peptide.prices}
          peptideName={peptide.name}
          finnrickTests={finnrickTests}
        />
      </section>

      {/* ── Educational guide panel ───────────────────────────────────── */}
      <PeptideGuidePanel slug={slug} />

      {/* ── Trust score explainer ────────────────────────────────────── */}
      {peptide.trustScore && <TrustScoreTip className="mb-8" />}

      {/* ── Data transparency note ──────────────────────────────────── */}
      <MedicalDisclaimer className="mb-8" />

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
