import Link from "next/link";
import { ArticleCard, type EditorialArticle } from "@/components/primitives/article-card";

export function EditorialPicks({
  featured,
  articles,
  categories,
}: {
  featured: EditorialArticle | null;
  articles: EditorialArticle[];
  categories: string[];
}) {
  return (
    <section className="section-spacing">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="eyebrow">Editorial desk</span>
          <h2 className="section-heading mt-4">Latest research</h2>
          <p className="section-subheading">
            The most relevant peptide research, regulatory movement, and clinical context from
            primary sources.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["All", ...categories.slice(0, 5)].map((category) => (
            <span
              key={category}
              className="rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]"
              style={{ borderColor: "var(--border-default)" }}
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
          {featured && <ArticleCard article={featured} variant="featured" />}
          <div className="grid gap-5">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Link href="/news" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)]">
            All research news <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
