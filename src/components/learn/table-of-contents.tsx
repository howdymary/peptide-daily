"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface TocItem {
  id: string;
  label: string;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(item.id);
        },
        {
          rootMargin: "-20% 0px -60% 0px",
          threshold: 0.1,
        },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [items]);

  return (
    <nav className="sticky top-24 hidden xl:block">
      <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
        On this page
      </p>
      <div className="mt-4 space-y-3 border-l border-[var(--border-default)] pl-4">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "block text-sm transition-colors",
              activeId === item.id
                ? "text-[var(--accent-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
