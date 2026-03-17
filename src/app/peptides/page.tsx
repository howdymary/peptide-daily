import { Suspense } from "react";
import { SearchFilters } from "@/components/peptides/search-filters";
import { PeptideList } from "@/components/peptides/peptide-list";
import { CatalogGuideTip } from "@/components/ui/onboarding-tip";

export const metadata = {
  title: "Peptide Catalog",
  description:
    "Browse and compare peptides by price, Finnrick lab rating, and community reviews. Find the best vendors for BPC-157, semaglutide, TB-500, and more.",
};

export default function PeptidesPage() {
  return (
    <div className="container-page py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Peptide Catalog
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Vendor prices compared alongside third-party Finnrick lab data. Prices refresh automatically.
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
