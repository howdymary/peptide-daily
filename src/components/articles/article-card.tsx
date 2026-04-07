import Link from "next/link";

interface ArticleCardProps {
  article: {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    authorName: string;
    readingTime: number;
    publishedAt: Date | null;
    tags: string[];
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  investigation: "Investigation",
  education: "Education",
  technical: "Technical",
  market: "Market Intel",
};

const CATEGORY_COLORS: Record<string, string> = {
  investigation: "oklch(55% 0.18 15)",
  education: "var(--accent-primary)",
  technical: "oklch(55% 0.12 240)",
  market: "oklch(55% 0.14 80)",
};

export function ArticleCard({ article }: ArticleCardProps) {
  const categoryLabel = CATEGORY_LABELS[article.category] ?? article.category;
  const categoryColor = CATEGORY_COLORS[article.category] ?? "var(--text-secondary)";

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="surface-card group flex flex-col p-6 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
          style={{ background: categoryColor }}
        >
          {categoryLabel}
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">
          {article.readingTime} min read
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
        {article.title}
      </h3>

      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
        {article.excerpt}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-tertiary)]">
        <span>{article.authorName}</span>
        {article.publishedAt && (
          <time dateTime={new Date(article.publishedAt).toISOString()}>
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        )}
      </div>
    </Link>
  );
}
