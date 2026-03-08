import Link from "next/link";
import { StarRating } from "@/components/ui/star-rating";
import { GradeBadge, GradeBadgeEmpty } from "@/components/finnrick/grade-badge";
import { TrustScoreBar, TrustScoreBarEmpty } from "@/components/finnrick/trust-score-bar";
import type { PeptideListItem } from "@/types";

interface PeptideCardProps {
  peptide: PeptideListItem;
}

export function PeptideCard({ peptide }: PeptideCardProps) {
  return (
    <Link
      href={`/peptides/${peptide.slug}`}
      className="group flex flex-col rounded-xl transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
        textDecoration: "none",
      }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div className="min-w-0 flex-1">
          <h3
            className="truncate font-semibold leading-snug transition-colors group-hover:text-[var(--accent)]"
            style={{ color: "var(--foreground)", fontSize: "0.9375rem" }}
          >
            {peptide.name}
          </h3>
          {peptide.category && (
            <p className="mt-0.5 text-xs font-medium" style={{ color: "var(--muted)" }}>
              {peptide.category}
            </p>
          )}
        </div>

        {/* Best Finnrick grade pill */}
        {peptide.bestFinnrickGrade ? (
          <GradeBadge grade={peptide.bestFinnrickGrade} compact />
        ) : (
          <GradeBadgeEmpty />
        )}
      </div>

      {/* Description */}
      {peptide.description && (
        <p
          className="line-clamp-2 px-5 text-sm leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {peptide.description}
        </p>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Divider */}
      <hr className="mx-5 mt-3 border-[var(--border)]" />

      {/* Footer */}
      <div className="flex items-end justify-between gap-2 p-5 pt-3">
        {/* Best price */}
        <div>
          {peptide.bestPrice !== null ? (
            <>
              <p
                className="text-xl font-bold tabular-nums leading-none"
                style={{ color: "var(--success)" }}
              >
                ${peptide.bestPrice.toFixed(2)}
              </p>
              <p
                className="mt-0.5 max-w-[130px] truncate text-xs"
                style={{ color: "var(--muted)" }}
              >
                {peptide.bestPriceVendor}
              </p>
            </>
          ) : (
            <p className="text-sm" style={{ color: "var(--muted-light)" }}>
              No price data
            </p>
          )}
        </div>

        {/* Right meta */}
        <div className="flex flex-col items-end gap-1.5">
          {peptide.trustScore ? (
            <TrustScoreBar trustScore={peptide.trustScore} />
          ) : (
            <TrustScoreBarEmpty />
          )}
          <div className="flex items-center gap-1.5">
            <StarRating rating={peptide.averageRating} size="sm" />
            <span className="text-xs tabular-nums" style={{ color: "var(--muted)" }}>
              {peptide.priceCount} vendor{peptide.priceCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
