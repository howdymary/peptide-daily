import type { TrustScore } from "@/types";

interface TrustScoreBarProps {
  trustScore: TrustScore;
  showBreakdown?: boolean;
  /** Size variant */
  size?: "sm" | "md";
}

function scoreColor(score: number): string {
  if (score >= 80) return "var(--success)";
  if (score >= 60) return "#10b981";
  if (score >= 40) return "var(--warning)";
  return "var(--danger)";
}

function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 55) return "Fair";
  if (score >= 35) return "Poor";
  return "Low";
}

export function TrustScoreBar({
  trustScore,
  showBreakdown = true,
  size = "sm",
}: TrustScoreBarProps) {
  const { overall, finnrickScore, reviewScore, pricingScore, breakdown } = trustScore;

  const tooltipParts = [
    `PeptidePal Trust Score: ${overall}/100 (${scoreLabel(overall)})`,
    finnrickScore != null
      ? `Lab testing: ${finnrickScore} (${Math.round(breakdown.finnrickWeight * 100)}% weight)`
      : "Lab testing: no data",
    reviewScore != null
      ? `Community reviews: ${reviewScore} (${Math.round(breakdown.reviewWeight * 100)}%)`
      : null,
    pricingScore != null
      ? `Pricing signal: ${pricingScore} (${Math.round(breakdown.pricingWeight * 100)}%)`
      : null,
    "This is PeptidePal's derived score, not Finnrick's rating.",
  ]
    .filter(Boolean)
    .join("\n");

  const barHeight = size === "md" ? "h-2.5" : "h-1.5";
  const barWidth = size === "md" ? "w-20" : "w-14";
  const color = scoreColor(overall);

  return (
    <div
      className="flex items-center gap-2"
      title={showBreakdown ? tooltipParts : `Trust score: ${overall}/100`}
      aria-label={`PeptidePal trust score: ${overall} out of 100 — ${scoreLabel(overall)}`}
    >
      <div
        className={`relative ${barHeight} ${barWidth} overflow-hidden rounded-full`}
        style={{ background: "var(--border)" }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full trust-bar-fill"
          style={{ width: `${overall}%`, background: color }}
          aria-hidden="true"
        />
      </div>
      <span
        className="text-xs font-semibold tabular-nums"
        style={{ color }}
      >
        {overall}
      </span>
    </div>
  );
}

/** Placeholder when trust score cannot be computed */
export function TrustScoreBarEmpty() {
  return (
    <span
      className="text-xs"
      style={{ color: "var(--muted-light)" }}
      title="Insufficient data to compute trust score"
    >
      —
    </span>
  );
}
