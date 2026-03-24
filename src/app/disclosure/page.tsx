import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Make Money & Affiliate Disclosure",
  description:
    "Peptide Daily's revenue model, affiliate relationships, and editorial independence policy.",
};

export default function DisclosurePage() {
  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <h1
          className="display-heading text-3xl sm:text-4xl"
          style={{ color: "var(--brand-navy)" }}
        >
          How We Make Money
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Last updated: March 24, 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              Our Commitment to Independence
            </h2>
            <p className="mt-2">
              Peptide Daily is an independent, editorially driven resource. Our rankings,
              Trust Scores, and recommendations are based entirely on third-party lab
              data, community reviews, and transparent methodology. No vendor can pay
              for a higher ranking or more favorable coverage.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              Affiliate Relationships
            </h2>
            <p className="mt-2">
              Peptide Daily may earn a commission when you purchase through vendor links
              on this site. This does not influence our rankings, Trust Scores, or
              editorial recommendations, which are based on independent research and
              transparent methodology.
            </p>
            <p className="mt-2">
              If we receive compensation from a vendor, that relationship is disclosed
              on the relevant page. If a vendor link does not carry an affiliate
              relationship, we state that clearly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              How Rankings Work
            </h2>
            <p className="mt-2">
              Our Trust Score is a weighted composite of three independently measured
              factors:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Lab testing data (50%)</strong> — sourced from Finnrick, an independent third-party testing organization</li>
              <li><strong>Community reviews (30%)</strong> — submitted by verified users</li>
              <li><strong>Pricing competitiveness (20%)</strong> — based on aggregated market data</li>
            </ul>
            <p className="mt-2">
              Affiliate status has zero weight in this calculation. A vendor with an
              affiliate relationship receives the same score as one without.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              Questions?
            </h2>
            <p className="mt-2">
              If you have questions about our revenue model or editorial independence,
              contact us at{" "}
              <a href="mailto:hello@peptidedaily.com" className="font-medium" style={{ color: "var(--accent)" }}>
                hello@peptidedaily.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
