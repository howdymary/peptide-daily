import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

interface SharedProtocolPageProps {
  params: Promise<{ shareToken: string }>;
}

export async function generateMetadata({ params }: SharedProtocolPageProps): Promise<Metadata> {
  const { shareToken } = await params;
  const protocol = await prisma.protocol.findUnique({
    where: { shareToken },
    select: { name: true },
  });

  return {
    title: protocol ? `${protocol.name} | Protocol Builder` : "Protocol not found",
  };
}

export default async function SharedProtocolPage({ params }: SharedProtocolPageProps) {
  const { shareToken } = await params;

  const protocol = await prisma.protocol.findUnique({ where: { shareToken } });
  if (!protocol) notFound();

  // Increment view count
  await prisma.protocol.update({
    where: { id: protocol.id },
    data: { viewCount: { increment: 1 } },
  });

  // Fetch peptide names
  const peptides = await prisma.peptide.findMany({
    where: { id: { in: protocol.peptideIds } },
    select: { id: true, name: true, slug: true },
  });

  const peptideMap = new Map(peptides.map((p) => [p.id, p]));

  return (
    <div className="section-spacing">
      <div className="container-page max-w-3xl">
        <nav className="mb-6 text-sm text-[var(--text-tertiary)]">
          <Link href="/protocol-builder" className="hover:text-[var(--accent-primary)]">
            Protocol Builder
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--text-secondary)]">Shared Protocol</span>
        </nav>

        <div className="surface-card p-8">
          <h1 className="display-heading text-2xl">{protocol.name}</h1>
          {protocol.description && (
            <p className="mt-2 text-[var(--text-secondary)]">{protocol.description}</p>
          )}

          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Compounds ({protocol.peptideIds.length})
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {protocol.peptideIds.map((id, i) => {
                const peptide = peptideMap.get(id);
                return (
                  <span
                    key={id}
                    className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
                    style={{
                      borderColor: "var(--accent-border)",
                      background: "var(--accent-subtle)",
                    }}
                  >
                    <span className="data-mono text-xs text-[var(--text-tertiary)]">
                      {i + 1}
                    </span>
                    {peptide ? (
                      <Link
                        href={`/peptides/${peptide.slug}`}
                        className="font-medium text-[var(--accent-primary)] hover:underline"
                      >
                        {peptide.name}
                      </Link>
                    ) : (
                      <span className="text-[var(--text-secondary)]">Unknown</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {protocol.safetyScore != null && (
            <div className="mt-6 rounded-xl bg-[var(--bg-tertiary)] p-4">
              <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                Safety score
              </span>
              <span className="ml-3 data-mono text-2xl font-bold text-[var(--text-primary)]">
                {protocol.safetyScore}/100
              </span>
            </div>
          )}

          {protocol.goalTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {protocol.goalTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[var(--bg-tertiary)] px-2.5 py-1 text-xs text-[var(--text-tertiary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="mt-4 text-xs text-[var(--text-tertiary)]">
            {protocol.viewCount} view{protocol.viewCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/protocol-builder"
            className="text-sm font-medium text-[var(--accent-primary)] hover:underline"
          >
            Build your own protocol
          </Link>
        </div>

        <MedicalDisclaimer variant="callout" className="mt-10" />
      </div>
    </div>
  );
}
