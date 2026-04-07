interface EditorialReviewCardProps {
  review: {
    testingScore: number;
    catalogScore: number;
    pricingScore: number;
    reputationScore: number;
    shippingScore: number;
    paymentScore: number;
    overallScore: number;
    summary: string;
    prosJson: string;
    consJson: string;
    verdict: string;
    authorName: string;
    reviewDate: Date;
  };
}

const DIMENSIONS = [
  { key: "testingScore", label: "Lab Testing" },
  { key: "catalogScore", label: "Product Catalog" },
  { key: "pricingScore", label: "Pricing" },
  { key: "reputationScore", label: "Reputation" },
  { key: "shippingScore", label: "Shipping" },
  { key: "paymentScore", label: "Payment Options" },
] as const;

function scoreColor(score: number): string {
  if (score >= 8) return "var(--grade-a, oklch(55% 0.18 145))";
  if (score >= 6) return "var(--grade-b, oklch(55% 0.12 240))";
  if (score >= 4) return "var(--grade-c, oklch(60% 0.14 80))";
  return "var(--grade-d, oklch(55% 0.16 25))";
}

export function EditorialReviewCard({ review }: EditorialReviewCardProps) {
  const pros: string[] = JSON.parse(review.prosJson);
  const cons: string[] = JSON.parse(review.consJson);

  return (
    <div className="surface-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Editorial Review
          </h3>
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">
            By {review.authorName} &middot;{" "}
            {new Date(review.reviewDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <span
            className="data-mono text-3xl font-bold"
            style={{ color: scoreColor(Number(review.overallScore)) }}
          >
            {Number(review.overallScore).toFixed(1)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
            / 10
          </span>
        </div>
      </div>

      {/* Score bars */}
      <div className="mt-5 grid gap-2.5">
        {DIMENSIONS.map(({ key, label }) => {
          const score = review[key] as number;
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-28 text-xs text-[var(--text-secondary)]">{label}</span>
              <div
                className="h-2 flex-1 rounded-full"
                style={{ background: "var(--bg-tertiary)" }}
              >
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${score * 10}%`,
                    background: scoreColor(score),
                  }}
                />
              </div>
              <span
                className="data-mono w-6 text-right text-xs font-medium"
                style={{ color: scoreColor(score) }}
              >
                {score}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
        {review.summary}
      </p>

      {/* Pros & Cons */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--grade-a, oklch(55% 0.18 145))]">
            Strengths
          </h4>
          <ul className="space-y-1.5">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="mt-0.5 text-[var(--grade-a, oklch(55% 0.18 145))]">+</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--grade-d, oklch(55% 0.16 25))]">
            Weaknesses
          </h4>
          <ul className="space-y-1.5">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="mt-0.5 text-[var(--grade-d, oklch(55% 0.16 25))]">-</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Verdict */}
      <div
        className="mt-5 rounded-xl p-4"
        style={{ background: "var(--bg-tertiary)" }}
      >
        <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          Verdict
        </h4>
        <p className="text-sm leading-relaxed text-[var(--text-primary)]">
          {review.verdict}
        </p>
      </div>
    </div>
  );
}
