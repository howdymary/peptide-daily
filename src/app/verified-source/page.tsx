import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verified Source Program | Peptide Daily",
  description:
    "The Verified Source Program ($99/year) adds a verified badge to your listing on Peptide Daily. It does not affect search ranking or scores — it signals identity verification to users.",
};

export default function VerifiedSourcePage() {
  return (
    <div className="section-spacing">
      <div className="container-page max-w-3xl">
        <span className="eyebrow">Verified Source Program</span>
        <h1 className="section-heading mt-4">Show users you are who you say you are</h1>
        <p className="section-subheading">
          The Verified Source badge signals that your organization has been
          identity-verified by Peptide Daily. It does not influence rankings,
          scores, or placement.
        </p>

        {/* Pricing card */}
        <div className="mx-auto mt-10 max-w-md surface-card p-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
            Annual membership
          </p>
          <p className="mt-2 font-[var(--font-newsreader)] text-5xl font-bold text-[var(--text-primary)]">
            $99
          </p>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">per year</p>

          <Link
            href="/verified-source/apply"
            className="mt-6 inline-block rounded-xl bg-[var(--accent-primary)] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-primary-hover)]"
          >
            Apply now
          </Link>
        </div>

        {/* What you get */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <div className="surface-card p-5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white"
              style={{ background: "var(--accent-primary)" }}
            >
              1
            </div>
            <h3 className="mt-3 font-semibold text-[var(--text-primary)]">Verified badge</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              A visible badge on your vendor or provider listing page that signals
              identity verification to users.
            </p>
          </div>

          <div className="surface-card p-5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white"
              style={{ background: "var(--accent-primary)" }}
            >
              2
            </div>
            <h3 className="mt-3 font-semibold text-[var(--text-primary)]">Priority updates</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Request listing updates (contact info, services, description) and
              get priority processing within 48 hours.
            </p>
          </div>

          <div className="surface-card p-5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white"
              style={{ background: "var(--accent-primary)" }}
            >
              3
            </div>
            <h3 className="mt-3 font-semibold text-[var(--text-primary)]">No ranking influence</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              The badge is cosmetic only. It does not change your Trust Score,
              search position, or editorial coverage in any way.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Common questions</h2>
          <dl className="mt-4 space-y-4">
            <div className="surface-card p-5">
              <dt className="font-medium text-[var(--text-primary)]">
                What verification is required?
              </dt>
              <dd className="mt-1 text-sm text-[var(--text-secondary)]">
                We verify your organization name, domain ownership, and contact
                information. For pharmacies, we additionally check state licensure
                and FDA registration status.
              </dd>
            </div>
            <div className="surface-card p-5">
              <dt className="font-medium text-[var(--text-primary)]">
                Can I cancel?
              </dt>
              <dd className="mt-1 text-sm text-[var(--text-secondary)]">
                Yes, at any time. The badge remains active until the end of your
                paid period. No refunds for partial years.
              </dd>
            </div>
            <div className="surface-card p-5">
              <dt className="font-medium text-[var(--text-primary)]">
                Will this improve my scores or ranking?
              </dt>
              <dd className="mt-1 text-sm text-[var(--text-secondary)]">
                No. The Verified Source badge has zero influence on Trust Scores,
                Finnrick grades, search ranking, or editorial coverage. It is
                strictly an identity verification signal.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
