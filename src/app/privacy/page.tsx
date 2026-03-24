import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Peptide Daily collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <h1
          className="display-heading text-3xl sm:text-4xl"
          style={{ color: "var(--brand-navy)" }}
        >
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Last updated: March 24, 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              1. Information We Collect
            </h2>
            <p className="mt-2">
              When you create an account on Peptide Daily, we collect your name, email
              address, and a hashed version of your password. We never store your
              password in plain text.
            </p>
            <p className="mt-2">
              We also collect anonymous usage data such as pages visited, search
              queries, and general interaction patterns to improve the site experience.
              This data is not linked to your personal identity.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              2. How We Use Your Information
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>To provide and maintain your account</li>
              <li>To display your reviews alongside your chosen display name</li>
              <li>To send transactional emails related to your account (e.g., password resets)</li>
              <li>To improve site functionality and content based on aggregated usage patterns</li>
            </ul>
            <p className="mt-2">
              We do not sell, rent, or share your personal information with third parties
              for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              3. Data Security
            </h2>
            <p className="mt-2">
              Passwords are hashed using bcrypt with a cost factor of 12. All
              connections to our database are encrypted with TLS. Sessions use
              JSON Web Tokens (JWTs) with secure, HTTP-only cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              4. Cookies
            </h2>
            <p className="mt-2">
              We use essential cookies for authentication (session tokens). We do not
              use third-party advertising or tracking cookies. Analytics, if enabled,
              use privacy-respecting, cookieless methods.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              5. Third-Party Services
            </h2>
            <p className="mt-2">
              Peptide Daily uses the following third-party services to operate:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Vercel</strong> for hosting and edge delivery</li>
              <li><strong>Neon</strong> for PostgreSQL database hosting</li>
              <li><strong>Upstash</strong> for Redis caching</li>
              <li><strong>Google OAuth</strong> (optional) for social sign-in</li>
            </ul>
            <p className="mt-2">
              Each service has its own privacy policy governing the data it processes
              on our behalf.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              6. Your Rights
            </h2>
            <p className="mt-2">You have the right to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us at the address below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              7. Changes to This Policy
            </h2>
            <p className="mt-2">
              We may update this privacy policy from time to time. Changes will be
              posted on this page with an updated revision date. Continued use of the
              site after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              8. Contact
            </h2>
            <p className="mt-2">
              For privacy-related inquiries, contact us at{" "}
              <a href="mailto:privacy@peptidedaily.com" className="font-medium" style={{ color: "var(--accent)" }}>
                privacy@peptidedaily.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
