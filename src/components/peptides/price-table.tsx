import { AvailabilityBadge } from "@/components/ui/badge";
import { GradeBadge, GradeBadgeEmpty } from "@/components/finnrick/grade-badge";
import { TrustScoreBar, TrustScoreBarEmpty } from "@/components/finnrick/trust-score-bar";
import type { PeptidePriceItem } from "@/types";

interface PriceTableProps {
  prices: PeptidePriceItem[];
  peptideName?: string;
}

export function PriceTable({ prices, peptideName }: PriceTableProps) {
  if (prices.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)]">
        No vendor prices available yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="pb-3 font-medium text-[var(--muted)]">Vendor</th>
            <th className="pb-3 font-medium text-[var(--muted)]">
              Finnrick
              <span
                className="ml-1 cursor-help text-xs opacity-60"
                title="Third-party lab testing grade from finnrick.com. A=Great, B=Good, C=Okay, D=Poor, E=Bad. This is Finnrick's published rating, not a PeptidePal assessment."
              >
                ⓘ
              </span>
            </th>
            <th className="pb-3 font-medium text-[var(--muted)]">
              Trust
              <span
                className="ml-1 cursor-help text-xs opacity-60"
                title="PeptidePal combined trust score (0–100) based on Finnrick rating, community reviews, and pricing signals. Not affiliated with Finnrick."
              >
                ⓘ
              </span>
            </th>
            <th className="pb-3 font-medium text-[var(--muted)]">Price</th>
            <th className="pb-3 font-medium text-[var(--muted)]">Concentration</th>
            <th className="pb-3 font-medium text-[var(--muted)]">Status</th>
            <th className="pb-3 font-medium text-[var(--muted)]">Updated</th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {prices.map((price, index) => (
            <tr key={price.id}>
              <td className="py-3 font-medium">
                {price.vendorName}
                {index === 0 && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Best Price
                  </span>
                )}
              </td>

              {/* Finnrick rating column */}
              <td className="py-3">
                {price.finnrickRating ? (
                  <a
                    href={
                      price.finnrickRating.finnrickUrl ??
                      `https://www.finnrick.com/products/${(peptideName ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${price.vendorSlug}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center no-underline"
                    title={`${price.finnrickRating.testCount} tests · last tested ${new Date(price.finnrickRating.newestTestDate).toLocaleDateString()}`}
                  >
                    <GradeBadge
                      grade={price.finnrickRating.grade}
                      averageScore={price.finnrickRating.averageScore}
                      testCount={price.finnrickRating.testCount}
                    />
                  </a>
                ) : (
                  <GradeBadgeEmpty />
                )}
              </td>

              {/* Trust score column */}
              <td className="py-3">
                {price.trustScore ? (
                  <TrustScoreBar trustScore={price.trustScore} />
                ) : (
                  <TrustScoreBarEmpty />
                )}
              </td>

              <td className="py-3 font-semibold">
                {price.currency === "USD" ? "$" : price.currency}
                {price.price.toFixed(2)}
              </td>
              <td className="py-3">{price.concentration}</td>
              <td className="py-3">
                <AvailabilityBadge status={price.availabilityStatus} />
              </td>
              <td className="py-3 text-[var(--muted)]">
                {new Date(price.lastUpdated).toLocaleDateString()}
              </td>
              <td className="py-3">
                <a
                  href={price.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-2 text-xs text-[var(--muted)]">
        Finnrick ratings are third-party lab testing data from{" "}
        <a
          href="https://www.finnrick.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:underline"
        >
          finnrick.com
        </a>{" "}
        and are independent of PeptidePal. Trust scores are PeptidePal&apos;s derived metric.
      </p>
    </div>
  );
}
