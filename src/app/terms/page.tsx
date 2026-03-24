import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions for using Peptide Daily, including disclaimers and user responsibilities.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <h1
          className="display-heading text-3xl sm:text-4xl"
          style={{ color: "var(--brand-navy)" }}
        >
          Terms of Service
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Last updated: March 24, 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              1. Acceptance of Terms
            </h2>
            <p className="mt-2">
              By accessing or using Peptide Daily (&quot;the Site&quot;), you agree to be bound
              by these Terms of Service. If you do not agree, do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              2. Nature of Content
            </h2>
            <p className="mt-2">
              All content on Peptide Daily is for <strong>informational and educational
              purposes only</strong>. Nothing on this site constitutes medical advice,
              diagnosis, or treatment. Always consult a qualified healthcare professional
              before starting any peptide regimen.
            </p>
            <p className="mt-2">
              Many peptides discussed on this site are classified as research chemicals
              and may not be approved for human consumption in your jurisdiction. It is
              your responsibility to understand and comply with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              3. Pricing and Vendor Information
            </h2>
            <p className="mt-2">
              Prices and vendor information are aggregated from publicly available
              sources and are subject to change without notice. Peptide Daily does not
              guarantee the accuracy, completeness, or timeliness of pricing data.
              Always verify prices directly with vendors before purchasing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              4. User Accounts
            </h2>
            <p className="mt-2">
              You are responsible for maintaining the confidentiality of your account
              credentials. You agree not to share your account or use another
              person&apos;s account. You are responsible for all activity under your
              account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              5. User-Generated Content
            </h2>
            <p className="mt-2">
              By submitting reviews or other content, you grant Peptide Daily a
              non-exclusive, royalty-free license to display that content on the Site.
              Reviews must be honest, based on your genuine experience, and must not
              contain medical advice, illegal content, or personally identifiable
              information about others.
            </p>
            <p className="mt-2">
              We reserve the right to moderate, edit, or remove content that violates
              these terms or community guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              6. Third-Party Lab Data
            </h2>
            <p className="mt-2">
              Lab testing data displayed on this site is sourced from Finnrick, an
              independent third-party testing organization. Peptide Daily is not
              affiliated with Finnrick and does not guarantee the accuracy of their
              testing results. The Trust Score is Peptide Daily&apos;s own derived metric
              and should not be confused with Finnrick&apos;s ratings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              7. Limitation of Liability
            </h2>
            <p className="mt-2">
              Peptide Daily is provided &quot;as is&quot; without warranties of any kind.
              We are not liable for any damages arising from your use of the Site,
              reliance on information provided, or purchases made through vendor links.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              8. Changes to Terms
            </h2>
            <p className="mt-2">
              We may update these terms at any time. Changes take effect when posted.
              Continued use of the Site constitutes acceptance of updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              9. Contact
            </h2>
            <p className="mt-2">
              For questions about these terms, contact us at{" "}
              <a href="mailto:legal@peptidedaily.com" className="font-medium" style={{ color: "var(--accent)" }}>
                legal@peptidedaily.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
