import type { FinnrickGrade } from "@/types";

interface GradeBadgeProps {
  grade: FinnrickGrade;
  averageScore?: number;
  testCount?: number;
  /** When true, shows a compact inline badge without the tooltip text */
  compact?: boolean;
}

const GRADE_CONFIG: Record<
  FinnrickGrade,
  { label: string; bg: string; text: string; border: string }
> = {
  A: {
    label: "Great",
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-400",
    border: "border-green-200 dark:border-green-700",
  },
  B: {
    label: "Good",
    bg: "bg-teal-100 dark:bg-teal-900/30",
    text: "text-teal-800 dark:text-teal-400",
    border: "border-teal-200 dark:border-teal-700",
  },
  C: {
    label: "Okay",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-700",
  },
  D: {
    label: "Poor",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-800 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-700",
  },
  E: {
    label: "Bad",
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-400",
    border: "border-red-200 dark:border-red-700",
  },
};

export function GradeBadge({ grade, averageScore, testCount, compact = false }: GradeBadgeProps) {
  const config = GRADE_CONFIG[grade];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold ${config.bg} ${config.text} ${config.border}`}
        title={
          averageScore != null
            ? `Finnrick: ${grade} (${config.label}) — Score: ${averageScore.toFixed(1)}${testCount != null ? `, ${testCount} tests` : ""}`
            : `Finnrick: ${grade} (${config.label})`
        }
      >
        {grade}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text} ${config.border}`}
    >
      <span className="font-bold">{grade}</span>
      <span className="font-normal opacity-80">{config.label}</span>
      {averageScore != null && (
        <span className="font-normal opacity-60">· {averageScore.toFixed(1)}</span>
      )}
      {testCount != null && (
        <span className="font-normal opacity-60">· {testCount}t</span>
      )}
    </span>
  );
}

/** Small "N/A" placeholder shown when no Finnrick data is available. */
export function GradeBadgeEmpty() {
  return (
    <span className="text-xs text-[var(--muted)]" title="No Finnrick lab testing data available">
      N/A
    </span>
  );
}
