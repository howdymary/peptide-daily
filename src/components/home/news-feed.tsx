"use client";

import { useState, useMemo } from "react";
import { ArticleCard, type ArticleCardData } from "./article-card";

interface NewsFeedProps {
  articles: ArticleCardData[];
  allTags: string[];
}

export function NewsFeed({ articles, allTags }: NewsFeedProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeTag) return articles;
    return articles.filter((a) => a.tags.includes(activeTag));
  }, [articles, activeTag]);

  return (
    <div>
      {/* Tag filter pills */}
      {allTags.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className="rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{
              background: activeTag === null ? "var(--accent)" : "var(--surface-raised)",
              color: activeTag === null ? "white" : "var(--muted)",
              border: `1px solid ${activeTag === null ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className="rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{
                background: activeTag === tag ? "var(--accent)" : "var(--surface-raised)",
                color: activeTag === tag ? "white" : "var(--muted)",
                border: `1px solid ${activeTag === tag ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <div
          className="rounded-xl border border-dashed border-[var(--border)] py-12 text-center"
        >
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No articles for &ldquo;{activeTag}&rdquo; yet.
          </p>
          <button
            onClick={() => setActiveTag(null)}
            className="mt-2 text-sm font-medium"
            style={{ color: "var(--accent)" }}
          >
            Clear filter
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Attribution notice */}
      <p
        className="mt-5 text-xs leading-relaxed"
        style={{ color: "var(--muted-light)" }}
      >
        Articles link to original sources. PeptidePal displays excerpts only
        and does not republish full content. Sources: PubMed, FDA, NIH, Science Daily.
      </p>
    </div>
  );
}
