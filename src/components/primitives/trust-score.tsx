"use client";

import { cn } from "@/lib/cn";

function scoreColor(score: number) {
  if (score >= 80) return "var(--grade-a)";
  if (score >= 60) return "var(--grade-b)";
  if (score >= 40) return "var(--grade-c)";
  if (score >= 20) return "var(--grade-d)";
  return "var(--grade-e)";
}

const sizeMap = {
  sm: { size: 42, stroke: 4, number: "text-xs", caption: "text-[10px]" },
  md: { size: 60, stroke: 5, number: "text-sm", caption: "text-[11px]" },
  lg: { size: 88, stroke: 7, number: "text-xl", caption: "text-xs" },
} as const;

export function TrustScore({
  score,
  size = "md",
  showBreakdown = false,
  breakdown,
  className,
}: {
  score?: number | null;
  size?: keyof typeof sizeMap;
  showBreakdown?: boolean;
  breakdown?: {
    lab?: number | null;
    reviews?: number | null;
    pricing?: number | null;
  };
  className?: string;
}) {
  if (score == null) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm text-[var(--text-tertiary)]",
          className,
        )}
        style={{
          borderColor: "var(--border-default)",
          background: "var(--bg-secondary)",
        }}
      >
        <span className="font-medium">—</span>
        <span className="text-xs uppercase tracking-[0.08em]">No score yet</span>
      </div>
    );
  }

  const config = sizeMap[size];
  const radius = (config.size - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-[1.25rem] border px-3 py-2.5",
        className,
      )}
      style={{
        borderColor: "var(--border-default)",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="relative shrink-0">
        <svg width={config.size} height={config.size} className="-rotate-90 overflow-visible">
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke="rgba(168, 162, 158, 0.22)"
            strokeWidth={config.stroke}
          />
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-semibold tabular-nums text-[var(--text-primary)]", config.number)}>
            {score}
          </span>
          <span className={cn("font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)]", config.caption)}>
            trust
          </span>
        </div>
      </div>

      {showBreakdown && (
        <div className="min-w-[140px] space-y-2">
          {[
            { label: "Lab", value: breakdown?.lab ?? null },
            { label: "Reviews", value: breakdown?.reviews ?? null },
            { label: "Pricing", value: breakdown?.pricing ?? null },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                <span>{item.label}</span>
                <span className="font-mono">{item.value == null ? "—" : item.value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(168,162,158,0.18)]">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(0, Math.min(100, item.value ?? 0))}%`,
                    background: color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
