import Link from "next/link";
import { GradeBadge, GradeBadgeEmpty } from "@/components/finnrick/grade-badge";
import { TrustScoreBar, TrustScoreBarEmpty } from "@/components/finnrick/trust-score-bar";
import type { TrustScore } from "@/types";

export interface PeptideSnapshotData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  bestPrice: number | null;
  bestPriceVendor: string | null;
  priceCount: number;
  bestFinnrickGrade: string | null;
  trustScore: TrustScore | null;
  topVendors: { vendorName: string; vendorSlug: string; price: number; currency: string }[];
}

export function PeptideSnapshotCard({ peptide }: { peptide: PeptideSnapshotData }) {
  return (
    <Link
      href={`/peptides/${peptide.slug}`}
      className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{ boxShadow: "var(--card-shadow)", textDecoration: "none" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3
            className="truncate text-sm font-bold leading-snug transition-colors group-hover:text-[var(--accent)]"
            style={{ color: "var(--foreground)" }}
          >
            {peptide.name}
          </h3>
          {peptide.category && (
            <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
              {peptide.category}
            </p>
          )}
        </div>
        {peptide.bestFinnrickGrade ? (
          <GradeBadge grade={peptide.bestFinnrickGrade as "A" | "B" | "C" | "D" | "E"} compact />
        ) : (
          <GradeBadgeEmpty />
        )}
      </div>

      {/* Price + trust */}
      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          {peptide.bestPrice !== null ? (
            <>
              <p
                className="text-xl font-bold tabular-nums leading-none"
                style={{ color: "var(--success)" }}
              >
                ${peptide.bestPrice.toFixed(2)}
              </p>
              <p className="mt-0.5 max-w-[110px] truncate text-xs" style={{ color: "var(--muted)" }}>
                {peptide.bestPriceVendor}
              </p>
            </>
          ) : (
            <p className="text-xs" style={{ color: "var(--muted-light)" }}>
              No price data
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {peptide.trustScore ? (
            <TrustScoreBar trustScore={peptide.trustScore} />
          ) : (
            <TrustScoreBarEmpty />
          )}
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {peptide.priceCount} vendor{peptide.priceCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Mini price table */}
      {peptide.topVendors.length > 1 && (
        <div
          className="mt-3 space-y-1 rounded-lg p-2"
          style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
        >
          {peptide.topVendors.slice(0, 3).map((v, i) => (
            <div key={v.vendorSlug} className="flex items-center justify-between">
              <span
                className="truncate text-xs"
                style={{ color: i === 0 ? "var(--foreground)" : "var(--muted)" }}
              >
                {v.vendorName}
              </span>
              <span
                className="ml-2 shrink-0 text-xs font-semibold tabular-nums"
                style={{ color: i === 0 ? "var(--success)" : "var(--muted)" }}
              >
                ${v.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
