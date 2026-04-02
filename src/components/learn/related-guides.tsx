import { GuideCard } from "@/components/learn/guide-card";

export function RelatedGuides({
  guides,
}: {
  guides: Array<{
    title: string;
    href: string;
    excerpt: string;
    category: string;
    readingTime: number;
  }>;
}) {
  if (guides.length === 0) return null;

  return (
    <section className="mt-14">
      <span className="eyebrow">Related guides</span>
      <h2 className="section-heading mt-3">Keep exploring the research context</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {guides.map((guide) => (
          <GuideCard
            key={guide.href}
            title={guide.title}
            href={guide.href}
            excerpt={guide.excerpt}
            category={guide.category}
            readingTime={guide.readingTime}
          />
        ))}
      </div>
    </section>
  );
}
