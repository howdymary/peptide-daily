import type { Metadata } from "next";
import { GuideCard } from "@/components/learn/guide-card";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";
import {
  CATEGORY_LABELS,
  PEPTIDES,
  REGULATORY_LABELS,
} from "@/lib/learn/peptide-data";

export const metadata: Metadata = {
  title: "Research guides and educational explainers",
  description:
    "Evidence-led guides to peptide research, safety, vendor evaluation, and regulatory context, written with an editorial reading experience instead of a generic content grid.",
};

function estimateReadTime(text: string) {
  return Math.max(4, Math.round(text.split(/\s+/).length / 180));
}

const START_HERE = [
  {
    title: "How to evaluate a peptide vendor",
    href: "/vendors",
    excerpt:
      "Use vendor profiles, Finnrick grades, and testing depth to compare suppliers without relying on affiliate-style hype.",
    category: "Research",
    readingTime: 5,
  },
  {
    title: "How Peptide Daily scores trust",
    href: "/about",
    excerpt:
      "See how lab quality, evidence depth, and recency feed into the site’s visible trust signals and methodology.",
    category: "Regulatory",
    readingTime: 4,
  },
  {
    title: "Why research news matters",
    href: "/news",
    excerpt:
      "Follow regulatory shifts, published studies, and clinical programs so the pricing layer sits inside real scientific context.",
    category: "Research",
    readingTime: 4,
  },
];

export default function LearnPage() {
  const grouped = Object.entries(
    PEPTIDES.reduce<Record<string, typeof PEPTIDES>>((acc, peptide) => {
      const key = peptide.category;
      acc[key] ??= [];
      acc[key].push(peptide);
      return acc;
    }, {}),
  );

  return (
    <div className="section-spacing">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="eyebrow">Research guides</span>
          <h1 className="section-heading mt-4">Editorial explainers for a skeptical audience</h1>
          <p className="section-subheading">
            The learn section is where Peptide Daily earns trust: not through volume, but
            through clean typography, cited context, and clear signals about what is approved,
            investigational, or still firmly in research territory.
          </p>
        </div>

        <section className="mt-12">
          <span className="eyebrow">Start here</span>
          <h2 className="section-heading mt-3">Core guides for navigating the platform</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {START_HERE.map((guide) => (
              <GuideCard key={guide.href} {...guide} />
            ))}
          </div>
        </section>

        {grouped.map(([category, peptides]) => (
          <section key={category} className="mt-16">
            <span className="eyebrow">{CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}</span>
            <h2 className="section-heading mt-3">
              {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]} guides
            </h2>
            <p className="section-subheading">
              Each guide keeps the same editorial frame: what the peptide is, how the
              evidence base looks, and what the regulatory context does and does not allow.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {peptides.map((peptide) => (
                <GuideCard
                  key={peptide.slug}
                  title={peptide.name}
                  href={`/learn/${peptide.slug}`}
                  excerpt={`${peptide.shortSummary} ${REGULATORY_LABELS[peptide.regulatoryStatus]}.`}
                  category={CATEGORY_LABELS[peptide.category]}
                  readingTime={estimateReadTime(
                    [...peptide.overview, ...peptide.researchContext, ...peptide.safetyNotes].join(" "),
                  )}
                />
              ))}
            </div>
          </section>
        ))}

        <MedicalDisclaimer variant="callout" className="mt-16" />
      </div>
    </div>
  );
}
