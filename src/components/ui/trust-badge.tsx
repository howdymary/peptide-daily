/**
 * TrustBadge — visual trust signal chips displayed alongside ratings / prices.
 *
 * Communicates provenance at a glance:
 *   "Lab-tested"      — has Finnrick data
 *   "Grade A"         — specific grade
 *   "High confidence" — trust score ≥ 80
 *   "Limited data"    — few tests / reviews
 *   "No rating yet"   — no Finnrick data
 *   "User reviews"    — only user-generated data
 *
 * Usage:
 *   <TrustBadge type="lab-tested" />
 *   <TrustBadge type="grade" grade="A" />
 *   <TrustBadge type="no-rating" />
 */

import type { ReactNode } from "react";

type TrustBadgeType =
  | "lab-tested"
  | "grade"
  | "high-confidence"
  | "limited-data"
  | "no-rating"
  | "user-reviews"
  | "new-data";

interface TrustBadgeProps {
  type: TrustBadgeType;
  grade?: string;
  className?: string;
}

interface BadgeMeta {
  label: (grade?: string) => string;
  icon: ReactNode;
  bg: string;
  text: string;
  border: string;
  tooltip: (grade?: string) => string;
}

const BADGE_META: Record<TrustBadgeType, BadgeMeta> = {
  "lab-tested": {
    label: () => "Lab-tested",
    icon: "🔬",
    bg: "#f0fdf4",
    text: "#15803d",
    border: "#bbf7d0",
    tooltip: () =>
      "This peptide has been independently tested by Finnrick. Results show purity, quantity accuracy, and identity.",
  },
  "grade": {
    label: (g) => `Grade ${g ?? "?"}`,
    icon: "✓",
    bg: "#eff6ff",
    text: "#1d4ed8",
    border: "#bfdbfe",
    tooltip: (g) =>
      `Finnrick assigned a grade of ${g ?? "unknown"}. Grades run A (best) to E (fail).`,
  },
  "high-confidence": {
    label: () => "High confidence",
    icon: "⭐",
    bg: "#fefce8",
    text: "#a16207",
    border: "#fde68a",
    tooltip: () =>
      "Trust Score ≥ 80. This peptide has strong lab data, consistent user reviews, and fair pricing.",
  },
  "limited-data": {
    label: () => "Limited data",
    icon: "⚠",
    bg: "#fffbeb",
    text: "#d97706",
    border: "#fde68a",
    tooltip: () =>
      "Fewer than 3 lab tests or reviews available. Treat this rating with caution.",
  },
  "no-rating": {
    label: () => "No rating yet",
    icon: "–",
    bg: "var(--surface-raised)",
    text: "var(--muted)",
    border: "var(--border)",
    tooltip: () =>
      "No Finnrick lab data available for this peptide / vendor combination.",
  },
  "user-reviews": {
    label: () => "User reviews",
    icon: "💬",
    bg: "#faf5ff",
    text: "#7e22ce",
    border: "#e9d5ff",
    tooltip: () =>
      "Rating is based on user reviews only — no independent lab testing data available.",
  },
  "new-data": {
    label: () => "New lab data",
    icon: "🆕",
    bg: "#ecfeff",
    text: "#0e7490",
    border: "#a5f3fc",
    tooltip: () =>
      "Finnrick has published new lab results for this vendor in the past 7 days.",
  },
};

export function TrustBadge({ type, grade, className = "" }: TrustBadgeProps) {
  const meta = BADGE_META[type];

  return (
    <span
      role="img"
      aria-label={meta.label(grade)}
      title={meta.tooltip(grade)}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}
      style={{
        background: meta.bg,
        color: meta.text,
        border: `1px solid ${meta.border}`,
      }}
    >
      <span aria-hidden="true">{meta.icon}</span>
      {meta.label(grade)}
    </span>
  );
}

/**
 * Derive the most appropriate trust badge from peptide data.
 * Returns the "best" badge to show (most specific / most positive).
 */
export function deriveTrustBadge(params: {
  hasLabData: boolean;
  grade?: string | null;
  trustScore?: number | null;
  testCount?: number;
  hasNewData?: boolean;
}): TrustBadgeType {
  if (params.hasNewData) return "new-data";
  if (!params.hasLabData) return "no-rating";
  if (params.testCount !== undefined && params.testCount < 3) return "limited-data";
  if (params.trustScore !== null && params.trustScore !== undefined && params.trustScore >= 80) return "high-confidence";
  if (params.grade) return "grade";
  return "lab-tested";
}
