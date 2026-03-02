import Image from "next/image";
import { StarRating } from "@/components/ui/star-rating";
import type { ReviewItem } from "@/types";

interface ReviewListProps {
  reviews: ReviewItem[];
  currentUserId?: string;
  onEdit?: (review: ReviewItem) => void;
  onDelete?: (reviewId: string) => void;
}

export function ReviewList({
  reviews,
  currentUserId,
  onEdit,
  onDelete,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)]">
        No reviews yet. Be the first to leave one!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                {review.user.image ? (
                  <Image
                    src={review.user.image}
                    alt={review.user.name || "User"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-medium text-white">
                    {(review.user.name || "U")[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">
                    {review.user.name || "Anonymous"}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {currentUserId === review.user.id && (
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(review)}
                    className="text-xs text-[var(--accent)] hover:underline"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(review.id)}
                    className="text-xs text-[var(--danger)] hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              <h4 className="font-medium">{review.title}</h4>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)] whitespace-pre-wrap">
              {review.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
