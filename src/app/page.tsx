import Link from "next/link";
import { Suspense } from "react";
import { FeaturedPeptides } from "@/components/home/featured-peptides";

// ── Static sections ──────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    slug: "glp1",
    label: "GLP-1 / Metabolic",
    description: "Weight management and glucose regulation",
    icon: "⚡",
    query: "semaglutide",
    color: "var(--brand-teal)",
    colorBg: "#f0fdfa",
  },
  {
    slug: "gh",
    label: "Growth Hormone",
    description: "GH secretagogues and GHRH analogs",
    icon: "📈",
    query: "ipamorelin",
    color: "#7c3aed",
    colorBg: "#f5f3ff",
  },
  {
    slug: "recovery",
    label: "Recovery & Repair",
    description: "Tissue repair, anti-inflammatory",
    icon: "🔧",
    query: "bpc-157",
    color: "#0284c7",
    colorBg: "#f0f9ff",
  },
  {
    slug: "cosmetic",
    label: "Cosmetic",
    description: "Skin health, collagen, anti-aging",
    icon: "✨",
    query: "ghk-cu",
    color: "#b45309",
    colorBg: "#fffbeb",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Third-party lab testing",
    body: "Finnrick independently tests peptides from vendors and publishes purity, quantity accuracy, and identity results. We import this data and display it alongside prices — never modified.",
    color: "var(--brand-sky)",
  },
  {
    step: "02",
    title: "Price aggregation",
    body: "We scrape vendor websites automatically every 15 minutes to keep pricing current. You see price per package alongside concentration so you can compare apples to apples.",
    color: "var(--brand-teal)",
  },
  {
    step: "03",
    title: "Trust Score calculation",
    body: "Our Trust Score (0–100) combines Finnrick lab quality, community reviews, and pricing signals into a single number. It is our derived metric — clearly distinguished from Finnrick's own ratings.",
    color: "#7c3aed",
  },
];

const TRUST_SIGNALS = [
  { value: "5+", label: "Active vendors tracked" },
  { value: "8+", label: "Peptides in catalog" },
  { value: "A–E", label: "Finnrick grade scale" },
  { value: "15 min", label: "Price refresh interval" },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export const metadata = {
  title: "PeptidePal — Lab-Verified Peptide Price Comparison",
  description:
    "Compare peptide prices across vendors backed by third-party Finnrick lab testing data. Evidence-driven quality ratings and real-time pricing.",
};

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 sm:py-28"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-navy) 0%, #164e63 60%, #0d9488 100%)",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />

        <div className="container-page relative">
          <div className="mx-auto max-w-2xl text-center">
            {/* Eyebrow */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90">
              <span
                className="flex h-2 w-2 rounded-full bg-emerald-400"
                aria-hidden="true"
              />
              Backed by Finnrick third-party lab data
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Peptide quality data
              <br />
              <span className="text-[#7dd3fc]">you can trust</span>
            </h1>
            <p className="mt-5 text-lg text-white/75 sm:text-xl">
              Compare vendor prices alongside independent lab purity, quantity
              accuracy, and identity test results — all in one place.
            </p>

            {/* Search bar */}
            <form
              action="/peptides"
              method="get"
              className="mt-8 flex gap-2 sm:gap-3"
            >
              <label htmlFor="hero-search" className="sr-only">
                Search peptides
              </label>
              <input
                id="hero-search"
                name="search"
                type="text"
                placeholder="Search BPC-157, Semaglutide, TB-500…"
                className="flex-1 rounded-xl border border-white/20 bg-white/15 px-5 py-3.5 text-sm text-white placeholder:text-white/50 backdrop-blur-sm transition focus:border-white/50 focus:bg-white/20 focus:outline-none"
                autoComplete="off"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-5 py-3.5 text-sm font-semibold text-[var(--brand-navy)] transition hover:opacity-90"
                style={{ background: "white" }}
              >
                Search
              </button>
            </form>

            {/* CTAs */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/peptides"
                className="rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
              >
                Browse all peptides →
              </Link>
              <Link
                href="/about"
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-white/70 transition hover:text-white"
              >
                How it works
              </Link>
            </div>
          </div>

          {/* Trust signal stats */}
          <dl className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TRUST_SIGNALS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur-sm"
              >
                <dt className="text-2xl font-bold text-white">{s.value}</dt>
                <dd className="mt-1 text-xs text-white/65">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container-page">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              Browse by category
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Find peptides grouped by common research application
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/peptides?search=${cat.query}`}
                className="group flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                  style={{ background: cat.colorBg }}
                  aria-hidden="true"
                >
                  {cat.icon}
                </span>
                <div>
                  <p
                    className="font-semibold text-sm leading-snug"
                    style={{ color: "var(--foreground)" }}
                  >
                    {cat.label}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured peptides ──────────────────────────────────────────── */}
      <section className="py-4 pb-16" style={{ background: "var(--surface-raised)" }}>
        <div className="container-page">
          <div className="mb-8 flex items-baseline justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                All peptides
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Sorted by best Finnrick rating
              </p>
            </div>
            <Link
              href="/peptides"
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              View full catalog →
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="skeleton h-44 rounded-xl" />
                ))}
              </div>
            }
          >
            <FeaturedPeptides />
          </Suspense>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container-page">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              How we source data
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Transparent methodology — you should always know where numbers come from
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <span
                  className="mb-4 inline-block text-xs font-bold tracking-widest uppercase"
                  style={{ color: item.color }}
                >
                  Step {item.step}
                </span>
                <h3
                  className="text-base font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--surface-raised)]"
              style={{ color: "var(--foreground-secondary)" }}
            >
              Full methodology & disclaimers →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
      <section
        className="py-16"
        style={{ background: "var(--brand-navy)", color: "white" }}
      >
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold text-white">
            Ready to compare vendors?
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Browse all peptides, filter by Finnrick grade, and find the best
            price-to-quality ratio.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/peptides"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-navy)] transition hover:opacity-90"
            >
              Browse Catalog
            </Link>
            <Link
              href="/vendors"
              className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20"
            >
              View Vendors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
