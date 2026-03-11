"use client";

import { useState } from "react";
import type { FinnrickTestItem } from "@/types";

interface TestResultsTableProps {
  tests: FinnrickTestItem[];
  vendorName: string;
  peptideName: string;
  finnrickUrl: string | null;
}

export function TestResultsTable({
  tests,
  vendorName,
  peptideName,
  finnrickUrl,
}: TestResultsTableProps) {
  const [open, setOpen] = useState(false);

  if (tests.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs text-[var(--accent)] hover:underline focus:outline-none"
        aria-expanded={open}
      >
        <span>{open ? "▾" : "▸"}</span>
        <span>
          {open ? "Hide" : "Show"} {tests.length} Finnrick lab test
          {tests.length !== 1 ? "s" : ""}
        </span>
      </button>

      {open && (
        <div className="mt-2 overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--card-bg)]">
                <th className="px-3 py-2 font-medium text-[var(--muted)]">Date</th>
                <th className="px-3 py-2 font-medium text-[var(--muted)]">Score</th>
                <th className="px-3 py-2 font-medium text-[var(--muted)]">Purity</th>
                <th className="px-3 py-2 font-medium text-[var(--muted)]">Qty Variance</th>
                <th className="px-3 py-2 font-medium text-[var(--muted)]">Identity</th>
                <th className="px-3 py-2 font-medium text-[var(--muted)]">Endotoxins</th>
                <th className="px-3 py-2 font-medium text-[var(--muted)]">Lab</th>
                <th className="px-3 py-2 font-medium text-[var(--muted)]">CoA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {tests.map((t) => (
                <tr key={t.id} className="hover:bg-[var(--card-bg)]">
                  <td className="px-3 py-2 text-[var(--muted)]">
                    {new Date(t.testDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 font-semibold">
                    {t.testScore.toFixed(1)}
                  </td>
                  <td className="px-3 py-2">{t.purity.toFixed(2)}%</td>
                  <td
                    className={`px-3 py-2 ${
                      t.quantityVariance > 10 || t.quantityVariance < -10
                        ? "text-red-600 dark:text-red-400"
                        : ""
                    }`}
                  >
                    {t.quantityVariance > 0 ? "+" : ""}
                    {t.quantityVariance.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        t.identityResult.toLowerCase() === "pass"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {t.identityResult}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[var(--muted)]">
                    {t.endotoxinsStatus ?? "n/a"}
                  </td>
                  <td className="px-3 py-2 text-[var(--muted)]">{t.labId}</td>
                  <td className="px-3 py-2">
                    {t.certificateLink ? (
                      <a
                        href={t.certificateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline"
                      >
                        CoA
                      </a>
                    ) : (
                      <span className="text-[var(--muted)]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)]">
            Lab testing data from{" "}
            {finnrickUrl ? (
              <a
                href={finnrickUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                Finnrick
              </a>
            ) : (
              <a
                href={`https://www.finnrick.com/products/${peptideName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${vendorName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                Finnrick
              </a>
            )}{" "}
            · Ratings are Finnrick&apos;s published values, not Peptide Daily assessments.
          </div>
        </div>
      )}
    </div>
  );
}
