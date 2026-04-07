import type { Metadata } from "next";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

export const metadata: Metadata = {
  title: "Methodology | Peptide Daily",
  description:
    "Full transparency on how Peptide Daily scores vendors, calculates Trust Scores, sources data, and maintains editorial independence.",
};

export default function MethodologyPage() {
  return (
    <div className="section-spacing">
      <div className="container-page max-w-3xl">
        <span className="eyebrow">Methodology</span>
        <h1 className="section-heading mt-4">How we score and source</h1>
        <p className="section-subheading">
          Every number on Peptide Daily has a defined source and formula. This
          page explains exactly how we compute scores, where data originates,
          and what editorial policies govern the platform.
        </p>

        {/* Trust Score */}
        <section className="surface-card mt-10 p-6 md:p-8">
          <h2 className="display-heading text-xl">Trust Score (0–100)</h2>
          <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">
            The Trust Score is a composite metric that combines three independently-sourced
            signals into a single confidence indicator for a vendor-peptide pair.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-[var(--bg-tertiary)] p-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Finnrick Lab Data — 50% weight
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                The letter grade (A–E) maps to a base score: A=90, B=75, C=55, D=35, E=15.
                The vendor&apos;s average test score within their grade band adjusts this
                by &plusmn;10 points, yielding a 0–100 component score.
              </p>
            </div>

            <div className="rounded-xl bg-[var(--bg-tertiary)] p-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Community Reviews — 30% weight
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Average user rating (1–5 stars) scaled to 0–100, multiplied by a confidence
                factor: min(1, reviewCount / 10). Vendors with fewer than 10 reviews receive
                proportionally lower weight from this component.
              </p>
            </div>

            <div className="rounded-xl bg-[var(--bg-tertiary)] p-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Pricing Signal — 20% weight
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Price relative to the median across all vendors for the same peptide.
                Prices within 0.7x–1.3x of median score 100. Deviations beyond that range
                taper linearly to a floor of 60 at 1.0 standard deviation from median.
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-[var(--text-tertiary)]">
            When a component is missing (e.g., no Finnrick data), its weight is
            redistributed proportionally to the remaining components. If no
            components are available, no Trust Score is displayed.
          </p>
        </section>

        {/* Finnrick Grades */}
        <section className="surface-card mt-6 p-6 md:p-8">
          <h2 className="display-heading text-xl">Finnrick Lab Grades</h2>
          <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">
            Finnrick is an independent third-party testing service. We import
            their published test results without modification. Grades reflect:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-3">
              <span className="w-8 shrink-0 rounded-md bg-[var(--grade-a)] py-0.5 text-center text-xs font-bold text-white">A</span>
              Excellent — consistently high purity, accurate labeling, clean identity tests
            </li>
            <li className="flex gap-3">
              <span className="w-8 shrink-0 rounded-md bg-[var(--grade-b)] py-0.5 text-center text-xs font-bold text-white">B</span>
              Good — minor variances in quantity but solid purity and identity
            </li>
            <li className="flex gap-3">
              <span className="w-8 shrink-0 rounded-md bg-[var(--grade-c)] py-0.5 text-center text-xs font-bold text-white">C</span>
              Mixed — some tests pass, others show notable variance
            </li>
            <li className="flex gap-3">
              <span className="w-8 shrink-0 rounded-md bg-[var(--grade-d)] py-0.5 text-center text-xs font-bold text-white">D</span>
              Below average — frequent quantity or purity issues
            </li>
            <li className="flex gap-3">
              <span className="w-8 shrink-0 rounded-md bg-[var(--grade-e)] py-0.5 text-center text-xs font-bold text-white">E</span>
              Poor — significant and consistent quality problems
            </li>
          </ul>
        </section>

        {/* Data Sourcing */}
        <section className="surface-card mt-6 p-6 md:p-8">
          <h2 className="display-heading text-xl">Data sourcing</h2>
          <div className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
            <p>
              <strong className="text-[var(--text-primary)]">Pricing:</strong> Scraped
              directly from vendor websites every 15 minutes using dedicated per-vendor
              fetchers. We never pull pricing data from third-party aggregators.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">Lab testing:</strong> Imported
              from Finnrick&apos;s published test database. Imported as-is with no
              score modification by our team.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">Provider directory:</strong> Compiled
              from public FDA 503B registrations, state pharmacy board records, and provider
              self-submissions. FDA registration and CPS verification status are checked
              against official databases.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">Peptide data:</strong> Compiled
              from PubChem, PubMed, and published pharmacology literature. Molecular
              weights, mechanisms of action, and PK parameters come from peer-reviewed
              sources cited on each compound page.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">News:</strong> Aggregated
              from public RSS feeds (PubMed, FDA, NIH, Science Daily) with robots.txt
              compliance. We display title, excerpt, and attribution link — never full
              article text.
            </p>
          </div>
        </section>

        {/* Editorial Independence */}
        <section className="surface-card mt-6 p-6 md:p-8">
          <h2 className="display-heading text-xl">Editorial independence</h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
            <li>We have no affiliate relationships with any vendor or provider.</li>
            <li>Vendors cannot pay for placement, ranking, or score improvement.</li>
            <li>The Verified Source badge is cosmetic only — it does not affect scores.</li>
            <li>All editorial content is produced in-house without sponsor influence.</li>
            <li>Revenue comes from the Verified Source Program and downloadable resources.</li>
          </ul>
        </section>

        <MedicalDisclaimer variant="callout" className="mt-10" />
      </div>
    </div>
  );
}
