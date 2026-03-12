import Link from "next/link";

export interface ArticleCardData {
  id: string;
  title: string;
  slug: string;
  sourceUrl: string;
  excerpt: string | null;
  author: string | null;
  publishedAt: string;
  tags: string[];
  isEditorsPick: boolean;
  source: { name: string; slug: string; siteUrl: string };
}

interface ArticleCardProps {
  article: ArticleCardData;
  variant?: "default" | "featured" | "compact";
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (days >= 7) return `${Math.floor(days / 7)}w ago`;
  if (days >= 1) return `${days}d ago`;
  if (hours >= 1) return `${hours}h ago`;
  return "just now";
}

/** Full-width featured card (editor's pick style) */
function FeaturedArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{ boxShadow: "var(--card-shadow)", textDecoration: "none" }}
    >
      {/* Source + date row */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide"
          style={{ background: "var(--brand-sky)", color: "var(--brand-navy)" }}
        >
          Editor&apos;s Pick
        </span>
        <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
          {article.source.name}
        </span>
        <span style={{ color: "var(--muted-light)" }} className="text-xs">
          ·
        </span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {timeAgo(article.publishedAt)}
        </span>
      </div>

      <h3
        className="text-base font-bold leading-snug transition-colors group-hover:text-[var(--accent)] sm:text-lg"
        style={{ color: "var(--foreground)" }}
      >
        {article.title}
      </h3>

      {article.excerpt && (
        <p
          className="mt-2 line-clamp-3 text-sm leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {article.excerpt}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {article.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-md px-2 py-0.5 text-xs"
            style={{
              background: "var(--surface-raised)",
              color: "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            {tag}
          </span>
        ))}
        <span
          className="ml-auto text-xs font-medium"
          style={{ color: "var(--accent)" }}
        >
          Read on {article.source.name} →
        </span>
      </div>
    </a>
  );
}

/** Standard article card for news grid */
function DefaultArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{ boxShadow: "var(--card-shadow)", textDecoration: "none" }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
          {article.source.name}
        </span>
        <span style={{ color: "var(--muted-light)" }} className="text-xs">·</span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {timeAgo(article.publishedAt)}
        </span>
      </div>

      <h3
        className="flex-1 text-sm font-semibold leading-snug transition-colors group-hover:text-[var(--accent)]"
        style={{ color: "var(--foreground)" }}
      >
        {article.title}
      </h3>

      {article.excerpt && (
        <p
          className="mt-2 line-clamp-2 text-xs leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {article.excerpt}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {article.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded px-1.5 py-0.5 text-xs"
            style={{
              background: "var(--surface-raised)",
              color: "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}

/** Compact list-style row (sidebar) */
function CompactArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex items-start gap-3 py-3 transition-colors focus-visible:outline-none"
      style={{ textDecoration: "none", borderBottom: "1px solid var(--border)" }}
    >
      <div className="min-w-0 flex-1">
        <p
          className="text-sm font-medium leading-snug transition-colors group-hover:text-[var(--accent)] line-clamp-2"
          style={{ color: "var(--foreground)" }}
        >
          {article.title}
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          {article.source.name} · {timeAgo(article.publishedAt)}
        </p>
      </div>
      <span
        className="mt-0.5 shrink-0 text-xs font-medium"
        style={{ color: "var(--accent)" }}
      >
        →
      </span>
    </a>
  );
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "featured") return <FeaturedArticleCard article={article} />;
  if (variant === "compact") return <CompactArticleCard article={article} />;
  return <DefaultArticleCard article={article} />;
}
