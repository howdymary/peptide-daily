import Link from "next/link";

interface VendorReviewSectionProps {
  reviews: Array<{
    id: string;
    peptideName: string;
    peptideSlug: string;
    rating: number;
    title: string;
    body: string;
    author: string;
    createdAt: string | Date;
  }>;
}

export function VendorReviewSection({ reviews }: VendorReviewSectionProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-[var(--border-default)] px-6 py-8">
        <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          Community reviews
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
          No community reviews are attached to this vendor&apos;s tracked peptides yet. As
          more readers review individual compounds, we&apos;ll surface those notes here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="surface-card rounded-[1.5rem] p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/peptides/${review.peptideSlug}`}
              className="text-sm font-medium text-[var(--accent-primary)] underline-offset-4 hover:underline"
            >
              {review.peptideName}
            </Link>
            <span className="font-mono text-sm text-[var(--text-secondary)]">
              {review.rating.toFixed(1)}/5
            </span>
          </div>

          <h3 className="mt-4 font-[var(--font-newsreader)] text-2xl leading-tight text-[var(--text-primary)]">
            {review.title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            {review.body}
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
            <span>{review.author}</span>
            <span aria-hidden="true">·</span>
            <span>{new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
