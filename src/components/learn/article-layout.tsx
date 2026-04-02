import type { ReactNode } from "react";
import { TableOfContents } from "@/components/learn/table-of-contents";
import { ReadingProgress } from "@/components/learn/reading-progress";

export function ArticleLayout({
  toc,
  children,
}: {
  toc: Array<{ id: string; label: string }>;
  children: ReactNode;
}) {
  return (
    <>
      <ReadingProgress />
      <div className="container-page grid gap-10 xl:grid-cols-[220px_minmax(0,680px)_1fr]">
        <TableOfContents items={toc} />
        <main id="article-body" className="min-w-0">
          {children}
        </main>
        <div className="hidden xl:block" />
      </div>
    </>
  );
}
