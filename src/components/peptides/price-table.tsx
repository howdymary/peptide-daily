"use client";

import { useState } from "react";
import { AvailabilityBadge, BestPriceBadge } from "@/components/ui/badge";
import { GradeBadge, GradeBadgeEmpty } from "@/components/finnrick/grade-badge";
import { TrustScoreBar, TrustScoreBarEmpty } from "@/components/finnrick/trust-score-bar";
import { TestResultsTable } from "@/components/finnrick/test-results-table";
import { InfoIcon } from "@/components/ui/tooltip";
import type { PeptidePriceItem } from "@/types";

interface PriceTableProps {
  prices: PeptidePriceItem[];
  peptideName?: string;
  /** Map of vendorSlug -> array of test items, for inline expansion */
  finnrickTests?: Record<string, import("@/types").FinnrickTestItem[]>;
}

type SortKey = "price" | "trust" | "grade";

export function PriceTable({ prices, peptideName, finnrickTests = {} }: PriceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("price");

  if (prices.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          No vendor prices available yet.
        </p>
      </div>
    );
  }

  const gradeOrder: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };

  const sorted = [...prices].sort((a, b) => {
    if (sortKey === "trust") {
      return (b.trustScore?.overall ?? 0) - (a.trustScore?.overall ?? 0);
    }
    if (sortKey === "grade") {
      return (
        (gradeOrder[b.finnrickRating?.grade ?? ""] ?? 0) -
        (gradeOrder[a.finnrickRating?.grade ?? ""] ?? 0)
      );
    }
    return a.price - b.price; // default: price
  });

  // lowest price for highlighting
  const bestPrice = Math.min(...prices.map((p) => p.price));

  return (
    <div>
      {/* Sort controls */}
      <div className="mb-3 flex items-center gap-1">
        <span className="mr-2 text-xs" style={{ color: "var(--muted)" }}>
          Sort by:
        </span>
        {(["price", "trust", "grade"] as SortKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSortKey(key)}
            className="rounded-lg px-3 py-1 text-xs font-medium transition"
            style={
              sortKey === key
                ? { background: "var(--brand-navy)", color: "white" }
                : {
                    background: "var(--surface-raised)",
                    color: "var(--muted)",
                    border: "1px solid var(--border)",
                  }
            }
          >
            {key === "price" ? "Price" : key === "trust" ? "Trust Score" : "Lab Grade"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr
              className="text-xs font-semibold uppercase tracking-wide"
              style={{
                background: "var(--surface-raised)",
                borderBottom: "1px solid var(--border)",
                color: "var(--muted)",
              }}
            >
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">
                <span className="flex items-center gap-1">
                  Finnrick
                  <InfoIcon
                    tooltip="Third-party lab testing grade from finnrick.com. Independent of PeptidePal. A=Great, B=Good, C=Okay, D=Poor, E=Bad."
                  />
                </span>
              </th>
              <th className="px-4 py-3">
                <span className="flex items-center gap-1">
                  Trust
                  <InfoIcon
                    tooltip="PeptidePal's derived score (0–100) combining Finnrick data, community reviews, and pricing signals. Not Finnrick's own rating."
                  />
                </span>
              </th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 hidden sm:table-cell">Size</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 hidden md:table-cell">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ divideColor: "var(--border)" } as React.CSSProperties}
          >
            {sorted.map((price, index) => {
              const isBest = price.price === bestPrice;
              const tests = finnrickTests[price.vendorSlug] ?? [];

              return (
                <>
                  <tr
                    key={price.id}
                    className="transition-colors"
                    style={
                      isBest && sortKey === "price"
                        ? { background: "var(--success-bg)" }
                        : { background: "var(--surface)" }
                    }
                  >
                    {/* Vendor */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium" style={{ color: "var(--foreground)" }}>
                          {price.vendorName}
                        </span>
                        {index === 0 && sortKey === "price" && <BestPriceBadge />}
                      </div>
                    </td>

                    {/* Finnrick */}
                    <td className="px-4 py-3">
                      {price.finnrickRating ? (
                        <a
                          href={
                            price.finnrickRating.finnrickUrl ??
                            `https://www.finnrick.com/products/${(peptideName ?? "")
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")}/${price.vendorSlug}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex no-underline transition hover:opacity-80"
                          title={`View on Finnrick · ${price.finnrickRating.testCount} tests · last tested ${new Date(price.finnrickRating.newestTestDate).toLocaleDateString()}`}
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

                    {/* Trust */}
                    <td className="px-4 py-3">
                      {price.trustScore ? (
                        <TrustScoreBar trustScore={price.trustScore} size="md" />
                      ) : (
                        <TrustScoreBarEmpty />
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <span
                        className="text-base font-bold tabular-nums"
                        style={{ color: isBest ? "var(--success)" : "var(--foreground)" }}
                      >
                        {price.currency === "USD" ? "$" : price.currency}
                        {price.price.toFixed(2)}
                      </span>
                    </td>

                    {/* Concentration */}
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="text-sm" style={{ color: "var(--muted)" }}>
                        {price.concentration}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <AvailabilityBadge status={price.availabilityStatus} />
                    </td>

                    {/* Updated */}
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {new Date(price.lastUpdated).toLocaleDateString()}
                      </span>
                    </td>

                    {/* View */}
                    <td className="px-4 py-3">
                      <a
                        href={price.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                        style={{ background: "var(--brand-navy)" }}
                      >
                        View →
                      </a>
                    </td>
                  </tr>

                  {/* Expandable lab data row */}
                  {price.finnrickRating && tests.length > 0 && (
                    <tr
                      key={`${price.id}-labs`}
                      style={{ background: "var(--surface-raised)" }}
                    >
                      <td colSpan={8} className="px-4 pb-3 pt-0">
                        <TestResultsTable
                          tests={tests}
                          vendorName={price.vendorName}
                          peptideName={peptideName ?? ""}
                          finnrickUrl={price.finnrickRating.finnrickUrl}
                        />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footnote */}
      <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--muted-light)" }}>
        Finnrick grades are third-party lab data from{" "}
        <a
          href="https://www.finnrick.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
        >
          finnrick.com
        </a>{" "}
        and are independent of PeptidePal. Trust scores are PeptidePal&apos;s derived metric.
        Prices update every 15 minutes. Not medical advice.
      </p>
    </div>
  );
}
