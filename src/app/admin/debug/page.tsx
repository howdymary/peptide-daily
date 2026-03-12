"use client";

/**
 * Admin — Debug View
 *
 * Shows:
 *  1. News source health (lastFetchedAt, errors, article count per source)
 *  2. Recent ingested news articles with peptide tags
 *  3. Recent price entries with anomaly flags (spike/drop ±50% from median)
 *
 * Accessible at: /admin/debug
 * Requires: ADMIN session (enforced server-side in /api/admin/debug)
 */

import { useEffect, useState, useCallback } from "react";

interface NewsSourceHealth {
  id: string;
  name: string;
  slug: string;
  feedUrl: string;
  isActive: boolean;
  robotsTxtAllows: boolean;
  lastFetchedAt: string | null;
  lastFetchStatus: string | null;
  lastFetchError: string | null;
  fetchCount: number;
  errorCount: number;
  articleCount: number;
  isStale: boolean;
}

interface RecentArticle {
  id: string;
  title: string;
  sourceUrl: string;
  publishedAt: string;
  createdAt: string;
  tags: string[];
  isHidden: boolean;
  isEditorsPick: boolean;
  source: { name: string; slug: string };
}

interface PriceEntry {
  id: string;
  price: number;
  concentration: string;
  availabilityStatus: string;
  lastUpdated: string;
  productUrl: string;
  anomaly: "spike" | "drop" | null;
  medianPrice: number;
  peptide: { name: string; slug: string };
  vendor: { name: string; slug: string };
}

interface DebugData {
  newsSources: NewsSourceHealth[];
  recentArticles: RecentArticle[];
  recentPrices: PriceEntry[];
  anomalies: PriceEntry[];
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function TagPill({ tag }: { tag: string }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
      style={{
        background: "var(--surface-raised)",
        color: "var(--muted)",
        border: "1px solid var(--border)",
      }}
    >
      {tag}
    </span>
  );
}

