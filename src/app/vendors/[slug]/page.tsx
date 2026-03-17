"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { GradeBadge, GradeBadgeEmpty } from "@/components/finnrick/grade-badge";
import { AvailabilityBadge } from "@/components/ui/badge";
import { TestResultsTable } from "@/components/finnrick/test-results-table";
import { TrustBadge, deriveTrustBadge } from "@/components/ui/trust-badge";
import { MedicalDisclaimer } from "@/components/ui/info-banner";
import { DataFreshnessBar } from "@/components/ui/data-freshness";
import { getPeptideGuide } from "@/lib/learn/content-service";
import type { FinnrickGrade, FinnrickTestItem } from "@/types";

interface FinnrickRatingSummary {
  peptideName: string;
  peptideSlug: string;
  grade: FinnrickGrade;
  averageScore: number;
  testCount: number;
  newestTestDate: string;
  finnrickUrl: string | null;
  tests: FinnrickTestItem[];
}

interface VendorPriceSummary {
  id: string;
  peptideName: string;
  peptideSlug: string;
  peptideCategory: string | null;
  price: number;
  currency: string;
  concentration: string;
  productUrl: string;
  availabilityStatus: string;
  lastUpdated: string;
}

interface VendorDetail {
  id: string;
  name: string;
  slug: string;
  website: string;
  vendorDomain: string | null;
  bestFinnrickGrade: FinnrickGrade | null;
  averageFinnrickScore: number | null;
  totalTestCount: number;
  latestTestDate: string | null;
  finnrickRatingCount: number;
  finnrickRatings: FinnrickRatingSummary[];
  prices: VendorPriceSummary[];
}

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATIONAL GUIDE REMINDER — shown at bottom of each vendor page
// ─────────────────────────────────────────────────────────────────────────────

