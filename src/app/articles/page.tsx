import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { ArticleCard } from "@/components/articles/article-card";

export const metadata: Metadata = {
  title: "Articles | Peptide Daily",
  description:
    "Original investigative reporting, buyer education, and technical guides on the peptide industry. Independent, unaffiliated analysis.",
};

export const dynamic = "force-dynamic";

const CATEGORY_TABS = [
  { key: "all", label: "All" },
  { key: "investigation", label: "Investigations" },
  { key: "education", label: "Education" },
  { key: "technical", label: "Technical" },
  { key: "market", label: "Market Intel" },
] as const;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const category =
    typeof params.category === "string" &&
    ["investigation", "education", "technical", "market"].includes(params.category)
      ? params.category
      : null;

  const where: Record<string, unknown> = { isPublished: true };
  if (category) where.category = category;

  const articles = await prisma.article.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: 24,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      authorName: true,
      readingTime: true,
      publishedAt: true,
      tags: true,
    },
  });

  return (
    <div className="section-spacing">
      <div className="container-page">
        <span className="eyebrow">Articles</span>
        <h1 className="section-heading mt-4">Research, analysis & buyer education</h1>
        <p className="section-subheading">
          Independent reporting on the peptide industry — investigations, technical
          deep-dives, and practical buyer guides. No sponsored content.
        </p>

        {/* Category tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => {
            const active = category === tab.key || (!category && tab.key === "all");
            const href = tab.key === "all" ? "/articles" : `/articles?category=${tab.key}`;
            return (
              <Link
                key={tab.key}
                href={href}
                className="rounded-full border px-4 py-2 text-sm transition-colors"
                style={{
                  borderColor: active ? "var(--accent-border)" : "var(--border-default)",
                  background: active ? "var(--accent-subtle)" : "var(--bg-secondary)",
                  color: active ? "var(--accent-primary)" : "var(--text-secondary)",
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Article grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {articles.length === 0 && (
          <div className="mt-10 rounded-[1.75rem] border border-dashed border-[var(--border-default)] px-6 py-14 text-center">
            <p className="font-[var(--font-newsreader)] text-2xl text-[var(--text-primary)]">
              Articles coming soon
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm text-[var(--text-secondary)]">
              Our editorial team is working on original investigations and guides.
              Check back soon or subscribe to our newsletter for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
