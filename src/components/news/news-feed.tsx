import { ArticleCard, type EditorialArticle } from "@/components/primitives/article-card";

export function NewsFeed({ articles }: { articles: EditorialArticle[] }) {
  return (
    <div className="grid gap-5">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant="standard" />
      ))}
    </div>
  );
}
