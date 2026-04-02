"use client";

/**
 * Admin — Vendor Health Dashboard
 *
 * Shows per-vendor scraping health metrics:
 *  - Status badge (active / paused / manual-only / js-required / disabled)
 *  - Vendor type
 *  - Last scraped timestamp + staleness indicator
 *  - Active product count
 *  - Error count + last error message
 *
 * Also surfaces duplicate domain detections and source registry summary.
 *
 * Accessible at: /admin/vendor-health
 * Requires: ADMIN session (enforced server-side in /api/admin/vendor-health)
 */

import { useEffect, useState, useCallback } from "react";

interface VendorHealth {
  vendorName: string;
  vendorSlug: string;
  domain: string | null;
  status: string;
  vendorType: string;
  scrapingEnabled: boolean;
  lastScrapedAt: string | null;
  activeProducts: number;
  errorCount: number;
  lastError: string | null;
  isStale: boolean;
}

interface DuplicateEntry {
  domain: string;
  vendors: { id: string; name: string; slug: string }[];
}

interface HealthData {
  vendors: VendorHealth[];
  duplicates: DuplicateEntry[];
  registrySummary: Record<string, number>;
  totalVendors: number;
  staleVendors: number;
  errorVendors: number;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active:        { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-800 dark:text-emerald-400" },
  paused:        { bg: "bg-yellow-100 dark:bg-yellow-900/30",   text: "text-yellow-800 dark:text-yellow-400" },
  "manual-only": { bg: "bg-blue-100 dark:bg-blue-900/30",       text: "text-blue-800 dark:text-blue-400" },
  "js-required": { bg: "bg-purple-100 dark:bg-purple-900/30",   text: "text-purple-800 dark:text-purple-400" },
  disabled:      { bg: "bg-gray-100 dark:bg-gray-800",          text: "text-gray-500 dark:text-gray-400" },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function VendorHealthPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedError, setExpandedError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/vendor-health");
      if (!res.ok) throw new Error(res.status === 401 ? "Unauthorized" : "Failed to load");
      const json = await res.json();
      setData(json.data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-[var(--card-bg)]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[var(--danger)] bg-red-50 p-4 dark:bg-red-900/10">
        <p className="text-sm font-medium text-red-800 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            Vendor Health
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Live scraping status and health metrics for all configured price sources.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--surface-raised)]"
          style={{ borderColor: "var(--border)", color: "var(--foreground-secondary)" }}
        >
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Vendors", value: data.totalVendors, color: "var(--accent)" },
          { label: "Active Scrapers", value: data.registrySummary.active ?? 0, color: "var(--brand-teal)" },
          { label: "Stale (>7 days)", value: data.staleVendors, color: data.staleVendors > 0 ? "var(--warning)" : "var(--brand-teal)" },
          { label: "With Errors", value: data.errorVendors, color: data.errorVendors > 0 ? "var(--danger)" : "var(--brand-teal)" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border p-4"
            style={{
              borderColor: "var(--card-border)",
              background: "var(--card-bg)",
              borderTopColor: card.color,
              borderTopWidth: "3px",
            }}
          >
            <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>{card.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums" style={{ color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Registry summary pills */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(data.registrySummary).map(([status, count]) => {
          const colors = STATUS_COLORS[status] ?? STATUS_COLORS.disabled;
          return (
            <span
              key={status}
              className={`rounded-full px-3 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
            >
              {status}: {count}
            </span>
          );
        })}
      </div>

      {/* Duplicate domain warnings */}
      {data.duplicates.length > 0 && (
        <div className="rounded-lg border border-[var(--warning)] bg-yellow-50 p-4 dark:bg-yellow-900/10">
          <h2 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">
            Duplicate Domains Detected
          </h2>
          <ul className="mt-2 space-y-1">
            {data.duplicates.map((dup) => (
              <li key={dup.domain} className="text-xs text-yellow-700 dark:text-yellow-300">
                <strong>{dup.domain}</strong>: {dup.vendors.map((v) => v.name).join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Vendor table */}
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--card-border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b text-left text-xs font-semibold uppercase tracking-wider"
              style={{
                borderColor: "var(--card-border)",
                background: "var(--surface)",
                color: "var(--muted)",
              }}
            >
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Products</th>
              <th className="px-4 py-3">Last Scraped</th>
              <th className="px-4 py-3 text-right">Errors</th>
              <th className="px-4 py-3">Last Error</th>
            </tr>
          </thead>
          <tbody>
            {data.vendors.map((v) => {
              const colors = STATUS_COLORS[v.status] ?? STATUS_COLORS.disabled;
              return (
                <tr
                  key={v.vendorSlug}
                  className="border-b last:border-0 transition-colors hover:bg-[var(--surface-raised)]"
                  style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: "var(--foreground)" }}>{v.vendorName}</p>
                    {v.domain && (
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{v.domain}</p>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${colors.bg} ${colors.text}`}>
                      {v.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted)" }}>
                    {v.vendorType}
                  </td>

                  <td className="px-4 py-3 text-right tabular-nums" style={{ color: "var(--foreground)" }}>
                    {v.scrapingEnabled ? (
                      <span className={v.activeProducts === 0 ? "text-[var(--muted)]" : ""}>
                        {v.activeProducts}
                      </span>
                    ) : (
                      <span style={{ color: "var(--muted)" }}>—</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {v.lastScrapedAt ? (
                      <span
                        className="text-xs"
                        style={{ color: v.isStale ? "var(--warning)" : "var(--muted)" }}
                        title={new Date(v.lastScrapedAt).toLocaleString()}
                      >
                        {relativeTime(v.lastScrapedAt)}
                        {v.isStale && " ⚠"}
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: "var(--muted)" }}>Never</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right tabular-nums">
                    {v.errorCount > 0 ? (
                      <span className="font-medium" style={{ color: "var(--danger)" }}>{v.errorCount}</span>
                    ) : (
                      <span style={{ color: "var(--muted)" }}>0</span>
                    )}
                  </td>

                  <td className="max-w-xs px-4 py-3">
                    {v.lastError ? (
                      <button
                        onClick={() => setExpandedError(expandedError === v.vendorSlug ? null : v.vendorSlug)}
                        className="text-left text-xs"
                        style={{ color: "var(--danger)" }}
                      >
                        {expandedError === v.vendorSlug
                          ? v.lastError
                          : v.lastError.slice(0, 48) + (v.lastError.length > 48 ? "…" : "")}
                      </button>
                    ) : (
                      <span className="text-xs" style={{ color: "var(--muted)" }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Health metrics update automatically after each scraping cycle (every 15 min by default).
        &quot;Stale&quot; = not scraped in the last 7 days.
      </p>
    </div>
  );
}
