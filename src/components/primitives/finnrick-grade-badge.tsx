import type { FinnrickGrade } from "@/types";
import { cn } from "@/lib/cn";

const gradeStyleMap: Record<
  FinnrickGrade,
  {
    background: string;
    border: string;
    text: string;
    tooltip: string;
  }
> = {
  A: {
    background: "var(--accent-subtle)",
    border: "var(--accent-border)",
    text: "var(--grade-a)",
    tooltip: "Finnrick Grade A — Purity ≥98%, identity confirmed, quantity ±5%",
  },
  B: {
    background: "rgba(101, 163, 13, 0.08)",
    border: "rgba(101, 163, 13, 0.24)",
    text: "var(--grade-b)",
    tooltip: "Finnrick Grade B — Good purity and quantity alignment with minor variance",
  },
  C: {
    background: "rgba(202, 138, 4, 0.08)",
    border: "rgba(202, 138, 4, 0.24)",
    text: "var(--grade-c)",
    tooltip: "Finnrick Grade C — Acceptable quality with notable inconsistencies",
  },
  D: {
    background: "rgba(234, 88, 12, 0.08)",
    border: "rgba(234, 88, 12, 0.24)",
    text: "var(--grade-d)",
    tooltip: "Finnrick Grade D — Below-average results with significant lab issues",
  },
  E: {
    background: "rgba(220, 38, 38, 0.08)",
    border: "rgba(220, 38, 38, 0.24)",
    text: "var(--grade-e)",
    tooltip: "Finnrick Grade E — Poor results, major issues flagged in testing",
  },
};

const sizeMap = {
  sm: { box: "h-6 min-w-6 px-2 text-xs", radius: "rounded-md" },
  md: { box: "h-8 min-w-8 px-2.5 text-sm", radius: "rounded-lg" },
  lg: { box: "h-12 min-w-12 px-4 text-lg", radius: "rounded-xl" },
} as const;

export function FinnrickGradeBadge({
  grade,
  size = "md",
  className,
}: {
  grade: FinnrickGrade | null;
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  const sizeStyle = sizeMap[size];

  if (!grade) {
    return (
      <span
        title="Not yet tested by Finnrick"
        className={cn(
          "inline-flex items-center justify-center border font-semibold text-[var(--grade-none)]",
          sizeStyle.box,
          sizeStyle.radius,
          className,
        )}
        style={{
          background: "rgba(168, 162, 158, 0.08)",
          borderColor: "rgba(168, 162, 158, 0.24)",
        }}
      >
        —
      </span>
    );
  }

  const tone = gradeStyleMap[grade];

  return (
    <span
      title={tone.tooltip}
      className={cn(
        "inline-flex items-center justify-center border font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] animate-grade-pop",
        sizeStyle.box,
        sizeStyle.radius,
        className,
      )}
      style={{
        color: tone.text,
        background: tone.background,
        borderColor: tone.border,
      }}
    >
      {grade}
    </span>
  );
}
