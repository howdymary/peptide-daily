import Link from "next/link";

export const metadata = {
  title: "How It Works",
  description:
    "Learn how Peptide Daily sources data — Finnrick third-party lab testing, vendor price aggregation, and the Trust Score methodology.",
};

const GRADE_DESCRIPTIONS = [
  { grade: "A", label: "Great", color: "var(--grade-a-text)", bg: "var(--grade-a-bg)", border: "var(--grade-a-border)", desc: "Excellent purity and quantity accuracy. Top-tier lab results." },
  { grade: "B", label: "Good", color: "var(--grade-b-text)", bg: "var(--grade-b-bg)", border: "var(--grade-b-border)", desc: "Good results with minor inconsistencies across tests." },
  { grade: "C", label: "Okay", color: "var(--grade-c-text)", bg: "var(--grade-c-bg)", border: "var(--grade-c-border)", desc: "Acceptable but inconsistent. Review individual test results." },
  { grade: "D", label: "Poor", color: "var(--grade-d-text)", bg: "var(--grade-d-bg)", border: "var(--grade-d-border)", desc: "Significant lab issues. Exercise caution." },
  { grade: "E", label: "Bad", color: "var(--grade-e-text)", bg: "var(--grade-e-bg)", border: "var(--grade-e-border)", desc: "Major lab failures. Serious quality concerns." },
];

export default function AboutPage() {
  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            How Peptide Daily Works
          </h1>
          <p className="mt-2 text-base" style={{ color: "var(--muted)" }}>
            Transparent methodology behind every number and rating on this platform.
          </p>
        </div>

        {/* Medical disclaimer — prominent top */}
        <div
          id="disclaimer"
          className="mb-10 rounded-2xl p-6"
          style={{
            background: "var(--warning-bg)",
            border: "2px solid var(--warning-border)",
          }}
        >
          <div className="flex gap-3">
            <svg
              className="mt-0.5 h-6 w-6 shrink-0"
              style={{ color: "var(--warning)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <h2 className="text-base font-bold" style={{ color: "var(--warning)" }}>
                Medical Disclaimer
              </h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
                Peptide Daily is an <strong>informational resource only</strong>. We provide
                price comparison and third-party lab testing data for research purposes.
                <strong> This is not medical advice.</strong> Peptides are research
                chemicals; their safety and efficacy in humans has not been fully
                established by regulatory agencies. Always consult a qualified healthcare
                professional before using any peptide or research chemical. Peptide Daily is
                not responsible for any decisions made based on information on this site.
              </p>
            </div>
          </div>
        </div>

        {/* Data sources */}
        <section id="data-sources" className="mb-10">
          <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Data Sources
          </h2>
          <div className="space-y-4">
            <div
              className="rounded-xl p-5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
            >
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                Vendor prices
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                We automatically scrape vendor websites every 15 minutes to collect
                current pricing, product availability, and concentration information.
                Prices are cached and displayed alongside the timestamp of the last
                successful update.
              </p>
            </div>
            <div
              className="rounded-xl p-5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
            >
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                Finnrick lab testing data
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Finnrick (<a href="https://www.finnrick.com" target="_blank" rel="noopener noreferrer" className="underline">finnrick.com</a>)
                is an independent third-party lab testing service that purchases peptides
                from vendors and tests them for purity, quantity accuracy, identity, and
                endotoxins. We import Finnrick&apos;s published ratings and display them
                without modification. Peptide Daily is not affiliated with Finnrick.
              </p>
            </div>
            <div
              className="rounded-xl p-5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
            >
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                Community reviews
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Registered users can submit reviews for peptides. Reviews represent personal
                subjective experiences. Peptide Daily moderates reviews to remove spam and policy
                violations, but does not verify claims made in user reviews. Reviews are not
                medical testimony.
              </p>
            </div>
          </div>
        </section>

        {/* Finnrick grades */}
        <section id="finnrick" className="mb-10">
          <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Finnrick Grade Scale
          </h2>
          <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Finnrick assigns a letter grade (A–E) to each vendor-peptide pair based on
            the aggregate of all lab tests for that pair. Each test measures purity,
            quantity variance, identity confirmation, and endotoxin levels.
          </p>
          <div className="space-y-2">
            {GRADE_DESCRIPTIONS.map((g) => (
              <div
                key={g.grade}
                className="flex items-start gap-4 rounded-xl p-4"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                  style={{ color: g.color, background: g.bg, border: `1px solid ${g.border}` }}
                >
                  {g.grade}
                </span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                    {g.label}
                  </p>
                  <p className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>
                    {g.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust score */}
        <section id="trust-score" className="mb-10">
          <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Trust Score (Peptide Daily Metric)
          </h2>
          <div
            className="mb-4 rounded-xl p-4"
            style={{ background: "var(--info-bg)", border: "1px solid var(--info-border)" }}
          >
            <p className="text-sm font-semibold" style={{ color: "var(--info)" }}>
              Trust Score is Peptide Daily&apos;s own derived metric — it is not Finnrick&apos;s rating.
            </p>
          </div>
          <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            The Trust Score (0–100) is a composite metric we compute from three components
            for each vendor-peptide pair. It provides a single number for quick comparison
            but should not be treated as an authoritative quality judgment.
          </p>
          <div className="space-y-3">
            {[
              {
                label: "Finnrick Lab Score (weighted ~71% when available)",
                desc: "Derived from Finnrick's numeric test score. When no Finnrick data exists, this component is excluded and the remaining components are reweighted.",
              },
              {
                label: "Community Review Score (~0–29% weight)",
                desc: "Average star rating from verified community reviews. Weight increases as review count grows; low-review vendors get less weight here.",
              },
              {
                label: "Pricing Signal (~29% weight when no reviews)",
                desc: "Relative position of this vendor's price within the market. Moderate pricing vs. the median may signal a quality-conscious vendor; extremely low pricing is penalized.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-4"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                  {item.label}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy & contact */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Contact & Feedback
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Found a data error, missing vendor, or quality concern? Peptide Daily is a
            community-driven project. We welcome feedback on data accuracy. Vendor listing
            requests and Finnrick sync issues should be reported so we can investigate.
          </p>
        </section>

        {/* Bottom nav */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/peptides"
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: "var(--brand-navy)" }}
          >
            Browse Peptides
          </Link>
          <Link
            href="/vendors"
            className="rounded-xl px-5 py-2.5 text-sm font-medium transition"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--foreground-secondary)",
            }}
          >
            View Vendors
          </Link>
        </div>
      </div>
    </div>
  );
}
