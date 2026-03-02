"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PeptideCard } from "./peptide-card";
import { Pagination } from "@/components/ui/pagination";
import type { PeptideListItem, PaginatedResponse } from "@/types";

export function PeptideList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<PaginatedResponse<PeptideListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPeptides = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/peptides?${searchParams.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch peptides");
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPeptides();
  }, [fetchPeptides]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/peptides?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[var(--danger)] p-8 text-center">
        <p className="text-[var(--danger)]">{error}</p>
        <button
          onClick={fetchPeptides}
          className="mt-4 rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] p-12 text-center">
        <p className="text-[var(--muted)]">No peptides found matching your filters.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--muted)]">
        Showing {data.data.length} of {data.pagination.totalCount} peptides
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.data.map((peptide) => (
          <PeptideCard key={peptide.id} peptide={peptide} />
        ))}
      </div>

      <div className="mt-8">
        <Pagination
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
