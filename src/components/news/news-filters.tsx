import Link from "next/link";

function buildHref({
  category,
  source,
}: {
  category?: string;
  source?: string;
}) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (source && source !== "all") params.set("source", source);
  const query = params.toString();
  return query ? `/news?${query}` : "/news";
}

export function NewsFilters({
  categories,
  sources,
  activeCategory,
  activeSource,
}: {
  categories: string[];
  sources: Array<{ label: string; value: string }>;
  activeCategory: string;
  activeSource: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {["all", ...categories].map((category) => {
            const active = activeCategory === category;
            return (
              <Link
                key={category}
                href={buildHref({ category, source: activeSource })}
                className="rounded-full border px-4 py-2 text-sm transition-colors"
                style={{
                  borderColor: active ? "var(--accent-border)" : "var(--border-default)",
                  background: active ? "var(--accent-subtle)" : "var(--bg-secondary)",
                  color: active ? "var(--accent-primary)" : "var(--text-secondary)",
                }}
              >
                {category === "all" ? "All" : category}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          Source
        </p>
        <div className="flex flex-wrap gap-2">
          {sources.map((source) => {
            const active = activeSource === source.value;
            return (
              <Link
                key={source.value}
                href={buildHref({ category: activeCategory, source: source.value })}
                className="rounded-full border px-4 py-2 text-sm transition-colors"
                style={{
                  borderColor: active ? "var(--accent-border)" : "var(--border-default)",
                  background: active ? "var(--accent-subtle)" : "var(--bg-secondary)",
                  color: active ? "var(--accent-primary)" : "var(--text-secondary)",
                }}
              >
                {source.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
