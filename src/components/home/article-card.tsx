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
  variant?: "default" | "featured" | "compact" | "hero";
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

/** Large hero card — left slot in editorial 3:2 grid */
function HeroArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex h-full flex-col rounded-xl border bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] overflow-hidden"
      style={{
        borderColor: "var(--card-border)",
        boxShadow: "var(--card-shadow-md)",
        textDecoration: "none",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "var(--card-shadow-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "var(--card-shadow-md)";
      }}
    >
      {/* Thick gold top accent bar */}
      <div
        className="h-1 w-full shrink-0"
        style={{ background: "var(--brand-gold)" }}
      />

      <div className="flex flex-1 flex-col p-7">
        {/* Meta row */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide"
            style={{
              background: "var(--brand-gold-light)",
              color: "var(--brand-gold)",
            }}
          >
            Editor&apos;s Pick
          </span>
          <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
            {article.source.name}
          </span>
          <span className="text-xs" style={{ color: "var(--muted-light)" }}>·</span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {timeAgo(article.publishedAt)}
          </span>
        </div>

        {/* Title — DM Serif Display */}
        <h3
          className="flex-1 text-2xl leading-snug transition-colors group-hover:text-[var(--accent)] sm:text-3xl"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            color: "var(--foreground)",
            letterSpacing: "-0.01em",
          }}
        >
          {article.title}
        </h3>

        {article.excerpt && (
          <p
            className="mt-4 line-clamp-3 text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {article.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
          <span
            className="ml-auto shrink-0 text-sm font-semibold transition-opacity group-hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            Read →
          </span>
        </div>
      </div>
    </a>
  );
}

/** Featured card — side slot or standalone (tall card style) */
function FeaturedArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex h-full flex-col rounded-xl border bg-white overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        borderColor: "var(--card-border)",
        boxShadow: "var(--card-shadow)",
        textDecoration: "none",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "var(--card-shadow-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow)";
      }}
    >
      {/* Teal top accent bar */}
      <div
        className="h-0.5 w-full shrink-0"
        style={{ background: "var(--accent)" }}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Source + date */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
            {article.source.name}
          </span>
          <span className="text-xs" style={{ color: "var(--muted-light)" }}>·</span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {timeAgo(article.publishedAt)}
          </span>
        </div>

        <h3
          className="flex-1 text-base font-bold leading-snug transition-colors group-hover:text-[var(--accent)] sm:text-lg"
          style={{ color: "var(--foreground)" }}
        >
          {article.title}
        </h3>

        {article.excerpt && (
          <p
            className="mt-2 line-clamp-2 text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {article.excerpt}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
          <span
            className="ml-auto shrink-0 text-xs font-semibold"
            style={{ color: "var(--accent)" }}
          >
            →
          </span>
        </div>
      </div>
    </a>
  );
}

/** Standard news grid card */
function DefaultArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex flex-col rounded-xl border bg-white overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        borderColor: "var(--card-border)",
        boxShadow: "var(--card-shadow)",
        textDecoration: "none",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "var(--card-shadow-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow)";
      }}
    >
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
            {article.source.name}
          </span>
          <span className="text-xs" style={{ color: "var(--muted-light)" }}>·</span>
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
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
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
      className="group flex items-start gap-3 py-3 focus-visible:outline-none"
      style={{
        textDecoration: "none",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Color pip */}
      <span
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: "var(--accent)" }}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p
          className="text-sm font-medium leading-snug line-clamp-2 transition-colors group-hover:text-[var(--accent)]"
          style={{ color: "var(--foreground)" }}
        >
          {article.title}
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          {article.source.name} · {timeAgo(article.publishedAt)}
        </p>
      </div>
    </a>
  );
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "hero") return <HeroArticleCard article={article} />;
  if (variant === "featured") return <FeaturedArticleCard article={article} />;
  if (variant === "compact") return <CompactArticleCard article={article} />;
  return <DefaultArticleCard article={article} />;
}
