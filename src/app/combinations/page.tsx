import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

export const metadata: Metadata = {
  title: "Combination Protocols | Peptide Daily",
  description:
    "Curated peptide combination protocols with rationale, safety notes, and compound breakdowns. Each protocol is editorially reviewed.",
};

export const dynamic = "force-dynamic";

export default async function CombinationsPage() {
  const combinations = await prisma.combinationProtocol.findMany({
    where: { isPublished: true },
    orderBy: { popularity: "desc" },
  });

  // Fetch peptide names for display
  const allPeptideIds = [...new Set(combinations.flatMap((c) => c.peptideIds))];
  const peptides = await prisma.peptide.findMany({
    where: { id: { in: allPeptideIds } },
    select: { id: true, name: true, slug: true },
  });
  const peptideMap = new Map(peptides.map((p) => [p.id, p]));

  return (
    <div className="section-spacing">
      <div className="container-page">
        <span className="eyebrow">Protocols</span>
        <h1 className="section-heading mt-4">Combination protocols</h1>
        <p className="section-subheading">
          Editorially reviewed compound combinations with rationale and safety
          context. Each protocol explains why these compounds are paired and
          what to watch for.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {combinations.map((combo) => {
            const comboPeptides = combo.peptideIds
              .map((id) => peptideMap.get(id))
              .filter(Boolean);

            return (
              <Link
                key={combo.id}
                href={`/combinations/${combo.slug}`}
                className="surface-card group flex flex-col p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                    {combo.displayName}
                  </h2>
                  <span className="shrink-0 rounded-full bg-[var(--bg-tertiary)] px-2.5 py-1 text-xs text-[var(--text-tertiary)]">
                    {combo.peptideIds.length} compounds
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-[var(--text-secondary)]">
                  {combo.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {comboPeptides.map((p) => (
                    <span
                      key={p!.id}
                      className="rounded-md bg-[var(--accent-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--accent-primary)]"
                    >
                      {p!.name}
                    </span>
                  ))}
                </div>

                {combo.goalTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {combo.goalTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[var(--bg-tertiary)] px-2 py-0.5 text-[11px] text-[var(--text-tertiary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {combinations.length === 0 && (
          <div className="mt-10 rounded-[1.75rem] border border-dashed border-[var(--border-default)] px-6 py-14 text-center">
            <p className="font-[var(--font-newsreader)] text-2xl text-[var(--text-primary)]">
              Combination protocols coming soon
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm text-[var(--text-secondary)]">
              Our editorial team is reviewing compound combinations. In the
              meantime, use the{" "}
              <Link href="/protocol-builder" className="text-[var(--accent-primary)] underline">
                Protocol Builder
              </Link>{" "}
              to create your own.
            </p>
          </div>
        )}

        <MedicalDisclaimer variant="callout" className="mt-14" />
      </div>
    </div>
  );
}
