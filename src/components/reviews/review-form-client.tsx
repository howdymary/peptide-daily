"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewList } from "@/components/reviews/review-list";
import type { ReviewItem } from "@/types";

interface ReviewSectionClientProps {
  peptideId: string;
  reviews: ReviewItem[];
}

export function ReviewSectionClient({ peptideId, reviews }: ReviewSectionClientProps) {
  const router = useRouter();
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);

  const refreshData = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleReviewSubmit = async (data: {
    rating: number;
    title: string;
    body: string;
  }) => {
    const res = await fetch(`/api/peptides/${peptideId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to submit review");
    }
    refreshData();
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
    refreshData();
  };

  const handleReviewDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to delete review");
      return;
    }
    refreshData();
  };

  return (
    <>
      {/* Reviews list */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--foreground)" }}>
          Community Reviews
        </h2>
        <ReviewList
          reviews={reviews}
          onEdit={setEditingReview}
          onDelete={handleReviewDelete}
        />
      </section>

      {/* Review form */}
      <section
        className="rounded-xl p-6"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <h2 className="mb-4 text-lg font-bold" style={{ color: "var(--foreground)" }}>
          {editingReview ? "Edit your review" : "Leave a review"}
        </h2>
        {editingReview ? (
          <div>
            <ReviewForm
              peptideId={peptideId}
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
          <ReviewForm peptideId={peptideId} onSubmit={handleReviewSubmit} />
        )}
      </section>
    </>
  );
}
