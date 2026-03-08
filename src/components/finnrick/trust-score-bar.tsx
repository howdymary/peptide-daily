import type { TrustScore } from "@/types";

interface TrustScoreBarProps {
  trustScore: TrustScore;
  /** Show the breakdown tooltip */
  showBreakdown?: boolean;
}

function colorClass(score: number): string {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

export function TrustScoreBar({ trustScore, showBreakdown = true }: TrustScoreBarProps) {
  const { overall, finnrickScore, reviewScore, pricingScore, breakdown } = trustScore;

  const tooltipParts = [
    `Overall: ${overall}/100`,
    finnrickScore != null
      ? `Finnrick: ${finnrickScore} (${Math.round(breakdown.finnrickWeight * 100)}%)`
      : null,
    reviewScore != null
      ? `Reviews: ${reviewScore} (${Math.round(breakdown.reviewWeight * 100)}%)`
      : null,
    pricingScore != null
      ? `Pricing: ${pricingScore} (${Math.round(breakdown.pricingWeight * 100)}%)`
      : null,
    "PeptidePal combined score",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className="flex items-center gap-2"
      title={showBreakdown ? tooltipParts : undefined}
      aria-label={`Trust score: ${overall} out of 100`}
    >
      <div className="relative h-2 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all ${colorClass(overall)}`}
          style={{ width: `${overall}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums text-[var(--muted)]">
        {overall}
      </span>
    </div>
  );
}

/** Placeholder shown when trust score could not be computed. */
export function TrustScoreBarEmpty() {
  return (
    <span
      className="text-xs text-[var(--muted)]"
      title="Insufficient data to compute trust score"
    >
      —
    </span>
  );
}
