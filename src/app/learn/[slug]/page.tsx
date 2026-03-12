import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPeptideBySlug,
  PEPTIDES,
  CATEGORY_LABELS,
  REGULATORY_LABELS,
  REGULATORY_COLORS,
} from "@/lib/learn/peptide-data";
import type { Metadata } from "next";

// ─────────────────────────────────────────────────────────────────────────────
// STATIC GENERATION
// ─────────────────────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return PEPTIDES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);
  if (!peptide) return {};
  return {
    title: peptide.seoTitle,
    description: peptide.metaDescription,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-4 text-lg font-bold"
      style={{ color: "var(--foreground)" }}
    >
      {children}
    </h2>
  );
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="text-sm leading-relaxed"
          style={{ color: "var(--foreground-secondary)" }}
        >
          {para}
        </p>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default async function PeptideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);
  if (!peptide) notFound();

  const regColor = REGULATORY_COLORS[peptide.regulatoryStatus];

  return (
    <div style={{ background: "var(--background)" }}>
      {/* ── Header block ─────────────────────────────────────────────────── */}
      <section
        className="border-b py-12"
        style={{
          background: "var(--brand-navy)",
          borderColor: "rgb(255 255 255 / 0.08)",
        }}
      >
        <div className="container-page">
          {/* Breadcrumb */}
          <nav
            className="mb-6 flex items-center gap-2 text-xs"
            aria-label="Breadcrumb"
            style={{ color: "rgb(255 255 255 / 0.45)" }}
          >
            <Link href="/" className="transition-opacity hover:opacity-90" style={{ color: "rgb(255 255 255 / 0.45)" }}>
              Home
            </Link>
            <span aria-hidden="true">›</span>
            <Link href="/learn" className="transition-opacity hover:opacity-90" style={{ color: "rgb(255 255 255 / 0.45)" }}>
              Peptide Education
            </Link>
            <span aria-hidden="true">›</span>
            <span style={{ color: "rgb(255 255 255 / 0.7)" }}>{peptide.name}</span>
          </nav>

          {/* Title row */}
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1">
              {/* Category + status badges */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    borderColor: "rgb(255 255 255 / 0.15)",
                    color: "rgb(255 255 255 / 0.6)",
                  }}
                >
                  {CATEGORY_LABELS[peptide.category]}
                </span>
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

              <h1
                className="display-heading text-3xl text-white sm:text-4xl"
              >
                {peptide.name}
              </h1>
              {peptide.altName && (
                <p
                  className="mt-2 text-sm"
                  style={{ color: "rgb(255 255 255 / 0.5)" }}
                >
                  Also known as: {peptide.altName}
                </p>
              )}
            </div>
          </div>

          {/* Status note */}
          <div
            className="mt-5 inline-flex items-start gap-2 rounded-lg px-3.5 py-2.5 text-xs leading-relaxed"
            style={{
              background: "rgb(255 255 255 / 0.05)",
              border: "1px solid rgb(255 255 255 / 0.10)",
              color: "rgb(255 255 255 / 0.6)",
            }}
          >
            <svg
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{peptide.statusNote}</span>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────────────────────────── */}
      <div
        className="border-b py-3"
        style={{
          background: "var(--info-bg)",
          borderColor: "var(--info-border)",
        }}
      >
        <div className="container-page">
          <p className="text-xs leading-relaxed" style={{ color: "var(--info-text)" }}>
            <strong>Educational content only.</strong> This page does not constitute medical
            advice, diagnosis, or treatment recommendations. Always consult a qualified
            healthcare professional before making decisions related to any medication or
            health intervention.
          </p>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="container-page py-12">
        <div className="mx-auto max-w-3xl space-y-12">
          {/* Overview */}
          <section>
            <SectionHeading>Overview</SectionHeading>
            <Prose paragraphs={peptide.overview} />
          </section>

          <hr style={{ borderColor: "var(--border)" }} />

          {/* Research & Clinical Context */}
          <section>
            <SectionHeading>Research &amp; Clinical Context</SectionHeading>
            <Prose paragraphs={peptide.researchContext} />
          </section>

          <hr style={{ borderColor: "var(--border)" }} />

          {/* References */}
          <section>
            <SectionHeading>References</SectionHeading>
            <ol className="space-y-4">
              {peptide.references.map((ref) => (
                <li key={ref.number} className="flex gap-3">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: "var(--brand-navy)" }}
                    aria-hidden="true"
                  >
                    {ref.number}
                  </span>
                  <div className="min-w-0">
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-sm font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
                      style={{ color: "var(--accent)" }}
                    >
                      {ref.title}
                    </a>
                    <p
                      className="mt-0.5 text-xs"
                      style={{ color: "var(--muted)" }}
                    >
                      {ref.journal}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <hr style={{ borderColor: "var(--border)" }} />

          {/* Safety & Regulatory Notes */}
          <section>
            <div
              className="rounded-xl border p-6"
              style={{
                background: "var(--warning-bg)",
                borderColor: "var(--warning-border)",
              }}
            >
              <h2
                className="mb-4 flex items-center gap-2 text-base font-bold"
                style={{ color: "var(--warning)" }}
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                Safety &amp; Regulatory Notes
              </h2>
              <div className="space-y-3">
                {peptide.safetyNotes.map((note, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed"
                    style={{ color: "#78350f" }}
                  >
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* How this fits in the hub */}
          <section>
            <div
              className="rounded-xl border p-5"
              style={{
                background: "var(--surface-raised)",
                borderColor: "var(--card-border)",
              }}
            >
              <h2
                className="mb-2 text-sm font-bold uppercase tracking-wider"
                style={{ color: "var(--brand-gold)" }}
              >
                How This Fits Into Our Peptide Hub
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {peptide.hubNote}
              </p>
            </div>
          </section>

          {/* See also */}
          {peptide.seeAlso.length > 0 && (
            <section>
              <h2
                className="mb-4 text-sm font-bold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                See Also
              </h2>
              <div className="flex flex-wrap gap-2">
                {peptide.seeAlso.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/learn/${rel.slug}`}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface)",
                      color: "var(--foreground-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--surface-raised)";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--accent)";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--surface)";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--border)";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--foreground-secondary)";
                    }}
                  >
                    {rel.label} →
                  </Link>
                ))}
                <Link
                  href="/learn"
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                    color: "var(--muted)",
                  }}
                >
                  All peptides
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ── Back link ──────────────────────────────────────────────────────── */}
      <div
        className="border-t py-8"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="container-page flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/learn"
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: "var(--accent)" }}
          >
            ← Back to Peptide Education Hub
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/peptides"
              className="text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: "var(--muted)" }}
            >
              Browse prices →
            </Link>
            <Link
              href="/vendors"
              className="text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: "var(--muted)" }}
            >
              View vendors →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
