"use client";

import { useDeferredValue, useState } from "react";
import { useRouter } from "next/navigation";

interface HeroSearchProps {
  suggestions: Array<{ name: string; slug: string; grade: string | null }>;
}

export function HeroSearch({ suggestions }: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const value = deferredQuery.trim().toLowerCase();
  const matches = !value
    ? suggestions.slice(0, 6)
    : suggestions.filter((item) => item.name.toLowerCase().includes(value)).slice(0, 6);

  function submit(value: string) {
    const next = value.trim();
    if (!next) return;
    router.push(`/peptides?search=${encodeURIComponent(next)}`);
    setOpen(false);
  }

  return (
    <div className="relative max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
        className="surface-card flex items-center gap-3 rounded-[1.75rem] px-4 py-3"
      >
        <span className="text-lg text-[var(--text-tertiary)]" aria-hidden="true">
          🔍
        </span>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120);
          }}
          placeholder="Search peptides..."
          className="w-full bg-transparent text-base text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
          aria-label="Search peptides"
        />
        <button
          type="submit"
          className="rounded-full bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-primary-hover)]"
        >
          Search
        </button>
      </form>

      {open && matches.length > 0 && (
        <div className="surface-card absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 overflow-hidden rounded-[1.5rem] p-2">
          {matches.map((item) => (
            <button
              key={item.slug}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => submit(item.name)}
              className="flex w-full items-center justify-between rounded-[1rem] px-3 py-3 text-left transition-colors hover:bg-[var(--bg-accent)]"
            >
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                  Peptide profile
                </p>
              </div>
              <span className="font-mono text-sm text-[var(--text-secondary)]">
                {item.grade ?? "—"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
