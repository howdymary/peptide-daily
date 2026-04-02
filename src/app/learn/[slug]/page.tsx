import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterSignup } from "@/components/marketing/newsletter-signup";
import { ArticleLayout } from "@/components/learn/article-layout";
import { RelatedGuides } from "@/components/learn/related-guides";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";
import { CategoryPill } from "@/components/primitives/category-pill";
import {
  CATEGORY_LABELS,
  PEPTIDES,
  REGULATORY_LABELS,
  getPeptideBySlug,
} from "@/lib/learn/peptide-data";

export function generateStaticParams() {
  return PEPTIDES.map((peptide) => ({ slug: peptide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);

  if (!peptide) return {};

  return {
    title: peptide.seoTitle,
    description: peptide.metaDescription,
  };
}

function estimateReadTime(slug: string) {
  const peptide = getPeptideBySlug(slug);
  if (!peptide) return 5;
  return Math.max(
    4,
    Math.round(
      [...peptide.overview, ...peptide.researchContext, ...peptide.safetyNotes]
        .join(" ")
        .split(/\s+/).length / 190,
    ),
  );
}

export default async function LearnDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);

  if (!peptide) {
    notFound();
  }

  const toc = [
    { id: "overview", label: "Overview" },
    { id: "research-context", label: "Research context" },
    { id: "safety", label: "Safety and regulation" },
    { id: "references", label: "References" },
  ];

  const related = peptide.seeAlso
    .map((item) => getPeptideBySlug(item.slug))
    .filter(Boolean)
    .slice(0, 3)
    .map((item) => ({
      title: item!.name,
      href: `/learn/${item!.slug}`,
      excerpt: item!.shortSummary,
      category: CATEGORY_LABELS[item!.category],
      readingTime: estimateReadTime(item!.slug),
    }));

  return (
    <div className="section-spacing">
      <ArticleLayout toc={toc}>
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Link href="/learn" className="hover:text-[var(--text-primary)]">
            Learn
          </Link>
          <span aria-hidden="true">·</span>
          <span>{peptide.name}</span>
        </nav>

        <header className="border-b border-[var(--border-default)] pb-10">
          <CategoryPill category={CATEGORY_LABELS[peptide.category]} />
          <h1 className="mt-5 font-[var(--font-newsreader)] text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.96] text-[var(--text-primary)]">
            {peptide.name}
          </h1>
          {peptide.altName && (
            <p className="mt-3 text-base text-[var(--text-secondary)]">{peptide.altName}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
            <span>{REGULATORY_LABELS[peptide.regulatoryStatus]}</span>
            <span aria-hidden="true">·</span>
            <span>{estimateReadTime(peptide.slug)} min read</span>
            <span aria-hidden="true">·</span>
            <span>{peptide.references.length} cited sources</span>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            {peptide.shortSummary}
          </p>
        </header>

        <article className="prose-clinical mt-10">
          <section id="overview">
            <h2>Overview</h2>
            {peptide.overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section id="research-context">
            <h2>Research context</h2>
            {peptide.researchContext.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section id="safety">
            <h2>Safety and regulatory framing</h2>
            <blockquote>{peptide.statusNote}</blockquote>
            {peptide.safetyNotes.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section id="references">
            <h2>References</h2>
            <ol>
              {peptide.references.map((reference) => (
                <li key={reference.number}>
                  <a href={reference.url} target="_blank" rel="noopener noreferrer">
                    {reference.title} ↗
                  </a>
                  <div>{reference.journal}</div>
                </li>
              ))}
            </ol>
          </section>
        </article>

        <MedicalDisclaimer variant="callout" className="mt-12" />

        <div className="mt-12 rounded-[1.75rem] border border-[var(--border-default)] bg-[var(--bg-secondary)] p-6">
          <span className="eyebrow">Stay current</span>
          <h2 className="mt-4 font-[var(--font-newsreader)] text-3xl text-[var(--text-primary)]">
            New regulatory shifts matter as much as the peptide itself
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
            Subscribe for editorial updates when major price moves, lab tests, or regulatory
            events affect the compounds you&apos;re tracking.
          </p>
          <div className="mt-6 max-w-xl">
            <NewsletterSignup variant="inline" />
          </div>
        </div>

        <RelatedGuides guides={related} />
      </ArticleLayout>
    </div>
  );
}
