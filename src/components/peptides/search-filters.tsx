"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1"); // Reset to first page on filter change
      startTransition(() => {
        router.push(`/peptides?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition],
  );

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search peptides..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              updateParams("search", e.target.value);
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        {/* Sort dropdown */}
        <select
          value={searchParams.get("sortBy") || ""}
          onChange={(e) => updateParams("sortBy", e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none"
        >
          <option value="">Sort by: Name</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="finnrick_rating">Finnrick Rating</option>
          <option value="trust_score">Trust Score</option>
        </select>

        {/* Availability filter */}
        <select
          value={searchParams.get("availability") || ""}
          onChange={(e) => updateParams("availability", e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none"
        >
          <option value="">All Availability</option>
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="pre_order">Pre-Order</option>
        </select>

        {/* Finnrick grade filter */}
        <select
          value={searchParams.get("finnrickGrade") || ""}
          onChange={(e) => updateParams("finnrickGrade", e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none"
          title="Filter by Finnrick lab testing grade"
        >
          <option value="">Finnrick: Any Grade</option>
          <option value="A">Grade A (Great)</option>
          <option value="B">Grade B (Good)</option>
          <option value="C">Grade C (Okay)</option>
          <option value="D">Grade D (Poor)</option>
          <option value="E">Grade E (Bad)</option>
        </select>
      </div>

      {/* Price range */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--muted)]">Price:</span>
        <input
          type="number"
          placeholder="Min"
          min={0}
          defaultValue={searchParams.get("minPrice") || ""}
          onChange={(e) => updateParams("minPrice", e.target.value)}
          className="w-24 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
        />
        <span className="text-[var(--muted)]">-</span>
        <input
          type="number"
          placeholder="Max"
          min={0}
          defaultValue={searchParams.get("maxPrice") || ""}
          onChange={(e) => updateParams("maxPrice", e.target.value)}
          className="w-24 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
        />
        {isPending && (
          <span className="ml-2 text-xs text-[var(--muted)]">Loading...</span>
        )}
      </div>
    </div>
  );
}
