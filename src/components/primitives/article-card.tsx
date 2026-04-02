import Link from "next/link";
import { CategoryPill } from "@/components/primitives/category-pill";
import { SourceBadge } from "@/components/primitives/source-badge";
import { formatAbsoluteDate, formatRelativeTime } from "@/lib/presentation";
import { cn } from "@/lib/cn";

export interface EditorialArticle {
  id: string;
  title: string;
  sourceUrl: string;
  summary?: string | null;
  category?: string | null;
  date?: string | Date | null;
  source?: string | null;
  tags?: string[];
  featuredLabel?: string | null;
}

export function ArticleCard({
  article,
  variant = "standard",
  className,
}: {
  article: EditorialArticle;
  variant?: "featured" | "standard" | "compact";
  className?: string;
}) {
  const featured = variant === "featured";
  const compact = variant === "compact";

  return (
    <Link
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex h-full flex-col rounded-[1.5rem] border bg-[var(--bg-secondary)] p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[0_20px_48px_-28px_rgba(28,25,23,0.22)]",
        className,
      )}
      style={{ borderColor: "var(--border-default)" }}
    >
      <div className="flex flex-wrap items-center gap-2">
        {article.source && <SourceBadge source={article.source} />}
        {article.category && <CategoryPill category={article.category} />}
        {article.featuredLabel && (
          <span className="rounded-full bg-[var(--accent-subtle)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent-primary)]">
            {article.featuredLabel}
          </span>
        )}
      </div>

      <h3
        className={cn(
          "mt-4 font-[var(--font-newsreader)] leading-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]",
          featured ? "text-[clamp(1.85rem,3.4vw,3rem)]" : compact ? "text-xl" : "text-2xl",
        )}
      >
        {article.title}
      </h3>

      {!compact && article.summary && (
        <p className="mt-3 max-w-none text-sm leading-7 text-[var(--text-secondary)]">
          {article.summary}
        </p>
      )}

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)]">
          {article.date && <span>{formatRelativeTime(article.date)}</span>}
          {article.date && <span aria-hidden="true">·</span>}
          {article.date && <span>{formatAbsoluteDate(article.date)}</span>}
        </div>

        {!compact && article.tags && article.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {article.tags.slice(0, featured ? 4 : 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--bg-tertiary)] px-2.5 py-1 text-[11px] text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
