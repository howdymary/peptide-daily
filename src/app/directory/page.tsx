import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/db/prisma";
import { buildProviderWhere, PROVIDER_TYPE_LABELS } from "@/lib/providers/search";
import { ProviderCard } from "@/components/directory/provider-card";
import { ProviderFilters } from "@/components/directory/provider-filters";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

export const metadata: Metadata = {
  title: "Clinic & Source Directory | Peptide Daily",
  description:
    "Find clinics, compounding pharmacies, telehealth providers, and peptide vendors. Filterable by type, location, FDA registration, and telehealth availability.",
};

export const revalidate = 300;

interface DirectoryPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function getProviders(params: Record<string, string | string[] | undefined>) {
  const search = typeof params.search === "string" ? params.search : undefined;
  const type = typeof params.type === "string" ? params.type : undefined;
  const state = typeof params.state === "string" ? params.state : undefined;
  const telehealth = params.telehealth === "true";
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const pageSize = 20;

  const where = buildProviderWhere({
    search,
    type: type as "clinic" | "pharmacy_503a" | "pharmacy_503b" | "telehealth" | "online_vendor" | undefined,
    state,
    telehealth: telehealth || undefined,
    page,
    pageSize,
  });

  const [providers, total, typeCounts] = await Promise.all([
    prisma.provider.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [{ fdaRegistered: "desc" }, { cpsVerified: "desc" }, { name: "asc" }],
    }),
    prisma.provider.count({ where }),
    prisma.provider.groupBy({
      by: ["type"],
      where: { isActive: true },
      _count: true,
    }),
  ]);

  return { providers, total, page, pageSize, typeCounts };
}

export default async function DirectoryPage({ searchParams }: DirectoryPageProps) {
  const params = await searchParams;
  const { providers, total, page, pageSize, typeCounts } = await getProviders(params);

  const totalPages = Math.ceil(total / pageSize);
  const totalProviders = typeCounts.reduce((sum, t) => sum + t._count, 0);

  return (
    <div className="section-spacing">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="eyebrow">Directory</span>
          <h1 className="section-heading mt-4">
            Clinics, pharmacies & peptide sources
          </h1>
          <p className="section-subheading">
            {totalProviders} providers across compounding pharmacies, telehealth clinics, and
            research vendors. Filter by type, location, or FDA registration status.
          </p>
        </div>

        {/* Stats bar */}
        <div className="mt-6 flex flex-wrap gap-4">
          {typeCounts
            .sort((a, b) => b._count - a._count)
            .map((tc) => (
              <div
                key={tc.type}
                className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 py-2.5"
              >
                <span className="data-mono text-lg font-semibold text-[var(--text-primary)]">
                  {tc._count}
                </span>
                <span className="ml-2 text-sm text-[var(--text-secondary)]">
                  {PROVIDER_TYPE_LABELS[tc.type] ?? tc.type}
                </span>
              </div>
            ))}
        </div>

        {/* Filters */}
        <div className="mt-8">
          <Suspense>
            <ProviderFilters />
          </Suspense>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-[var(--text-secondary)]">
          Showing {providers.length} of {total} providers
          {totalPages > 1 && ` (page ${page} of ${totalPages})`}
        </div>

        {/* Provider grid */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>

        {providers.length === 0 && (
          <div className="mt-10 rounded-[1.75rem] border border-dashed border-[var(--border-default)] px-6 py-14 text-center">
            <p className="font-[var(--font-newsreader)] text-3xl text-[var(--text-primary)]">
              No providers matched your filters
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
              Try broadening your search or clearing filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
            {page > 1 && (
              <a
                href={`/directory?page=${page - 1}`}
                className="rounded-lg border border-[var(--border-default)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              >
                Previous
              </a>
            )}
            <span className="px-3 text-sm text-[var(--text-secondary)]">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <a
                href={`/directory?page=${page + 1}`}
                className="rounded-lg border border-[var(--border-default)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              >
                Next
              </a>
            )}
          </nav>
        )}

        <MedicalDisclaimer variant="callout" className="mt-14" />
      </div>
    </div>
  );
}
