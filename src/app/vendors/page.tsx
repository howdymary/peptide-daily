import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { bestFinnrickGrade } from "@/lib/finnrick/trust-score";
import { computeVendorTrustScore } from "@/lib/vendors/metrics";
import { VendorCard } from "@/components/vendors/vendor-card";
import { EmptyVendorState } from "@/components/primitives/empty-vendor-state";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";
import { DataSourceTag } from "@/components/primitives/data-source-tag";
import type { FinnrickGrade } from "@/types";

export const metadata: Metadata = {
  title: "Peptide vendors with independent lab testing",
  description:
    "Browse peptide vendors ranked by Finnrick-backed lab data, testing depth, and catalog breadth. Untested vendors stay visible without pretending data exists.",
};

async function getVendorDirectory() {
  const vendors = await prisma.vendor.findMany({
    where: { isActive: true },
    include: {
      prices: {
        select: {
          peptideId: true,
        },
      },
      finnrickRatings: {
        select: {
          grade: true,
          averageScore: true,
          testCount: true,
          newestTestDate: true,
        },
      },
      vendorMapping: {
        select: {
          vendorDomain: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return vendors.map((vendor) => {
    const peptideCount = new Set(vendor.prices.map((price) => price.peptideId)).size;
    const totalTestCount = vendor.finnrickRatings.reduce((sum, item) => sum + item.testCount, 0);
    const averageScore =
      vendor.finnrickRatings.length > 0
        ? vendor.finnrickRatings.reduce((sum, item) => sum + Number(item.averageScore), 0) /
          vendor.finnrickRatings.length
        : null;
    const latestTestDate =
      vendor.finnrickRatings.length > 0
        ? vendor.finnrickRatings.reduce(
            (latest, item) =>
              item.newestTestDate > latest ? item.newestTestDate : latest,
            vendor.finnrickRatings[0].newestTestDate,
          )
        : null;
    const bestGrade = bestFinnrickGrade(
      vendor.finnrickRatings.map((item) => ({
        grade: item.grade as FinnrickGrade,
      })),
    );
    const trust = computeVendorTrustScore({
      averageFinnrickScore: averageScore,
      totalTestCount,
      peptideCount,
      latestTestDate,
    });

    return {
      id: vendor.id,
      name: vendor.name,
      slug: vendor.slug,
      website: vendor.website,
      vendorDomain: vendor.vendorMapping?.vendorDomain ?? null,
      peptideCount,
      totalTestCount,
      averageScore: averageScore != null ? Math.round(averageScore * 10) / 10 : null,
      latestTestDate,
      bestGrade,
      trustScore: trust.overall,
      hasLabData: vendor.finnrickRatings.length > 0,
    };
  });
}

function buildFilterHref({
  query,
  filter,
}: {
  query: string;
  filter: "all" | "tested" | "pending";
}) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (filter !== "all") params.set("filter", filter);
  const search = params.toString();
  return search ? `/vendors?${search}` : "/vendors";
}

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const filter =
    typeof params.filter === "string" && ["tested", "pending"].includes(params.filter)
      ? (params.filter as "tested" | "pending")
      : "all";

  const vendors = await getVendorDirectory();
  const filtered = vendors
    .filter((vendor) =>
      query ? vendor.name.toLowerCase().includes(query.toLowerCase()) : true,
    )
    .filter((vendor) => {
      if (filter === "tested") return vendor.hasLabData;
      if (filter === "pending") return !vendor.hasLabData;
      return true;
    })
    .sort((a, b) => Number(b.hasLabData) - Number(a.hasLabData) || b.trustScore - a.trustScore || a.name.localeCompare(b.name));

  const latestLabDate =
    filtered.find((vendor) => vendor.latestTestDate)?.latestTestDate ??
    vendors.find((vendor) => vendor.latestTestDate)?.latestTestDate ??
    null;

  const tabs = [
    { key: "all", label: "All vendors" },
    { key: "tested", label: "Has lab data" },
    { key: "pending", label: "Pending review" },
  ] as const;

  return (
    <div className="section-spacing">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="eyebrow">Vendor database</span>
          <h1 className="section-heading mt-4">Independent vendor profiles, without the fluff</h1>
          <p className="section-subheading">
            We sort tested vendors to the top, keep untested vendors visible, and make the
            source of every grade explicit so the directory feels honest instead of inflated.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[1.75rem] border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5 md:flex-row md:items-center md:justify-between">
          <form action="/vendors" className="flex w-full max-w-xl items-center gap-3 rounded-full border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3">
            <span className="text-[var(--text-tertiary)]" aria-hidden="true">
              🔎
            </span>
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search vendors"
              className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
            />
            {filter !== "all" && <input type="hidden" name="filter" value={filter} />}
            <button
              type="submit"
              className="rounded-full bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-primary-hover)]"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const active = filter === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={buildFilterHref({ query, filter: tab.key })}
                  className="rounded-full border px-4 py-2 text-sm transition-colors"
                  style={{
                    borderColor: active ? "var(--accent-border)" : "var(--border-default)",
                    background: active ? "var(--accent-subtle)" : "var(--bg-secondary)",
                    color: active ? "var(--accent-primary)" : "var(--text-secondary)",
                  }}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
          <span>{filtered.length} vendors shown</span>
          <span aria-hidden="true">·</span>
          <span>{vendors.filter((vendor) => vendor.hasLabData).length} independently tested</span>
          <span aria-hidden="true">·</span>
          <DataSourceTag source="Finnrick" lastUpdated={latestLabDate} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {filtered.map((vendor) =>
            vendor.hasLabData ? (
              <VendorCard key={vendor.id} vendor={vendor} />
            ) : (
              <EmptyVendorState
                key={vendor.id}
                vendorName={vendor.name}
                vendorSlug={vendor.slug}
                website={vendor.vendorDomain ?? vendor.website.replace(/^https?:\/\//, "")}
              />
            ),
          )}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-[1.75rem] border border-dashed border-[var(--border-default)] px-6 py-14 text-center">
            <p className="font-[var(--font-newsreader)] text-3xl text-[var(--text-primary)]">
              No vendors matched that filter
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
              Try a broader search or switch back to all vendors. We keep pending vendors in
              the directory so the coverage roadmap stays visible.
            </p>
          </div>
        )}

        <MedicalDisclaimer variant="callout" className="mt-14" />
      </div>
    </div>
  );
}
