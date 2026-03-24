"use client";

import { useState, useMemo } from "react";
import { ArticleCard, type ArticleCardData } from "./article-card";

interface NewsFeedProps {
  articles: ArticleCardData[];
  allTags: string[];
}

/**
 * Category tab definitions — maps display label to a list of tags that
 * qualify an article for that category. Order matters: first match wins.
 */
const CATEGORY_TABS = [
  { label: "All", tags: [] as string[] },
  { label: "GLP-1", tags: ["GLP-1", "semaglutide", "tirzepatide", "liraglutide", "weight-management"] },
  { label: "Recovery", tags: ["BPC-157", "TB-500", "recovery"] },
  { label: "Cosmetic", tags: ["GHK-Cu", "cosmetic", "matrixyl"] },
  { label: "Growth", tags: ["growth-hormone", "ipamorelin", "CJC-1295", "sermorelin"] },
  { label: "Regulatory", tags: ["regulatory"] },
  { label: "Research", tags: ["research"] },
] as const;

type CategoryLabel = (typeof CATEGORY_TABS)[number]["label"];

export function NewsFeed({ articles, allTags }: NewsFeedProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryLabel>("All");

  // Category filter: an article matches if it has ANY of the category's tags
  const categoryFiltered = useMemo(() => {
    if (activeCategory === "All") return articles;
    const catTags = CATEGORY_TABS.find((c) => c.label === activeCategory)?.tags ?? [];
    if (catTags.length === 0) return articles;
    return articles.filter((a) => catTags.some((t) => a.tags.includes(t)));
  }, [articles, activeCategory]);

  // Tag pill filter within the active category
  const filtered = useMemo(() => {
    if (!activeTag) return categoryFiltered;
    return categoryFiltered.filter((a) => a.tags.includes(activeTag));
  }, [categoryFiltered, activeTag]);

  // Tags available within current category
  const availableTags = useMemo(
    () => [...new Set(categoryFiltered.flatMap((a) => a.tags))].sort(),
    [categoryFiltered],
  );

  function handleCategoryChange(label: CategoryLabel) {
    setActiveCategory(label);
    setActiveTag(null); // reset tag filter when switching category
  }

  // Only show category tabs that have at least one matching article
  const visibleCategories = CATEGORY_TABS.filter((cat) => {
    if (cat.label === "All") return true;
    return articles.some((a) => cat.tags.some((t) => a.tags.includes(t)));
  });

  return (
    <div>
      {/* ── Category tabs ───────────────────────────────────────────────── */}
      {visibleCategories.length > 1 && (
        <div
          className="mb-5 flex items-center gap-1 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Filter news by category"
        >
          {visibleCategories.map((cat) => {
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(cat.label)}
                className="shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{
                  background: isActive ? "var(--accent)" : "var(--surface-raised)",
                  color: isActive ? "white" : "var(--foreground-secondary)",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Tag filter pills (within active category) ───────────────────── */}
      {availableTags.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTag(null)}
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{
              background: activeTag === null ? "var(--brand-sky, #1A8F8F)" : "transparent",
              color: activeTag === null ? "white" : "var(--muted)",
              border: `1px solid ${activeTag === null ? "var(--brand-sky, #1A8F8F)" : "var(--border)"}`,
            }}
          >
            All
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className="rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{
                background: activeTag === tag ? "var(--brand-sky, #1A8F8F)" : "transparent",
                color: activeTag === tag ? "white" : "var(--muted)",
                border: `1px solid ${activeTag === tag ? "var(--brand-sky, #1A8F8F)" : "var(--border)"}`,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* ── Articles grid ───────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] py-12 text-center">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {activeTag
              ? `No articles tagged "${activeTag}" in this category.`
              : `No articles in the "${activeCategory}" category yet.`}
          </p>
          <button
            onClick={() => { setActiveTag(null); setActiveCategory("All"); }}
            className="mt-2 text-sm font-medium"
            style={{ color: "var(--accent)" }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Source attribution */}
      <p
        className="mt-5 text-xs leading-relaxed"
        style={{ color: "var(--muted-light)" }}
      >
        Articles link to original sources. Peptide Daily displays excerpts only
        and does not republish full content. Sources include PubMed, FDA, NIH,
        Science Daily, EurekAlert, and others — all via public RSS/Atom feeds.
      </p>
    </div>
  );
}