function VendorGuideReminder({ peptideSlugs }: { peptideSlugs: string[] }) {
  // Find guides that exist for any peptide this vendor carries
  const guides = peptideSlugs
    .slice(0, 6) // show up to 6 links
    .map((slug) => getPeptideGuide(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getPeptideGuide>>[];

  return (
    <div
      className="mt-6 rounded-xl border p-5"
      style={{
        background: "var(--surface-raised)",
        borderColor: "var(--card-border)",
      }}
    >
      <p
        className="mb-1 text-xs font-bold uppercase tracking-wider"
        style={{ color: "var(--brand-gold)" }}
      >
        Learn before you buy
      </p>
      <p className="mb-4 text-sm" style={{ color: "var(--foreground-secondary)" }}>
        Our educational guide covers every peptide this vendor carries — regulatory
        status, research context, and safety considerations. We recommend reviewing
        these before comparing prices.
      </p>

      {guides.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/learn/${g.slug}`}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--surface)]"
              style={{
                borderColor: "var(--border)",
                color: "var(--accent)",
                background: "var(--card-bg)",
              }}
            >
              {g.name} explainer →
            </Link>
          ))}
          <Link
            href="/learn"
            className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--surface)]"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted)",
              background: "var(--card-bg)",
            }}
          >
            All peptide guides →
          </Link>
        </div>
      )}

      {guides.length === 0 && (
        <Link
          href="/learn"
          className="text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "var(--accent)" }}
        >
          Browse the peptide education hub →
        </Link>
      )}
    </div>
  );
}

export default function VendorDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/vendors/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Vendor not found");
        return r.json();
      })
      .then(setVendor)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container-page py-8">
        <div className="skeleton mb-6 h-8 w-48 rounded" />
        <div className="skeleton mb-4 h-32 w-full rounded-xl" />
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="container-page py-12">
        <div
          className="rounded-xl p-8 text-center"
          style={{ border: "1px solid var(--danger-border)", background: "var(--danger-bg)" }}
        >
          <p className="font-medium" style={{ color: "var(--danger)" }}>
            {error || "Vendor not found"}
          </p>
          <Link href="/vendors" className="mt-4 inline-block text-sm" style={{ color: "var(--accent)" }}>
            ← Back to vendors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <Link
        href="/vendors"
        className="mb-6 inline-flex items-center gap-1 text-sm transition-colors hover:text-[var(--accent)]"
        style={{ color: "var(--muted)" }}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All Vendors
      </Link>

      {/* ── Vendor hero ──────────────────────────────────────────────── */}
      <div
        className="mb-6 rounded-2xl p-6 sm:p-8"
        style={{ background: "linear-gradient(135deg, var(--brand-navy) 0%, #164e63 100%)" }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{vendor.name}</h1>
            {vendor.vendorDomain && (
              <a
                href={vendor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm hover:underline"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {vendor.vendorDomain} ↗
              </a>
            )}
          </div>

          {/* Best grade + trust badge */}
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                Best Finnrick grade
              </p>
              <div className="mt-1">
                {vendor.bestFinnrickGrade ? (
                  <GradeBadge grade={vendor.bestFinnrickGrade} />
                ) : (
                  <GradeBadgeEmpty />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <dl
          className="mt-6 grid grid-cols-2 gap-3 border-t pt-5 sm:grid-cols-4"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}
        >
          <div>
            <dt className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Peptides</dt>
            <dd className="mt-0.5 text-xl font-bold text-white">{vendor.prices.length}</dd>
          </div>
          <div>
            <dt className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Lab ratings</dt>
            <dd className="mt-0.5 text-xl font-bold text-white">{vendor.finnrickRatingCount}</dd>
          </div>
          <div>
            <dt className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Total tests</dt>
            <dd className="mt-0.5 text-xl font-bold text-white">{vendor.totalTestCount}</dd>
          </div>
          {vendor.averageFinnrickScore !== null && (
            <div>
              <dt className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Avg score</dt>
              <dd className="mt-0.5 text-xl font-bold text-white">
                {vendor.averageFinnrickScore.toFixed(1)}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* ── Finnrick lab data ─────────────────────────────────────────── */}
      {vendor.finnrickRatings.length > 0 && (
        <section className="mb-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              Finnrick Lab Ratings
            </h2>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Third-party data from{" "}
              <a
                href="https://www.finnrick.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                finnrick.com
              </a>
            </p>
          </div>

          <div className="space-y-3">
            {vendor.finnrickRatings.map((r) => (
              <div
                key={r.peptideSlug}
                className="rounded-xl p-4"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Link
                      href={`/peptides/${r.peptideSlug}`}
                      className="font-semibold transition-colors hover:text-[var(--accent)]"
                      style={{ color: "var(--foreground)" }}
                    >
                      {r.peptideName}
                    </Link>
                    <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
                      {r.testCount} test{r.testCount !== 1 ? "s" : ""} ·{" "}
                      Last: {new Date(r.newestTestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <GradeBadge
                      grade={r.grade}
                      averageScore={r.averageScore}
                      testCount={r.testCount}
                    />
                    {r.finnrickUrl && (
                      <a
                        href={r.finnrickUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline transition hover:opacity-70"
                        style={{ color: "var(--muted)" }}
                      >
                        View on Finnrick ↗
                      </a>
                    )}
                  </div>
                </div>

                {r.tests.length > 0 && (
                  <TestResultsTable
                    tests={r.tests}
                    vendorName={vendor.name}
                    peptideName={r.peptideName}
                    finnrickUrl={r.finnrickUrl}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {vendor.finnrickRatings.length === 0 && (
        <div
          className="mb-8 rounded-xl p-6 text-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <p className="font-medium" style={{ color: "var(--foreground)" }}>
            No Finnrick lab data available
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            This vendor hasn&apos;t been tested by Finnrick yet, or data hasn&apos;t been
            imported. Check{" "}
            <a
              href="https://www.finnrick.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              finnrick.com
            </a>{" "}
            directly.
          </p>
        </div>
      )}

      {/* ── Peptides offered ─────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--foreground)" }}>
          Peptides Offered
        </h2>

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
                <th className="px-4 py-3">Peptide</th>
                <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 hidden sm:table-cell">Size</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden md:table-cell">Updated</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {vendor.prices.map((p) => (
                <tr
                  key={p.id}
                  className="border-t transition-colors hover:bg-[var(--surface-raised)]"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/peptides/${p.peptideSlug}`}
                      className="font-medium transition-colors hover:text-[var(--accent)]"
                      style={{ color: "var(--foreground)" }}
                    >
                      {p.peptideName}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-sm" style={{ color: "var(--muted)" }}>
                      {p.peptideCategory ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold tabular-nums" style={{ color: "var(--success)" }}>
                      {p.currency === "USD" ? "$" : p.currency}
                      {p.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-sm" style={{ color: "var(--muted)" }}>
                      {p.concentration}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <AvailabilityBadge status={p.availabilityStatus} />
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {new Date(p.lastUpdated).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={p.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                      style={{ background: "var(--brand-navy)" }}
                    >
                      View →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trust badge + freshness row */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <TrustBadge
          type={deriveTrustBadge({
            hasLabData: vendor.finnrickRatingCount > 0,
            grade: vendor.bestFinnrickGrade ?? undefined,
            testCount: vendor.totalTestCount,
          })}
          grade={vendor.bestFinnrickGrade ?? undefined}
        />
        {vendor.latestTestDate && (
          <DataFreshnessBar
            lastUpdated={vendor.latestTestDate}
            refreshIntervalMinutes={60 * 24 * 7} // Finnrick data refreshes weekly
            label="Lab data"
          />
        )}
      </div>

      {/* ── Educational guide reminder ────────────────────────────────── */}
      <VendorGuideReminder peptideSlugs={vendor.prices.map((p) => p.peptideSlug)} />

      {/* Medical disclaimer */}
      <MedicalDisclaimer className="mt-6" />
    </div>
  );
}
