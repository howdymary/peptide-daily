import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

export const metadata: Metadata = {
  title: "Resources | Peptide Daily",
  description:
    "Free downloadable guides, checklists, and reference materials for peptide research and vendor evaluation.",
};

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const leadMagnets = await prisma.leadMagnet.findMany({
    where: { isActive: true },
    orderBy: { downloadCount: "desc" },
  });

  return (
    <div className="section-spacing">
      <div className="container-page max-w-3xl">
        <span className="eyebrow">Resources</span>
        <h1 className="section-heading mt-4">Guides & downloads</h1>
        <p className="section-subheading">
          Free reference materials to help you navigate the peptide landscape.
          No email required — download instantly.
        </p>

        {/* Existing static resources */}
        <div className="mt-10 grid gap-5">
          <Link
            href="/checklist"
            className="surface-card group flex items-start gap-5 p-6 transition-shadow hover:shadow-md"
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-white"
              style={{ background: "var(--accent-primary)" }}
            >
              C
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                Peptide Buyer&apos;s Checklist
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                A practical checklist for evaluating vendors: what to look for in
                certificates of analysis, red flags, and quality indicators.
              </p>
            </div>
          </Link>

          <Link
            href="/methodology"
            className="surface-card group flex items-start gap-5 p-6 transition-shadow hover:shadow-md"
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-white"
              style={{ background: "oklch(55% 0.12 240)" }}
            >
              M
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                Scoring Methodology
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Full transparency on how Trust Scores, Finnrick grades, and vendor
                rankings are calculated.
              </p>
            </div>
          </Link>

          <Link
            href="/faq"
            className="surface-card group flex items-start gap-5 p-6 transition-shadow hover:shadow-md"
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-white"
              style={{ background: "oklch(55% 0.14 80)" }}
            >
              ?
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                FAQ
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Common questions about data sourcing, editorial independence, and
                how to use the platform.
              </p>
            </div>
          </Link>
        </div>

        {/* Dynamic lead magnets */}
        {leadMagnets.length > 0 && (
          <>
            <h2 className="mt-12 text-lg font-semibold text-[var(--text-primary)]">
              Downloadable guides
            </h2>
            <div className="mt-4 grid gap-5">
              {leadMagnets.map((lm) => (
                <a
                  key={lm.id}
                  href={`/api/lead-magnets/${lm.slug}/download`}
                  className="surface-card group flex items-start gap-5 p-6 transition-shadow hover:shadow-md"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl text-white"
                    style={{ background: "oklch(55% 0.18 15)" }}
                  >
                    PDF
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                      {lm.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {lm.description}
                    </p>
                    <p className="mt-2 text-xs text-[var(--text-tertiary)]">
                      {Math.round(lm.fileSize / 1024)} KB &middot; {lm.downloadCount.toLocaleString()} downloads
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        <MedicalDisclaimer variant="callout" className="mt-14" />
      </div>
    </div>
  );
}
