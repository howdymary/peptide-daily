"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const article = document.getElementById("article-body");
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const total = Math.max(article.offsetHeight - window.innerHeight, 1);
      const consumed = Math.min(Math.max(-rect.top, 0), total);
      setProgress((consumed / total) * 100);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-40 h-1 bg-transparent">
      <div
        className="h-full bg-[var(--accent-primary)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
