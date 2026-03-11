/**
 * DataFreshnessBar — subtle "last updated" indicator shown near price tables.
 *
 * Communicates transparency: users can see exactly when data was last
 * refreshed and what the refresh interval is.
 *
 * Usage:
 *   <DataFreshnessBar
 *     lastUpdated={price.updatedAt}
 *     refreshIntervalMinutes={15}
 *     label="Prices"
 *   />
 */

"use client";

import { useEffect, useState } from "react";

interface DataFreshnessBarProps {
  lastUpdated?: string | null; // ISO string
  refreshIntervalMinutes?: number;
  label?: string;
  className?: string;
}

function formatAge(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 2) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function isStale(isoString: string, intervalMinutes: number): boolean {
  const diffMs = Date.now() - new Date(isoString).getTime();
  return diffMs > intervalMinutes * 60_000 * 2; // >2× the expected interval
}

export function DataFreshnessBar({
  lastUpdated,
  refreshIntervalMinutes = 15,
  label = "Data",
  className = "",
}: DataFreshnessBarProps) {
  // Re-render every 60 s so the relative timestamp stays fresh
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!lastUpdated) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs ${className}`}
        style={{ color: "var(--muted-light)" }}
      >
        <span aria-hidden="true">○</span> {label}: no data yet
      </span>
    );
  }

  const stale = isStale(lastUpdated, refreshIntervalMinutes);
  const ageLabel = formatAge(lastUpdated);

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${className}`}
      title={`Last updated: ${new Date(lastUpdated).toLocaleString()}. Refreshes every ${refreshIntervalMinutes} minutes.`}
      style={{ color: stale ? "var(--warning, #d97706)" : "var(--muted)" }}
    >
      {/* Dot indicator — green = fresh, amber = stale */}
      <span
        className="block h-1.5 w-1.5 rounded-full"
        aria-hidden="true"
        style={{
          background: stale ? "var(--warning, #d97706)" : "var(--success, #16a34a)",
        }}
      />
      {label} updated {ageLabel}
      {stale && (
        <span className="font-medium" style={{ color: "var(--warning, #d97706)" }}>
          (may be stale)
        </span>
      )}
    </span>
  );
}

/**
 * Compact version — just a coloured dot + tooltip, no text label.
 * Good for table cells where space is tight.
 */
export function FreshnessDot({
  lastUpdated,
  refreshIntervalMinutes = 15,
}: {
  lastUpdated?: string | null;
  refreshIntervalMinutes?: number;
}) {
  if (!lastUpdated) return null;

  const stale = isStale(lastUpdated, refreshIntervalMinutes);
  const ageLabel = formatAge(lastUpdated);

  return (
    <span
      className="inline-block h-2 w-2 rounded-full"
      aria-label={`Updated ${ageLabel}${stale ? " (may be stale)" : ""}`}
      title={`Updated ${ageLabel}`}
      style={{ background: stale ? "var(--warning, #d97706)" : "var(--success, #16a34a)" }}
    />
  );
}
