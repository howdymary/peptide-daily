import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

interface CdmoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CdmoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cdmo = await prisma.cdmo.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!cdmo) return { title: "Manufacturer not found" };
  return {
    title: `${cdmo.name} | Manufacturing Partners | Peptide Daily`,
    description: cdmo.description?.slice(0, 160) ?? `${cdmo.name} peptide CDMO profile.`,
  };
}

export default async function CdmoDetailPage({ params }: CdmoPageProps) {
  const { slug } = await params;
  const cdmo = await prisma.cdmo.findUnique({ where: { slug, isActive: true } });
  if (!cdmo) notFound();

  return (
    <div className="section-spacing">
      <div className="container-page max-w-3xl">
        <nav className="mb-6 text-sm text-[var(--text-tertiary)]" aria-label="Breadcrumb">
          <Link href="/manufacturing" className="hover:text-[var(--accent-primary)]">
            Manufacturing
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--text-secondary)]">{cdmo.name}</span>
        </nav>

        <div className="surface-card p-6 md:p-8">
          <div className="flex items-start justify-between gap-3">
            <h1 className="display-heading text-2xl md:text-3xl">{cdmo.name}</h1>
            {cdmo.fdaRegistered && (
              <span
                className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase"
                style={{ background: "oklch(95% 0.05 145)", color: "oklch(45% 0.15 145)" }}
              >
                FDA Registered
              </span>
            )}
          </div>

          {cdmo.city && cdmo.state && (
            <p className="mt-2 text-sm text-[var(--text-tertiary)]">
              {cdmo.city}, {cdmo.state}
            </p>
          )}

          {cdmo.description && (
            <p className="mt-4 leading-relaxed text-[var(--text-secondary)]">
              {cdmo.description}
            </p>
          )}
        </div>

        {cdmo.capabilities.length > 0 && (
          <div className="surface-card mt-6 p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Capabilities</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {cdmo.capabilities.map((cap) => (
                <div
                  key={cap}
                  className="flex items-center gap-2 rounded-lg border border-[var(--border-default)] px-3 py-2"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: "var(--accent-primary)" }} />
                  <span className="text-sm text-[var(--text-primary)]">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {cdmo.website && (
          <div className="surface-card mt-6 p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Contact</h2>
            <a
              href={cdmo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-[var(--accent-primary)] underline underline-offset-2"
            >
              {cdmo.website.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          </div>
        )}

        <MedicalDisclaimer variant="callout" className="mt-10" />
      </div>
    </div>
  );
}
