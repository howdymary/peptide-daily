import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";
import { ArticleSchema } from "@/components/seo/article-schema";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });
  if (!article) return { title: "Article not found" };
  return {
    title: `${article.title} | Peptide Daily`,
    description: article.excerpt.slice(0, 160),
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug, isPublished: true },
  });

  if (!article) notFound();

  return (
    <div className="section-spacing">
      <ArticleSchema
        title={article.title}
        slug={article.slug}
        excerpt={article.excerpt}
        authorName={article.authorName}
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
      />
      <article className="container-page max-w-3xl">
        <nav className="mb-6 text-sm text-[var(--text-tertiary)]" aria-label="Breadcrumb">
          <Link href="/articles" className="hover:text-[var(--accent-primary)]">
            Articles
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--text-secondary)]">{article.category}</span>
        </nav>

        {/* Header */}
        <header>
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
            style={{ background: "var(--accent-primary)" }}
          >
            {article.category}
          </span>

          <h1 className="mt-4 font-[var(--font-newsreader)] text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl">
            {article.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--text-tertiary)]">
            <span>By {article.authorName}</span>
            {article.publishedAt && (
              <>
                <span aria-hidden="true">&middot;</span>
                <time dateTime={article.publishedAt.toISOString()}>
                  {article.publishedAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </>
            )}
            <span aria-hidden="true">&middot;</span>
            <span>{article.readingTime} min read</span>
          </div>

          {article.authorBio && (
            <p className="mt-3 text-sm italic text-[var(--text-tertiary)]">{article.authorBio}</p>
          )}
        </header>

        {/* Body — rendered as HTML from MDX (simple prose rendering) */}
        <div
          className="prose-pd mt-8"
          dangerouslySetInnerHTML={{ __html: renderSimpleMdx(article.bodyMdx) }}
        />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/articles?tag=${encodeURIComponent(tag)}`}
                className="rounded-md bg-[var(--bg-tertiary)] px-2.5 py-1 text-xs text-[var(--text-tertiary)] hover:text-[var(--accent-primary)]"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <MedicalDisclaimer variant="callout" className="mt-10" />
      </article>
    </div>
  );
}

/**
 * Minimal MDX-to-HTML renderer for article body content.
 * Handles basic markdown: headings, paragraphs, bold, italic, links, lists, code.
 * For production, swap with next-mdx-remote for full MDX component support.
 */
function renderSimpleMdx(mdx: string): string {
  return mdx
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      // Headings
      if (trimmed.startsWith("### ")) return `<h3>${inline(trimmed.slice(4))}</h3>`;
      if (trimmed.startsWith("## ")) return `<h2>${inline(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith("# ")) return `<h1>${inline(trimmed.slice(2))}</h1>`;

      // Unordered list
      if (trimmed.startsWith("- ")) {
        const items = trimmed
          .split("\n")
          .filter((l) => l.startsWith("- "))
          .map((l) => `<li>${inline(l.slice(2))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      // Ordered list
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed
          .split("\n")
          .filter((l) => /^\d+\.\s/.test(l))
          .map((l) => `<li>${inline(l.replace(/^\d+\.\s/, ""))}</li>`)
          .join("");
        return `<ol>${items}</ol>`;
      }

      // Blockquote
      if (trimmed.startsWith("> ")) {
        const content = trimmed
          .split("\n")
          .map((l) => l.replace(/^>\s?/, ""))
          .join(" ");
        return `<blockquote><p>${inline(content)}</p></blockquote>`;
      }

      // Default: paragraph
      return `<p>${inline(trimmed)}</p>`;
    })
    .join("\n");
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}
