import { Suspense } from "react";
import { SearchFilters } from "@/components/peptides/search-filters";
import { PeptideList } from "@/components/peptides/peptide-list";
import { CatalogGuideTip } from "@/components/ui/onboarding-tip";

export const metadata = {
  title: "Peptide Catalog — Compare Prices, Lab Grades, and Reviews",
  description:
    "Browse 50+ peptides with live vendor pricing, Finnrick lab grades, and community reviews. Filter by category, price, and lab quality.",
};

export default function PeptidesPage() {
  return (
    <div className="container-page py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          Compare Peptide Prices and Lab Grades
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Live vendor pricing updated every 15 minutes, alongside independent
          Finnrick lab grades and community reviews. Filter by category, price
          range, or lab quality.
        </p>
      </div>

      {/* Onboarding tip — collapsed once dismissed */}
      <CatalogGuideTip className="mb-5" />

      {/* Filters */}
      <Suspense fallback={<div className="skeleton mb-6 h-20 rounded-xl" />}>
        <SearchFilters />
      </Suspense>

      {/* Results */}
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="skeleton h-44 rounded-xl" />
            ))}
          </div>
        }
      >
        <PeptideList />
      </Suspense>
    </div>
  );
}
