import Link from "next/link";
import { CategoryPill } from "@/components/primitives/category-pill";

export function GuideCard({
  title,
  href,
  excerpt,
  category,
  readingTime,
}: {
  title: string;
  href: string;
  excerpt: string;
  category: string;
  readingTime: number;
}) {
  return (
    <Link href={href} className="surface-card hover-lift flex h-full flex-col rounded-[1.75rem] p-6">
      <CategoryPill category={category} />
      <h3 className="mt-5 font-[var(--font-newsreader)] text-[1.95rem] leading-tight text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="mt-4 flex-1 text-sm leading-7 text-[var(--text-secondary)]">{excerpt}</p>
      <div className="mt-6 flex items-center justify-between gap-3 text-sm text-[var(--text-secondary)]">
        <span>{readingTime} min read</span>
        <span className="text-[var(--accent-primary)]">Read guide →</span>
      </div>
    </Link>
  );
}
