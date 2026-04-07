import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

interface CombinationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CombinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const combo = await prisma.combinationProtocol.findUnique({
    where: { slug },
    select: { displayName: true, description: true },
  });

  if (!combo) return { title: "Protocol not found" };

  return {
    title: `${combo.displayName} | Combination Protocols | Peptide Daily`,
    description: combo.description.slice(0, 160),
  };
}

export default async function CombinationDetailPage({ params }: CombinationPageProps) {
  const { slug } = await params;

  const combo = await prisma.combinationProtocol.findUnique({
    where: { slug, isPublished: true },
  });

  if (!combo) notFound();

  const peptides = await prisma.peptide.findMany({
    where: { id: { in: combo.peptideIds } },
    select: { id: true, name: true, slug: true, category: true, description: true },
  });

  const peptideMap = new Map(peptides.map((p) => [p.id, p]));

  return (
    <div className="section-spacing">
      <div className="container-page max-w-3xl">
        <nav className="mb-6 text-sm text-[var(--text-tertiary)]" aria-label="Breadcrumb">
          <Link href="/combinations" className="hover:text-[var(--accent-primary)]">
            Combinations
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--text-secondary)]">{combo.displayName}</span>
        </nav>

        {/* Header */}
        <div className="surface-card p-8">
          <h1 className="display-heading text-2xl md:text-3xl">{combo.displayName}</h1>
          <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">{combo.description}</p>

          {combo.goalTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {combo.goalTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--accent-subtle)] px-3 py-1 text-xs font-medium text-[var(--accent-primary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Compounds */}
        <div className="surface-card mt-6 p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Compounds ({combo.peptideIds.length})
          </h2>
          <div className="mt-4 space-y-3">
            {combo.peptideIds.map((id, i) => {
              const peptide = peptideMap.get(id);
              if (!peptide) return null;
              return (
                <Link
                  key={id}
                  href={`/peptides/${peptide.slug}`}
                  className="flex items-start gap-3 rounded-xl border border-[var(--border-default)] p-4 transition-colors hover:border-[var(--accent-border)]"
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ background: "var(--accent-primary)" }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-medium text-[var(--text-primary)]">{peptide.name}</span>
                    {peptide.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-[var(--text-tertiary)]">
                        {peptide.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Rationale */}
        <div className="surface-card mt-6 p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Rationale</h2>
          <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">{combo.rationale}</p>
        </div>

        {/* Safety */}
        <div
          className="surface-card mt-6 p-6"
          style={{ borderLeft: "3px solid var(--warning)" }}
        >
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Safety considerations</h2>
          <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">{combo.safetyNotes}</p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/protocol-builder"
            className="rounded-xl bg-[var(--accent-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-primary-hover)]"
          >
            Customize in Protocol Builder
          </Link>
        </div>

        <MedicalDisclaimer variant="callout" className="mt-10" />
      </div>
    </div>
  );
}
