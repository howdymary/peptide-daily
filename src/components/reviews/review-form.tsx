"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/star-rating";

interface ReviewFormProps {
  peptideId: string;
  onSubmit: (data: { rating: number; title: string; body: string }) => Promise<void>;
  initialValues?: { rating: number; title: string; body: string };
  isEditing?: boolean;
}

export function ReviewForm({
  peptideId,
  onSubmit,
  initialValues,
  isEditing = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialValues?.rating || 0);
  const [title, setTitle] = useState(initialValues?.title || "");
  const [body, setBody] = useState(initialValues?.body || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (title.length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }
    if (body.length < 20) {
      setError("Review must be at least 20 characters");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ rating, title, body });
      if (!isEditing) {
        setRating(0);
        setTitle("");
        setBody("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // peptideId used by parent — keep for form context
  void peptideId;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Rating</label>
        <div className="mt-1">
          <StarRating
            rating={rating}
            size="lg"
            interactive
            onChange={setRating}
          />
        </div>
      </div>

      <div>
        <label htmlFor="review-title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={200}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
      </div>

      <div>
        <label htmlFor="review-body" className="block text-sm font-medium">
          Review
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your detailed experience (minimum 20 characters)"
          rows={4}
          maxLength={5000}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
        <p className="mt-1 text-xs text-[var(--muted)]">{body.length}/5000</p>
      </div>

      {error && (
        <p className="text-sm text-[var(--danger)]">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting
          ? "Submitting..."
          : isEditing
            ? "Update Review"
            : "Submit Review"}
      </button>
    </form>
  );
}
