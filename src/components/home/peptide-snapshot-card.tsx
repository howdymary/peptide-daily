"use client";

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

/** Category → left-border accent color */
const CATEGORY_ACCENT: Record<string, string> = {
  "GLP-1":          "#0570b0",
  "Recovery":       "#0d9488",
  "Growth Hormone": "#7c3aed",
  "Cosmetic":       "#db2777",
  "Nootropic":      "#059669",
};

function categoryAccent(cat: string | null): string {
  if (!cat) return "var(--brand-gold)";
  return CATEGORY_ACCENT[cat] ?? "var(--brand-gold)";
}

interface Props {
  peptide: PeptideSnapshotData;
  /** Render on dark (navy) background */
  dark?: boolean;
}

export function PeptideSnapshotCard({ peptide, dark = false }: Props) {
  const accent = categoryAccent(peptide.category);

  const cardBg = dark ? "rgb(255 255 255 / 0.06)" : "var(--card-bg)";
  const cardBorder = dark ? "rgb(255 255 255 / 0.10)" : "var(--card-border)";
  const titleColor = dark ? "#ffffff" : "var(--foreground)";
  const mutedColor = dark ? "rgb(255 255 255 / 0.5)" : "var(--muted)";
  const subBg = dark ? "rgb(255 255 255 / 0.06)" : "var(--surface-raised)";
  const subBorder = dark ? "rgb(255 255 255 / 0.08)" : "var(--border)";
  const priceRowColor = dark ? "rgb(255 255 255 / 0.9)" : "var(--foreground)";

  return (
    <Link
      href={`/peptides/${peptide.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: dark ? "none" : "var(--card-shadow)",
        textDecoration: "none",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        if (!dark)
          (e.currentTarget as HTMLElement).style.boxShadow =
            "var(--card-shadow-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        if (!dark)
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow)";
      }}
    >
      {/* Category accent bar */}
      <div className="h-1 w-full shrink-0" style={{ background: accent }} />

      <div className="flex flex-1 flex-col p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              className="truncate text-sm font-bold leading-snug transition-colors group-hover:text-[var(--accent)]"
              style={{ color: titleColor }}
            >
              {peptide.name}
            </h3>
            {peptide.category && (
              <p className="mt-0.5 text-xs" style={{ color: mutedColor }}>
                {peptide.category}
              </p>
            )}
          </div>
          {peptide.bestFinnrickGrade ? (
            <GradeBadge
              grade={peptide.bestFinnrickGrade as "A" | "B" | "C" | "D" | "E"}
              compact
            />
          ) : (
            <GradeBadgeEmpty />
          )}
        </div>

        {/* Price + trust */}
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            {peptide.bestPrice !== null ? (
              <>
                <p
                  className="text-2xl font-bold tabular-nums leading-none"
                  style={{ color: dark ? "#4ade80" : "var(--success)" }}
                >
                  ${peptide.bestPrice.toFixed(2)}
                </p>
                <p
                  className="mt-1 max-w-[110px] truncate text-xs"
                  style={{ color: mutedColor }}
                >
                  {peptide.bestPriceVendor}
                </p>
              </>
            ) : (
              <p className="text-xs" style={{ color: mutedColor }}>
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
            <p className="text-xs" style={{ color: mutedColor }}>
              {peptide.priceCount} vendor{peptide.priceCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Mini price table */}
        {peptide.topVendors.length > 1 && (
          <div
            className="mt-4 space-y-1.5 rounded-lg p-2.5"
            style={{ background: subBg, border: `1px solid ${subBorder}` }}
          >
            {peptide.topVendors.slice(0, 3).map((v, i) => (
              <div key={v.vendorSlug} className="flex items-center justify-between gap-2">
                <span
                  className="truncate text-xs"
                  style={{ color: i === 0 ? priceRowColor : mutedColor }}
                >
                  {v.vendorName}
                </span>
                <span
                  className="shrink-0 text-xs font-semibold tabular-nums"
                  style={{
                    color: i === 0
                      ? (dark ? "#4ade80" : "var(--success)")
                      : mutedColor,
                  }}
                >
                  ${v.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
