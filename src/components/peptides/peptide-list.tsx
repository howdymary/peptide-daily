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
      if (!res.ok) throw new Error("Failed to fetch peptides");
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
          <div key={i} className="skeleton h-44 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{
          background: "var(--danger-bg)",
          border: "1px solid var(--danger-border)",
        }}
      >
        <svg
          className="mx-auto mb-3 h-8 w-8"
          style={{ color: "var(--danger)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="text-sm font-medium" style={{ color: "var(--danger)" }}>
          {error}
        </p>
        <button
          onClick={fetchPeptides}
          className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: "var(--danger)" }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div
        className="rounded-xl p-12 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          No peptides found
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-xs" style={{ color: "var(--muted)" }}>
        Showing{" "}
        <strong style={{ color: "var(--foreground)" }}>{data.data.length}</strong> of{" "}
        <strong style={{ color: "var(--foreground)" }}>{data.pagination.totalCount}</strong>{" "}
        peptides
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
