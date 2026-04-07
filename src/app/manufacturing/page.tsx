import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

export const metadata: Metadata = {
  title: "Manufacturing Partners | Peptide Daily",
  description:
    "Directory of peptide Contract Development and Manufacturing Organizations (CDMOs) with FDA registration status, capabilities, and contact information.",
};

export const dynamic = "force-dynamic";

export default async function ManufacturingPage() {
  const cdmos = await prisma.cdmo.findMany({
    where: { isActive: true },
    orderBy: [{ fdaRegistered: "desc" }, { name: "asc" }],
  });

  return (
    <div className="section-spacing">
      <div className="container-page">
        <span className="eyebrow">Manufacturing</span>
        <h1 className="section-heading mt-4">Manufacturing partners</h1>
        <p className="section-subheading">
          Contract Development and Manufacturing Organizations (CDMOs) that
          specialize in peptide API synthesis, formulation, and drug product
          manufacturing.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {cdmos.map((cdmo) => (
            <Link
              key={cdmo.id}
              href={`/manufacturing/${cdmo.slug}`}
              className="surface-card group flex flex-col gap-3 p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                  {cdmo.name}
                </h2>
                {cdmo.fdaRegistered && (
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      background: "oklch(95% 0.05 145)",
                      color: "oklch(45% 0.15 145)",
                    }}
                  >
                    FDA Registered
                  </span>
                )}
              </div>

              {cdmo.city && cdmo.state && (
                <p className="text-sm text-[var(--text-tertiary)]">
                  {cdmo.city}, {cdmo.state}
                </p>
              )}

              {cdmo.description && (
                <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {cdmo.description}
                </p>
              )}

              {cdmo.capabilities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {cdmo.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="rounded-md bg-[var(--bg-tertiary)] px-2 py-0.5 text-[11px] text-[var(--text-tertiary)]"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>

        {cdmos.length === 0 && (
          <div className="mt-10 rounded-[1.75rem] border border-dashed border-[var(--border-default)] px-6 py-14 text-center">
            <p className="font-[var(--font-newsreader)] text-2xl text-[var(--text-primary)]">
              Manufacturing directory coming soon
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm text-[var(--text-secondary)]">
              We are compiling a comprehensive directory of peptide CDMOs. Check back soon.
            </p>
          </div>
        )}

        <MedicalDisclaimer variant="callout" className="mt-14" />
      </div>
    </div>
  );
}
