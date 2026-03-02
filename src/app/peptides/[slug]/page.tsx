"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PriceTable } from "@/components/peptides/price-table";
import { ReviewList } from "@/components/reviews/review-list";
import { ReviewForm } from "@/components/reviews/review-form";
import { StarRating } from "@/components/ui/star-rating";
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

    // Refresh peptide data to show new review
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

    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to delete review");
      return;
    }

    await fetchPeptide();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-[var(--card-bg)]" />
        <div className="h-64 animate-pulse rounded-lg bg-[var(--card-bg)]" />
        <div className="h-48 animate-pulse rounded-lg bg-[var(--card-bg)]" />
      </div>
    );
  }

  if (error || !peptide) {
    return (
      <div className="rounded-lg border border-[var(--danger)] p-8 text-center">
        <p className="text-[var(--danger)]">{error || "Peptide not found"}</p>
        <Link href="/peptides" className="mt-4 inline-block text-[var(--accent)] hover:underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <Link
          href="/peptides"
          className="mb-4 inline-block text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          &larr; Back to catalog
        </Link>
        <h1 className="text-3xl font-bold">{peptide.name}</h1>
        {peptide.description && (
          <p className="mt-2 text-[var(--muted)]">{peptide.description}</p>
        )}

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StarRating rating={peptide.averageRating} />
            <span className="text-sm text-[var(--muted)]">
              {peptide.averageRating.toFixed(1)} ({peptide.reviewCount} review
              {peptide.reviewCount !== 1 ? "s" : ""})
            </span>
          </div>

          {peptide.bestPrice !== null && (
            <span className="text-lg font-bold text-[var(--success)]">
              Best: ${peptide.bestPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Price comparison table */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Vendor Prices</h2>
        <PriceTable prices={peptide.prices} />
      </section>

      {/* Reviews section */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
        <ReviewList
          reviews={peptide.reviews}
          onEdit={setEditingReview}
          onDelete={handleReviewDelete}
        />
      </section>

      {/* Review form */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">
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
              className="mt-2 text-sm text-[var(--muted)] hover:underline"
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
