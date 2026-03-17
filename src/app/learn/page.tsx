import Link from "next/link";
import {
  PEPTIDES,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  REGULATORY_LABELS,
  REGULATORY_COLORS,
  getPeptidesByCategory,
} from "@/lib/learn/peptide-data";
import type { PeptideContent } from "@/lib/learn/peptide-data";

export const metadata = {
  title: "Peptide Education Hub — Research-Led Guides and Reference",
  description:
    "Educational overviews of 15+ key peptides — from FDA-approved medications to investigational compounds. Clinical context, peer-reviewed references, and current regulatory status.",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_DESCRIPTIONS: Record<PeptideContent["category"], string> = {
  metabolic:
    "GLP-1, GIP, and glucagon receptor agonists — the most clinically active peptide class in current research, including FDA-approved and investigational agents for metabolic health.",
  "growth-hormone":
    "GHRH analogs and ghrelin receptor agonists that stimulate pituitary GH release. Ranges from the FDA-approved tesamorelin to commonly compounded and research-only peptides.",
  "tissue-repair":
    "Peptides studied for wound healing, musculoskeletal repair, and skin biology — primarily in preclinical settings. Most lack human clinical trial data.",
  melanocortin:
    "Melanocortin receptor agonists with diverse effects on pigmentation, sexual function, and appetite. Includes the FDA-approved bremelanotide (Vyleesi) and the unapproved Melanotan II.",
};

// ─────────────────────────────────────────────────────────────────────────────
// PEPTIDE CARD
// ─────────────────────────────────────────────────────────────────────────────

function PeptideCard({ peptide }: { peptide: PeptideContent }) {
  const regColor = REGULATORY_COLORS[peptide.regulatoryStatus];
  const shortOverview =
    peptide.overview[0].length > 160
      ? peptide.overview[0].slice(0, 158) + "\u2026"
      : peptide.overview[0];

  return (
    <Link
      href={`/learn/${peptide.slug}`}
      className="hover-lift group flex flex-col rounded-xl border overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
        boxShadow: "var(--card-shadow)",
        textDecoration: "none",
      }}
    >
      {/* Top accent based on regulatory status */}
      <div className="h-1 w-full shrink-0" style={{ background: regColor.text }} />

      <div className="flex flex-1 flex-col p-5">
        {/* Regulatory badge */}
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

        {/* Name */}
        <h3
          className="text-base font-bold leading-snug transition-colors group-hover:text-[var(--accent)]"
          style={{ color: "var(--foreground)" }}
        >
          {peptide.name}
        </h3>
        {peptide.altName && (
          <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
            {peptide.altName}
          </p>
        )}

        {/* Short overview */}
        <p
          className="mt-3 flex-1 text-sm leading-relaxed line-clamp-3"
          style={{ color: "var(--muted)" }}
        >
          {shortOverview}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--muted-light)" }}
          >
            {peptide.references.length} references
          </span>
          <span
            className="text-sm font-semibold transition-opacity group-hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            Read more \u2192
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS LEGEND
// ─────────────────────────────────────────────────────────────────────────────

