"use client";

import { useEffect, useState, useCallback } from "react";
import { StarRating } from "@/components/ui/star-rating";

interface AdminReview {
  id: string;
  rating: number;
  title: string;
  body: string;
  flagged: boolean;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
  peptide: { id: string; name: string; slug: string };
}

export default function AdminPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "flagged">("all");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter === "flagged" ? "?flagged=true" : "";
      const res = await fetch(`/api/admin/reviews${params}`);
      if (!res.ok) throw new Error("Unauthorized or failed");
      const data = await res.json();
      setReviews(data.data);
    } catch {
      // Will show empty state or redirect
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const toggleFlag = async (reviewId: string, flagged: boolean) => {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, flagged }),
    });
    await fetchReviews();
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Admin: Review Moderation</h1>
      <p className="mb-6 text-[var(--muted)]">
        Manage and moderate user reviews.
      </p>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-md px-4 py-2 text-sm ${
            filter === "all"
              ? "bg-[var(--accent)] text-white"
              : "border border-[var(--border)]"
          }`}
        >
          All Reviews
        </button>
        <button
          onClick={() => setFilter("flagged")}
          className={`rounded-md px-4 py-2 text-sm ${
            filter === "flagged"
              ? "bg-[var(--accent)] text-white"
              : "border border-[var(--border)]"
          }`}
        >
          Flagged Only
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-[var(--card-bg)]" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-[var(--muted)]">No reviews to display.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`rounded-lg border p-4 ${
                review.flagged
                  ? "border-[var(--danger)] bg-red-50 dark:bg-red-900/10"
                  : "border-[var(--card-border)] bg-[var(--card-bg)]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="font-medium">{review.title}</span>
                    {review.flagged && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Flagged
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    By {review.user.name || review.user.email} on{" "}
                    <strong>{review.peptide.name}</strong> &mdash;{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-sm">{review.body}</p>
                </div>

                <button
                  onClick={() => toggleFlag(review.id, !review.flagged)}
                  className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium ${
                    review.flagged
                      ? "bg-[var(--success)] text-white"
                      : "bg-[var(--danger)] text-white"
                  }`}
                >
                  {review.flagged ? "Unflag" : "Flag"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