export default function DebugPage() {
  const [data, setData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"sources" | "news" | "prices">("sources");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/debug");
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
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-[var(--card-bg)]" />
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

  const TABS = [
    { key: "sources" as const, label: `News Sources (${data.newsSources.length})` },
    { key: "news" as const, label: `Recent Articles (${data.recentArticles.length})` },
    { key: "prices" as const, label: `Prices${data.anomalies.length > 0 ? ` · ${data.anomalies.length} anomalies` : ""}` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Debug View</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Ingestion logs, news tagging, and price anomaly inspector.
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

      {/* Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: "var(--border)" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={{
              color: activeTab === tab.key ? "var(--accent)" : "var(--muted)",
              borderBottom: activeTab === tab.key ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── News Sources tab ─────────────────────────────────────────────── */}
      {activeTab === "sources" && (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--card-border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b text-left text-xs font-semibold uppercase tracking-wider"
                style={{ borderColor: "var(--card-border)", background: "var(--surface)", color: "var(--muted)" }}
              >
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3 text-center">Active</th>
                <th className="px-4 py-3 text-center">Robots</th>
                <th className="px-4 py-3 text-right">Articles</th>
                <th className="px-4 py-3 text-right">Fetches</th>
                <th className="px-4 py-3 text-right">Errors</th>
                <th className="px-4 py-3">Last Fetch</th>
              </tr>
            </thead>
            <tbody>
              {data.newsSources.map((s) => (
                <tr
                  key={s.id}
                  className="border-b last:border-0 transition-colors hover:bg-[var(--surface-raised)]"
                  style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: "var(--foreground)" }}>{s.name}</p>
                    <a
                      href={s.feedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs hover:underline"
                      style={{ color: "var(--muted)" }}
                    >
                      {s.feedUrl.slice(0, 50)}{s.feedUrl.length > 50 ? "…" : ""}
                    </a>
                    {s.lastFetchError && (
                      <p className="mt-0.5 text-xs" style={{ color: "var(--danger)" }}>
                        {s.lastFetchError.slice(0, 80)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span style={{ color: s.isActive ? "var(--brand-teal)" : "var(--muted)" }}>
                      {s.isActive ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span style={{ color: s.robotsTxtAllows ? "var(--brand-teal)" : "var(--danger)" }}>
                      {s.robotsTxtAllows ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums" style={{ color: "var(--foreground)" }}>
                    {s.articleCount}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums" style={{ color: "var(--muted)" }}>
                    {s.fetchCount}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {s.errorCount > 0 ? (
                      <span style={{ color: "var(--danger)" }}>{s.errorCount}</span>
                    ) : (
                      <span style={{ color: "var(--muted)" }}>0</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {s.lastFetchedAt ? (
                      <span
                        className="text-xs"
                        style={{ color: s.isStale ? "var(--warning)" : "var(--muted)" }}
                        title={new Date(s.lastFetchedAt).toLocaleString()}
                      >
                        {relativeTime(s.lastFetchedAt)}{s.isStale ? " ⚠" : ""}
                        {s.lastFetchStatus && (
                          <span
                            className="ml-1 rounded px-1 text-[10px]"
                            style={{
                              background: s.lastFetchStatus === "success" ? "var(--success-bg)" : "var(--danger-bg)",
                              color: s.lastFetchStatus === "success" ? "var(--success)" : "var(--danger)",
                            }}
                          >
                            {s.lastFetchStatus}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: "var(--muted)" }}>Never</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Recent Articles tab ───────────────────────────────────────────── */}
      {activeTab === "news" && (
        <div className="space-y-3">
          {data.recentArticles.map((article) => (
            <div
              key={article.id}
              className="rounded-lg border p-4"
              style={{
                borderColor: article.isHidden ? "var(--danger)" : "var(--card-border)",
                background: "var(--card-bg)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium leading-snug hover:underline"
                    style={{ color: "var(--foreground)" }}
                  >
                    {article.title}
                  </a>
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                    {article.source.name} · {new Date(article.publishedAt).toLocaleDateString()} ·{" "}
                    ingested {relativeTime(article.createdAt)}
                    {article.isEditorsPick && (
                      <span
                        className="ml-2 rounded px-1 py-0.5 text-[10px] font-medium"
                        style={{ background: "var(--brand-gold)", color: "#fff" }}
                      >
                        Editor&apos;s pick
                      </span>
                    )}
                    {article.isHidden && (
                      <span
                        className="ml-2 rounded px-1 py-0.5 text-[10px] font-medium"
                        style={{ background: "var(--danger)", color: "#fff" }}
                      >
                        Hidden
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {article.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {article.tags.map((tag) => <TagPill key={tag} tag={tag} />)}
                </div>
              )}
              {article.tags.length === 0 && (
                <p className="mt-1 text-xs" style={{ color: "var(--warning)" }}>No tags extracted</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Prices tab ────────────────────────────────────────────────────── */}
      {activeTab === "prices" && (
        <div className="space-y-4">
          {/* Anomalies banner */}
          {data.anomalies.length > 0 && (
            <div
              className="rounded-lg border p-4"
              style={{ borderColor: "var(--warning)", background: "var(--warning-bg, #fef3c7)" }}
            >
              <h3 className="text-sm font-semibold" style={{ color: "var(--warning)" }}>
                {data.anomalies.length} price anomalies detected
              </h3>
              <div className="mt-2 space-y-1">
                {data.anomalies.map((p) => (
                  <p key={p.id} className="text-xs" style={{ color: "var(--foreground)" }}>
                    <strong>{p.peptide.name}</strong> @ {p.vendor.name}:{" "}
                    <span style={{ color: p.anomaly === "spike" ? "var(--danger)" : "var(--brand-teal)" }}>
                      {p.anomaly === "spike" ? "▲ spike" : "▼ drop"}
                    </span>{" "}
                    ${p.price.toFixed(2)} vs median ${p.medianPrice.toFixed(2)}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Price table */}
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--card-border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ borderColor: "var(--card-border)", background: "var(--surface)", color: "var(--muted)" }}
                >
                  <th className="px-4 py-3">Peptide</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3">Conc.</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Anomaly</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPrices.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b last:border-0 transition-colors hover:bg-[var(--surface-raised)]"
                    style={{
                      borderColor: "var(--card-border)",
                      background: p.anomaly ? "var(--warning-bg, #fef3c7)" : "var(--card-bg)",
                    }}
                  >
                    <td className="px-4 py-2.5">
                      <a href={p.productUrl} target="_blank" rel="noopener noreferrer"
                        className="font-medium hover:underline" style={{ color: "var(--foreground)" }}>
                        {p.peptide.name}
                      </a>
                    </td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "var(--muted)" }}>
                      {p.vendor.name}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-medium" style={{ color: "var(--foreground)" }}>
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "var(--muted)" }}>
                      {p.concentration}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          background: p.availabilityStatus === "in_stock"
                            ? "var(--success-bg, #d1fae5)"
                            : "var(--surface-raised)",
                          color: p.availabilityStatus === "in_stock"
                            ? "var(--success, #059669)"
                            : "var(--muted)",
                        }}
                      >
                        {p.availabilityStatus.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "var(--muted)" }}
                      title={new Date(p.lastUpdated).toLocaleString()}>
                      {relativeTime(p.lastUpdated)}
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      {p.anomaly === "spike" && (
                        <span style={{ color: "var(--danger)" }}>▲ spike</span>
                      )}
                      {p.anomaly === "drop" && (
                        <span style={{ color: "var(--brand-teal)" }}>▼ drop</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
