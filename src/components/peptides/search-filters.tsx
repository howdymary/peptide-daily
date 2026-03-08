"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

const SORT_OPTIONS = [
  { value: "", label: "Name (A–Z)" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "finnrick_rating", label: "Finnrick Grade" },
  { value: "trust_score", label: "Trust Score" },
  { value: "rating", label: "Community Rating" },
];

const GRADE_OPTIONS = [
  { value: "", label: "Any grade" },
  { value: "A", label: "A — Great" },
  { value: "B", label: "B — Good" },
  { value: "C", label: "C — Okay" },
  { value: "D", label: "D — Poor" },
  { value: "E", label: "E — Bad" },
];

const AVAILABILITY_OPTIONS = [
  { value: "", label: "Any availability" },
  { value: "in_stock", label: "In Stock only" },
  { value: "pre_order", label: "Pre-Order" },
];

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
      params.set("page", "1");
      startTransition(() => {
        router.push(`/peptides?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition],
  );

  const hasActiveFilters =
    searchParams.get("search") ||
    searchParams.get("sortBy") ||
    searchParams.get("availability") ||
    searchParams.get("finnrickGrade") ||
    searchParams.get("minPrice") ||
    searchParams.get("maxPrice");

  const clearAll = () => {
    setSearch("");
    startTransition(() => {
      router.push("/peptides");
    });
  };

  return (
    <div
      className="mb-6 rounded-xl p-4"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      {/* Search bar row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "var(--muted-light)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search peptides…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              updateParams("search", e.target.value);
            }}
            className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
            aria-label="Search peptides"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="shrink-0 rounded-lg px-3 py-2.5 text-xs font-medium transition hover:opacity-80"
            style={{
              color: "var(--danger)",
              background: "var(--danger-bg)",
              border: "1px solid var(--danger-border)",
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="mt-3 flex flex-wrap gap-2.5">
        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="sort-select"
            className="text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            Sort
          </label>
          <select
            id="sort-select"
            value={searchParams.get("sortBy") || ""}
            onChange={(e) => updateParams("sortBy", e.target.value)}
            className="rounded-lg px-2.5 py-1.5 text-xs transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Finnrick grade */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="grade-select"
            className="text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            Lab Grade
          </label>
          <select
            id="grade-select"
            value={searchParams.get("finnrickGrade") || ""}
            onChange={(e) => updateParams("finnrickGrade", e.target.value)}
            className="rounded-lg px-2.5 py-1.5 text-xs transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
            title="Filter by Finnrick third-party lab testing grade"
          >
            {GRADE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="availability-select"
            className="text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            Availability
          </label>
          <select
            id="availability-select"
            value={searchParams.get("availability") || ""}
            onChange={(e) => updateParams("availability", e.target.value)}
            className="rounded-lg px-2.5 py-1.5 text-xs transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          >
            {AVAILABILITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price range */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
            Price $
          </span>
          <input
            type="number"
            placeholder="Min"
            min={0}
            defaultValue={searchParams.get("minPrice") || ""}
            onChange={(e) => updateParams("minPrice", e.target.value)}
            className="w-20 rounded-lg px-2.5 py-1.5 text-xs transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
            aria-label="Minimum price"
          />
          <span className="text-xs" style={{ color: "var(--muted-light)" }}>–</span>
          <input
            type="number"
            placeholder="Max"
            min={0}
            defaultValue={searchParams.get("maxPrice") || ""}
            onChange={(e) => updateParams("maxPrice", e.target.value)}
            className="w-20 rounded-lg px-2.5 py-1.5 text-xs transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{
              background: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
            aria-label="Maximum price"
          />
        </div>

        {isPending && (
          <span className="flex items-center text-xs" style={{ color: "var(--muted-light)" }}>
            <svg className="mr-1.5 h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading…
          </span>
        )}
      </div>
    </div>
  );
}
