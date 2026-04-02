import { ArticleCard, type EditorialArticle } from "@/components/primitives/article-card";

export function FeaturedArticle({ article }: { article: EditorialArticle | null }) {
  if (!article) return null;

  return <ArticleCard article={article} variant="featured" className="h-full" />;
}
