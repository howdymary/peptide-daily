const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://peptidedaily.com";

interface ArticleSchemaProps {
  title: string;
  slug: string;
  excerpt: string;
  authorName: string;
  publishedAt: Date | null;
  updatedAt: Date;
}

export function ArticleSchema({
  title,
  slug,
  excerpt,
  authorName,
  publishedAt,
  updatedAt,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt.slice(0, 160),
    url: `${SITE_URL}/articles/${slug}`,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Peptide Daily",
      url: SITE_URL,
    },
    datePublished: publishedAt?.toISOString() ?? updatedAt.toISOString(),
    dateModified: updatedAt.toISOString(),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
