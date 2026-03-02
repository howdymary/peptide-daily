import Link from "next/link";
import { StarRating } from "@/components/ui/star-rating";
import type { PeptideListItem } from "@/types";

interface PeptideCardProps {
  peptide: PeptideListItem;
}

export function PeptideCard({ peptide }: PeptideCardProps) {
  return (
    <Link
      href={`/peptides/${peptide.slug}`}
      className="group block rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold group-hover:text-[var(--accent)]">
            {peptide.name}
          </h3>
          {peptide.category && (
            <p className="mt-1 text-xs text-[var(--muted)]">{peptide.category}</p>
          )}
        </div>

        {peptide.bestPrice !== null && (
          <div className="text-right">
            <p className="text-lg font-bold text-[var(--success)]">
              ${peptide.bestPrice.toFixed(2)}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {peptide.bestPriceVendor}
            </p>
          </div>
        )}
      </div>

      {peptide.description && (
        <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
          {peptide.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StarRating rating={peptide.averageRating} size="sm" />
          <span className="text-xs text-[var(--muted)]">
            {peptide.averageRating.toFixed(1)} ({peptide.reviewCount})
          </span>
        </div>

        <span className="text-xs text-[var(--muted)]">
          {peptide.priceCount} vendor{peptide.priceCount !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}
