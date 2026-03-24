import { prisma } from "@/lib/db/prisma";
import { NewsFeed } from "@/components/home/news-feed";
import type { ArticleCardData } from "@/components/home/article-card";

export const metadata = {
  title: "Peptide News & FDA Regulatory Updates — Today | Peptide Daily",
  description:
    "Track FDA enforcement actions, clinical trial results, and peptide industry news. Updated daily so you never miss a change.",
};

export const revalidate = 300;

async function getNewsData() {
  const articles = await prisma.newsArticle.findMany({
    where: { isHidden: false },
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    take: 50,
    include: {
      source: { select: { name: true, slug: true, siteUrl: true } },
    },
  });

  return articles.map(
    (a): ArticleCardData => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      sourceUrl: a.sourceUrl,
      excerpt: a.excerpt,
      author: a.author,
      publishedAt: a.publishedAt.toISOString(),
      tags: a.tags,
      isEditorsPick: a.isEditorsPick,
      source: a.source,
    }),
  );
}

export default async function NewsPage() {
  const articles = await getNewsData();
  const allTags = [...new Set(articles.flatMap((a) => a.tags))].sort();

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          News
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Peptide research, FDA updates, and industry news from trusted sources.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] py-16 text-center">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No news articles yet. Articles will appear here once the news ingestion pipeline runs.
          </p>
        </div>
      ) : (
        <NewsFeed articles={articles} allTags={allTags} />
      )}
    </div>
  );
}
