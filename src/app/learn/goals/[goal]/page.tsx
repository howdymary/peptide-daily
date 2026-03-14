import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  GOAL_LABELS,
  GOAL_DESCRIPTIONS,
  GOAL_ORDER,
  REGULATORY_LABELS,
  REGULATORY_COLORS,
  getPeptidesByGoal,
} from "@/lib/learn/peptide-data";
import type { GoalTag, PeptideContent } from "@/lib/learn/peptide-data";
import { SafetyNotice } from "@/components/learn/safety-notice";

// ─────────────────────────────────────────────────────────────────────────────
// STATIC GENERATION
// ─────────────────────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return GOAL_ORDER.map((goal) => ({ goal }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ goal: string }>;
}): Promise<Metadata> {
  const { goal } = await params;
  if (!GOAL_ORDER.includes(goal as GoalTag)) return {};
  const tag = goal as GoalTag;
  return {
    title: `Peptides for ${GOAL_LABELS[tag]} — Research Overview | Peptide Daily`,
    description: GOAL_DESCRIPTIONS[tag],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PEPTIDE CARD
// ─────────────────────────────────────────────────────────────────────────────

function GoalPeptideCard({ peptide }: { peptide: PeptideContent }) {
  const regColor = REGULATORY_COLORS[peptide.regulatoryStatus];
  return (
    <div
      className="flex flex-col rounded-xl border overflow-hidden"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div className="h-1 w-full shrink-0" style={{ background: regColor.text }} />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{
              background: regColor.bg,
              color: regColor.text,
              border: `1px solid ${regColor.border}`,
            }}
          >
            {REGULATORY_LABELS[peptide.regulatoryStatus]}
          </span>
        </div>

        <h3
          className="text-base font-bold leading-snug"
          style={{ color: "var(--foreground)" }}
        >
          {peptide.name}
        </h3>
        {peptide.altName && (
          <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
            {peptide.altName}
          </p>
        )}

        <p
          className="mt-3 flex-1 text-sm leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {peptide.shortSummary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/learn/${peptide.slug}`}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--brand-navy)" }}
          >
            Read explainer
          </Link>
          <Link
            href={`/peptides/${peptide.slug}`}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--surface-raised)]"
            style={{
              borderColor: "var(--border)",
              color: "var(--foreground-secondary)",
            }}
          >
            Compare prices
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default async function GoalPage({
  params,
}: {
  params: Promise<{ goal: string }>;
}) {
  const { goal } = await params;
  if (!GOAL_ORDER.includes(goal as GoalTag)) notFound();

  const tag = goal as GoalTag;
  const peptides = getPeptidesByGoal(tag);
  const label = GOAL_LABELS[tag];
  const description = GOAL_DESCRIPTIONS[tag];

  return (
    <div style={{ background: "var(--background)" }}>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-14 sm:py-18"
        style={{ background: "var(--brand-navy)" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgb(255 255 255 / 0.012) 0px, rgb(255 255 255 / 0.012) 1px, transparent 1px, transparent 60px)",
          }}
          aria-hidden="true"
        />
        <div className="container-page relative">
          {/* Breadcrumb */}
          <nav
            className="mb-6 flex items-center gap-2 text-xs"
            aria-label="Breadcrumb"
            style={{ color: "rgb(255 255 255 / 0.45)" }}
          >
            <Link href="/" style={{ color: "rgb(255 255 255 / 0.45)" }} className="hover:opacity-80">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/learn" style={{ color: "rgb(255 255 255 / 0.45)" }} className="hover:opacity-80">Peptide Education</Link>
            <span aria-hidden="true">›</span>
            <span style={{ color: "rgb(255 255 255 / 0.7)" }}>Goals</span>
            <span aria-hidden="true">›</span>
            <span style={{ color: "rgb(255 255 255 / 0.9)" }}>{label}</span>
          </nav>

          <div className="max-w-2xl">
            <div className="section-label-light mb-5">Peptides by Goal</div>
            <h1 className="display-heading text-4xl text-white sm:text-5xl">
              Peptides for{" "}
              <em className="not-italic" style={{ color: "var(--brand-gold)" }}>
                {label}
              </em>
            </h1>
            <p
              className="mt-5 max-w-xl text-base leading-relaxed"
              style={{ color: "rgb(255 255 255 / 0.65)" }}
            >
              {description}
            </p>
            <div className="mt-5 flex items-center gap-4 text-sm" style={{ color: "rgb(255 255 255 / 0.5)" }}>
              <span>{peptides.length} peptides covered</span>
              <span aria-hidden="true">·</span>
              <span>Educational reference only</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────────────────────── */}
      <SafetyNotice variant="banner" />

      {/* ── Peptide grid ───────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="container-page">
          {peptides.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No peptide guides currently tagged for this goal.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {peptides.map((peptide) => (
                <GoalPeptideCard key={peptide.slug} peptide={peptide} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Related goals ──────────────────────────────────────────────── */}
      <section
        className="border-t py-10"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="container-page">
          <p
            className="mb-4 text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Other goals
          </p>
          <div className="flex flex-wrap gap-2">
            {GOAL_ORDER.filter((g) => g !== tag).map((g) => (
              <Link
                key={g}
                href={`/learn/goals/${g}`}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface-raised)]"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground-secondary)",
                }}
              >
                {GOAL_LABELS[g]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section
        className="py-12"
        style={{ background: "var(--brand-navy)" }}
      >
        <div className="container-page text-center">
          <h2 className="display-heading text-2xl text-white">
            Compare prices and lab grades
          </h2>
          <p
            className="mt-2 text-sm"
            style={{ color: "rgb(255 255 255 / 0.6)" }}
          >
            Use our price comparison and Finnrick lab data tools alongside this guide.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/peptides"
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--brand-gold)" }}
            >
              Browse Price Catalog
            </Link>
            <Link
              href="/learn"
              className="rounded-lg border px-5 py-2.5 text-sm font-medium text-white transition-colors"
              style={{ borderColor: "rgb(255 255 255 / 0.25)", color: "rgb(255 255 255 / 0.85)" }}
            >
              ← All Guides
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
