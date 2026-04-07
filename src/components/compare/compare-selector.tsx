"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface PeptideOption {
  slug: string;
  name: string;
  category: string | null;
}

interface CompareSelectorProps {
  peptides: PeptideOption[];
  selected: string[];
}

export function CompareSelector({ peptides, selected }: CompareSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const maxItems = 3;
  const filtered = search
    ? peptides.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) &&
          !selected.includes(p.slug),
      )
    : [];

  function addPeptide(slug: string) {
    if (selected.length >= maxItems) return;
    const params = new URLSearchParams(searchParams);
    const next = [...selected, slug];
    params.set("slugs", next.join(","));
    setSearch("");
    startTransition(() => {
      router.push(`/compare?${params.toString()}`);
    });
  }

  function removePeptide(slug: string) {
    const params = new URLSearchParams(searchParams);
    const next = selected.filter((s) => s !== slug);
    if (next.length > 0) {
      params.set("slugs", next.join(","));
    } else {
      params.delete("slugs");
    }
    startTransition(() => {
      router.push(`/compare?${params.toString()}`);
    });
  }

  return (
    <div style={{ opacity: isPending ? 0.7 : 1 }}>
      {/* Selected pills */}
      <div className="flex flex-wrap gap-2">
        {selected.map((slug) => {
          const peptide = peptides.find((p) => p.slug === slug);
          return (
            <span
              key={slug}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm"
              style={{
                borderColor: "var(--accent-border)",
                background: "var(--accent-subtle)",
                color: "var(--accent-primary)",
              }}
            >
              {peptide?.name ?? slug}
              <button
                type="button"
                onClick={() => removePeptide(slug)}
                className="ml-0.5 rounded-full p-0.5 text-xs hover:bg-[var(--accent-primary)] hover:text-white"
                aria-label={`Remove ${peptide?.name ?? slug}`}
              >
                &times;
              </button>
            </span>
          );
        })}

        {selected.length < maxItems && (
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={selected.length === 0 ? "Search peptides to compare..." : "Add another..."}
              className="rounded-full border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-1.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)]"
              style={{ width: selected.length === 0 ? "320px" : "200px" }}
            />

            {filtered.length > 0 && (
              <ul className="absolute left-0 top-full z-20 mt-1 max-h-60 w-72 overflow-auto rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] shadow-lg">
                {filtered.slice(0, 10).map((p) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      onClick={() => addPeptide(p.slug)}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                    >
                      <span className="font-medium">{p.name}</span>
                      {p.category && (
                        <span className="text-xs text-[var(--text-tertiary)]">{p.category}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {selected.length === 0 && (
        <p className="mt-3 text-sm text-[var(--text-tertiary)]">
          Select 2-3 peptides to compare side by side.
        </p>
      )}
    </div>
  );
}
