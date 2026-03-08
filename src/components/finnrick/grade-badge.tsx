import type { FinnrickGrade } from "@/types";

interface GradeBadgeProps {
  grade: FinnrickGrade;
  averageScore?: number;
  testCount?: number;
  /** When true, shows a compact inline badge without score/test details */
  compact?: boolean;
}

const GRADE_CONFIG: Record<
  FinnrickGrade,
  { label: string; color: string; bg: string; border: string; description: string }
> = {
  A: {
    label: "Great",
    color: "var(--grade-a-text)",
    bg: "var(--grade-a-bg)",
    border: "var(--grade-a-border)",
    description: "Excellent purity and quantity accuracy across tests",
  },
  B: {
    label: "Good",
    color: "var(--grade-b-text)",
    bg: "var(--grade-b-bg)",
    border: "var(--grade-b-border)",
    description: "Good lab results with minor inconsistencies",
  },
  C: {
    label: "Okay",
    color: "var(--grade-c-text)",
    bg: "var(--grade-c-bg)",
    border: "var(--grade-c-border)",
    description: "Acceptable but inconsistent test results",
  },
  D: {
    label: "Poor",
    color: "var(--grade-d-text)",
    bg: "var(--grade-d-bg)",
    border: "var(--grade-d-border)",
    description: "Significant issues in lab testing",
  },
  E: {
    label: "Bad",
    color: "var(--grade-e-text)",
    bg: "var(--grade-e-bg)",
    border: "var(--grade-e-border)",
    description: "Major lab failures — serious quality concerns",
  },
};

export function GradeBadge({
  grade,
  averageScore,
  testCount,
  compact = false,
}: GradeBadgeProps) {
  const cfg = GRADE_CONFIG[grade];
  const tooltipText = [
    `Finnrick: ${grade} (${cfg.label})`,
    cfg.description,
    averageScore != null ? `Avg score: ${averageScore.toFixed(1)}` : null,
    testCount != null ? `${testCount} test${testCount !== 1 ? "s" : ""}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  if (compact) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-md text-xs font-bold leading-none"
        style={{
          color: cfg.color,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          padding: "2px 7px",
          minWidth: "24px",
        }}
        title={tooltipText}
        aria-label={`Finnrick grade ${grade}: ${cfg.label}`}
      >
        {grade}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-lg text-xs font-semibold"
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        padding: "4px 10px",
      }}
      title={tooltipText}
      aria-label={tooltipText}
    >
      <span className="font-bold">{grade}</span>
      <span className="font-medium opacity-80">{cfg.label}</span>
      {averageScore != null && (
        <span className="opacity-60">· {averageScore.toFixed(1)}</span>
      )}
      {testCount != null && (
        <span className="opacity-60">· {testCount}t</span>
      )}
    </span>
  );
}

/** Placeholder when no Finnrick data is available */
export function GradeBadgeEmpty() {
  return (
    <span
      className="inline-flex items-center rounded-md text-xs"
      style={{
        color: "var(--muted-light)",
        background: "var(--surface-raised)",
        border: "1px solid var(--border)",
        padding: "2px 8px",
      }}
      title="No Finnrick lab testing data available for this vendor"
    >
      No data
    </span>
  );
}
