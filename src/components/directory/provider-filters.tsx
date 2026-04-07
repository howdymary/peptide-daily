"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PROVIDER_TYPE_LABELS, US_STATES } from "@/lib/providers/search";

export function ProviderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentType = searchParams.get("type") ?? "";
  const currentState = searchParams.get("state") ?? "";
  const currentSearch = searchParams.get("search") ?? "";
  const currentTelehealth = searchParams.get("telehealth") === "true";

  function applyFilters(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    // Reset to page 1 on filter change
    params.delete("page");
    startTransition(() => {
      router.push(`/directory?${params.toString()}`);
    });
  }

  function clearAll() {
    startTransition(() => {
      router.push("/directory");
    });
  }

  const hasActiveFilters = currentType || currentState || currentTelehealth || currentSearch;

  return (
    <div
      className="rounded-[1.75rem] border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5"
      style={{ opacity: isPending ? 0.7 : 1 }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Search */}
        <div className="flex-1">
          <label
            htmlFor="provider-search"
            className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]"
          >
            Search
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const input = form.elements.namedItem("search") as HTMLInputElement;
              applyFilters({ search: input.value.trim() });
            }}
            className="flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-2"
          >
            <input
              id="provider-search"
              name="search"
              type="search"
              defaultValue={currentSearch}
              placeholder="Name, city, or keyword"
              className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
            />
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent-primary)] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-primary-hover)]"
            >
              Go
            </button>
          </form>
        </div>

        {/* Type */}
        <div>
          <label
            htmlFor="provider-type"
            className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]"
          >
            Type
          </label>
          <select
            id="provider-type"
            value={currentType}
            onChange={(e) => applyFilters({ type: e.target.value })}
            className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-primary)]"
          >
            <option value="">All types</option>
            {Object.entries(PROVIDER_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label
            htmlFor="provider-state"
            className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]"
          >
            State
          </label>
          <select
            id="provider-state"
            value={currentState}
            onChange={(e) => applyFilters({ state: e.target.value })}
            className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-primary)]"
          >
            <option value="">All states</option>
            {US_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Telehealth toggle */}
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-2.5">
          <input
            type="checkbox"
            checked={currentTelehealth}
            onChange={(e) => applyFilters({ telehealth: e.target.checked ? "true" : "" })}
            className="accent-[var(--accent-primary)]"
          />
          <span className="text-sm text-[var(--text-primary)]">Telehealth</span>
        </label>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-[var(--accent-primary)] underline underline-offset-2 hover:text-[var(--accent-primary-hover)]"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