const LEGEND_ITEMS = [
  { status: "fda-approved" as const, description: "Prescription medication with active FDA approval" },
  { status: "investigational" as const, description: "In Phase 2 or Phase 3 clinical trials; not yet approved" },
  { status: "approved-china" as const, description: "Approved in China; investigational in the US and elsewhere" },
  { status: "compounded" as const, description: "Formerly approved or available via licensed compounding pharmacies" },
  { status: "research-chemical" as const, description: "Not approved for human use; FDA compounding restrictions apply" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function LearnPage() {
  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 sm:py-20"
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
          <div className="max-w-2xl">
            <div className="section-label-light mb-5">Peptide Education</div>

            <h1
              className="display-heading text-4xl sm:text-5xl"
              style={{ color: "#ffffff" }}
            >
              The peptide research <br />
              <em className="not-italic" style={{ color: "var(--brand-accent)" }}>
                reference library.
              </em>
            </h1>

            <p
              className="mt-5 text-base leading-relaxed sm:text-lg"
              style={{ color: "rgb(255 255 255 / 0.65)" }}
            >
              Straightforward educational overviews of 15 peptides currently in
              the research conversation — from FDA-approved prescription
              medications to compounds still in preclinical trials. Every page
              cites its sources.
            </p>

            {/* Stats strip */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { value: "15", label: "Peptides covered" },
                { value: "4", label: "FDA-approved" },
                { value: "5", label: "In Phase 3 trials" },
                { value: "50+", label: "Peer-reviewed references" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "var(--brand-accent)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs" style={{ color: "rgb(255 255 255 / 0.5)" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────────────────────────── */}
      <div
        className="border-b py-4"
        style={{
          background: "var(--info-bg)",
          borderColor: "var(--info-border)",
        }}
      >
        <div className="container-page">
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--info-text)" }}
          >
            <strong>Educational content only.</strong> The information on these
            pages is for educational purposes only. It does not constitute medical
            advice, diagnosis, or treatment recommendations. Always consult a
            qualified healthcare professional before making decisions related to
            any medication or health intervention. Regulations and product
            availability vary by country and jurisdiction.
          </p>
        </div>
      </div>

      {/* ── Status legend ──────────────────────────────────────────────────── */}
      <section className="py-8" style={{ background: "var(--surface-raised)" }}>
        <div className="container-page">
          <p
            className="mb-4 text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-accent)" }}
          >
            Regulatory Status Key
          </p>
          <div className="flex flex-wrap gap-3">
            {LEGEND_ITEMS.map(({ status, description }) => {
              const color = REGULATORY_COLORS[status];
              return (
                <div
                  key={status}
                  className="flex items-start gap-2 rounded-lg border px-3 py-2"
                  style={{
                    background: color.bg,
                    borderColor: color.border,
                  }}
                  title={description}
                >
                  <span
                    className="mt-px text-xs font-semibold"
                    style={{ color: color.text }}
                  >
                    {REGULATORY_LABELS[status]}
                  </span>
                  <span
                    className="hidden text-xs leading-snug sm:block"
                    style={{ color: color.text, opacity: 0.8 }}
                  >
                    — {description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Peptide categories ─────────────────────────────────────────────── */}
      <div style={{ background: "var(--background)" }}>
        {CATEGORY_ORDER.map((category, catIdx) => {
          const peptides = getPeptidesByCategory(category);
          return (
            <section
              key={category}
              className="py-12"
              style={{
                background:
                  catIdx % 2 === 0 ? "var(--background)" : "var(--surface)",
              }}
            >
              <div className="container-page">
                {/* Section header — no emoji */}
                <div className="mb-8">
                  <div className="section-label mb-3">
                    {CATEGORY_LABELS[category]}
                  </div>
                  <p
                    className="max-w-2xl text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    {CATEGORY_DESCRIPTIONS[category]}
                  </p>
                </div>

                {/* Grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {peptides.map((peptide) => (
                    <PeptideCard key={peptide.slug} peptide={peptide} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-14"
        style={{ background: "var(--brand-navy)" }}
      >
        <div className="container-page relative text-center">
          <div className="section-label-light mb-5 justify-center">
            Ready to compare?
          </div>
          <h2
            className="display-heading text-3xl"
            style={{ color: "#ffffff" }}
          >
            Compare prices and lab grades across verified vendors
          </h2>
          <p
            className="mt-3 text-sm"
            style={{ color: "rgb(255 255 255 / 0.6)" }}
          >
            Use our price comparison and Finnrick lab data tools alongside this
            educational content.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/peptides"
              className="rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "var(--brand-accent)", color: "#fff" }}
            >
              Compare Prices
            </Link>
            <Link
              href="/vendors"
              className="cta-ghost-btn rounded-lg border px-6 py-3 text-sm font-medium text-white transition-colors"
              style={{
                borderColor: "rgb(255 255 255 / 0.25)",
                color: "rgb(255 255 255 / 0.85)",
              }}
            >
              View Vendor Ratings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
