import { Suspense } from "react";
import { SearchFilters } from "@/components/peptides/search-filters";
import { PeptideList } from "@/components/peptides/peptide-list";

export const metadata = {
  title: "Peptide Catalog — PeptidePal",
  description: "Browse and compare peptide prices from multiple vendors.",
};

export default function PeptidesPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Peptide Catalog</h1>
      <p className="mb-6 text-[var(--muted)]">
        Compare prices across vendors and find the best deals.
      </p>

      <Suspense fallback={<div className="h-20 animate-pulse rounded-lg bg-[var(--card-bg)]" />}>
        <SearchFilters />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]"
              />
            ))}
          </div>
        }
      >
        <PeptideList />
      </Suspense>
    </div>
  );
}
