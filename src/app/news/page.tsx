import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { FeaturedArticle } from "@/components/news/featured-article";
import { NewsFeed } from "@/components/news/news-feed";
import { NewsFilters } from "@/components/news/news-filters";
import { SourceBadge } from "@/components/primitives/source-badge";
import { formatRelativeTime } from "@/lib/presentation";

export const metadata: Metadata = {
  title: "Peptide research and regulatory news",
  description:
    "A cleaner, source-first news feed for peptide research, FDA actions, and clinical developments. Built to feel current without feeling noisy.",
};

function getPrimaryCategory(tags: string[]) {
  return tags[0] ?? "Research";
}

async function getNewsListing() {
  const articles = await prisma.newsArticle.findMany({
    where: { isHidden: false },
    orderBy: [{ isEditorsPick: "desc" }, { publishedAt: "desc" }],
    take: 30,
    include: {
      source: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    sourceUrl: article.sourceUrl,
    summary: article.excerpt,
    category: getPrimaryCategory(article.tags),
    date: article.publishedAt,
    source: article.source.name,
    sourceSlug: article.source.slug,
    tags: article.tags,
    featuredLabel: article.isEditorsPick ? "Editor's pick" : null,
  }));
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const activeCategory =
    typeof params.category === "string" ? params.category : "all";
  const activeSource = typeof params.source === "string" ? params.source : "all";

  const articles = await getNewsListing();
  const categories = [...new Set(articles.map((article) => article.category).filter(Boolean))].sort();
  const sources = [
    { label: "All sources", value: "all" },
    ...[...new Map(articles.map((article) => [article.sourceSlug, { label: article.source ?? article.sourceSlug, value: article.sourceSlug }])).values()],
  ];

  const filtered = articles.filter((article) => {
    if (activeCategory !== "all" && article.category !== activeCategory) return false;
    if (activeSource !== "all" && article.sourceSlug !== activeSource) return false;
    return true;
  });

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);
  const tagCounts = [...new Map(
    filtered
      .flatMap((article) => article.tags)
      .map((tag) => [tag, filtered.filter((article) => article.tags.includes(tag)).length]),
  ).entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="section-spacing">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="eyebrow">Research desk</span>
          <h1 className="section-heading mt-4">A peptide news feed that treats sources with respect</h1>
          <p className="section-subheading">
            We keep the stream editorial and source-first: regulatory updates, clinical
            developments, and research headlines, without mixing them into sales-y ticker copy.
          </p>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
          <NewsFilters
            categories={categories}
            sources={sources}
            activeCategory={activeCategory}
            activeSource={activeSource}
          />
        </div>

        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_340px]">
            <div>
              <FeaturedArticle article={featured} />
              {rest.length > 0 && (
                <div className="mt-6">
                  <NewsFeed articles={rest} />
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div className="surface-card rounded-[1.75rem] p-6">
                <p className="eyebrow">Freshness</p>
                <h2 className="mt-4 font-[var(--font-newsreader)] text-3xl text-[var(--text-primary)]">
                  Latest publish window
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  The newest article in this filtered view landed{" "}
                  <span className="font-mono text-[var(--text-primary)]">
                    {featured ? formatRelativeTime(featured.date) : "recently"}
                  </span>.
                </p>
                {featured?.source && (
                  <div className="mt-4">
                    <SourceBadge source={featured.source} />
                  </div>
                )}
              </div>

              <div className="surface-card rounded-[1.75rem] p-6">
                <p className="eyebrow">Topics</p>
                <h2 className="mt-4 font-[var(--font-newsreader)] text-3xl text-[var(--text-primary)]">
                  Frequently mentioned
                </h2>
                <div className="mt-5 space-y-3">
                  {tagCounts.map(([tag, count]) => (
                    <div key={tag} className="flex items-center justify-between gap-3 border-b border-[var(--border-default)] pb-3 last:border-b-0 last:pb-0">
                      <span className="text-sm text-[var(--text-primary)]">{tag}</span>
                      <span className="font-mono text-sm text-[var(--text-secondary)]">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-card rounded-[1.75rem] p-6">
                <p className="eyebrow">Editorial policy</p>
                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                  Articles link out to their original publishers. Peptide Daily surfaces
                  summaries and provenance rather than re-hosting full copyrighted content.
                </p>
              </div>
            </aside>
          </div>
        ) : (
          <div className="mt-10 rounded-[1.75rem] border border-dashed border-[var(--border-default)] px-6 py-14 text-center">
            <p className="font-[var(--font-newsreader)] text-3xl text-[var(--text-primary)]">
              No articles match that view
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
              Try broadening the category or source filter. We keep hidden items out of this
              feed instead of filling it with stale placeholders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
