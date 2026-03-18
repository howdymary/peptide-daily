import type { Metadata } from "next";

const SITE_NAME = "Peptide Daily";
const SITE_URL = "https://peptidedaily.com";

// ── Per-route SEO configuration ─────────────────────────────────────────────

export interface PageSEO {
  title: string;
  description: string;
  canonical?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
}

export const seoConfig: Record<string, PageSEO> = {
  "/": {
    title: "Peptide Daily \u2014 Prices, Reviews & Research News",
    description:
      "Compare peptide prices, read lab-tested vendor reviews, and stay current on regulatory news. Independent, evidence-based.",
    canonical: SITE_URL,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Independent peptide price comparison with third-party lab data, community reviews, and educational guides.",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/peptides?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  },

  "/peptides": {
    title: "Peptide Price Comparison \u2014 50+ Compounds, Live Data",
    description:
      "Compare live peptide prices across vendors with lab grades, reviews, and category filters. Updated every 15 minutes.",
    canonical: `${SITE_URL}/peptides`,
  },

  "/learn": {
    title: "Learn About Peptides \u2014 Education Hub | Peptide Daily",
    description:
      "Educational overviews, beginner guides, and safety references for 15+ peptides. Clinical context, peer-reviewed references, and regulatory status.",
    canonical: `${SITE_URL}/learn`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Are peptides safe?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Safety varies significantly by compound and regulatory status. Some peptides like semaglutide are FDA-approved prescription medications. Others are investigational or research-only compounds without approval for human use. Always consult a healthcare provider.",
          },
        },
        {
          "@type": "Question",
          name: "What does a Finnrick lab grade mean?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Finnrick independently tests vendor peptides for purity, quantity accuracy, and identity. Grades range from A (highest quality) to E, based on aggregate test results across multiple samples.",
          },
        },
        {
          "@type": "Question",
          name: "How are peptide prices compared on Peptide Daily?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Peptide Daily scrapes vendor websites automatically every 15 minutes. Prices are shown per package with concentration details so you can compare equivalent products across vendors.",
          },
        },
      ],
    },
  },

  "/learn/guide": {
    title: "Peptide Beginner Guide \u2014 Myths, Safety, Legality",
    description:
      "The most thorough beginner-friendly overview of peptides online. Myths vs facts, US legality, lab handling basics, and vendor comparison tools.",
    canonical: `${SITE_URL}/learn/guide`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline:
        "Beginner's Guide to Peptides: What They Are, How They're Handled, and What to Know First",
      description:
        "A comprehensive, evidence-based educational guide for people new to peptides. Covers definitions, myths, legal realities, lab handling, and how to evaluate vendors.",
      author: {
        "@type": "Organization",
        name: "Peptide Daily",
        url: SITE_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "Peptide Daily",
        url: SITE_URL,
      },
      mainEntityOfPage: `${SITE_URL}/learn/guide`,
    },
  },

  "/vendors": {
    title: "Peptide Vendor Reviews \u2014 Lab-Tested Quality Rankings",
    description:
      "Read independent peptide vendor reviews backed by Finnrick lab testing. Compare quality, pricing, and community ratings.",
    canonical: `${SITE_URL}/vendors`,
  },

  "/news": {
    title: "Peptide News & FDA Regulatory Updates \u2014 Today",
    description:
      "Track FDA enforcement actions, clinical trial results, and peptide industry news. Updated daily so you never miss a change.",
    canonical: `${SITE_URL}/news`,
  },

  "/peptides/weight-loss": {
    title:
      "Peptides for Weight Loss: Pricing, Lab Data, and What the Research Says",
    description:
      "Compare peptides commonly studied for weight management. Vendor prices, Finnrick lab grades, and community reviews.",
    canonical: `${SITE_URL}/peptides/weight-loss`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Are peptides for weight loss FDA-approved?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Some are. Semaglutide (Wegovy/Ozempic) and tirzepatide (Mounjaro/Zepbound) are FDA-approved GLP-1 receptor agonists prescribed for weight management. Many other peptides marketed for weight loss are not approved for human use.",
          },
        },
        {
          "@type": "Question",
          name: "How do peptide prices for weight loss vary across vendors?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Prices for research-grade peptides can vary significantly between vendors. Peptide Daily tracks live pricing across multiple suppliers so you can compare cost alongside lab quality data.",
          },
        },
      ],
    },
  },

  "/peptides/skin-beauty": {
    title: "Peptides for Skin, Beauty, and Anti-Aging: Prices and Research",
    description:
      "Explore peptides studied for skin health. Compare vendor pricing, lab quality data, and user reviews.",
    canonical: `${SITE_URL}/peptides/skin-beauty`,
  },

  "/peptides/pain-recovery": {
    title:
      "Peptides for Chronic Pain, Injury, and Recovery: Data and Pricing",
    description:
      "Research peptides studied for tissue repair. Compare vendor prices, lab purity data, and community experiences.",
    canonical: `${SITE_URL}/peptides/pain-recovery`,
  },

  "/peptides/muscle-growth": {
    title:
      "Peptides for Muscle Growth and Workout Recovery: Prices and Lab Data",
    description:
      "Compare growth hormone secretagogues. Vendor prices, Finnrick lab grades, and reviews.",
    canonical: `${SITE_URL}/peptides/muscle-growth`,
  },

  "/peptides/safety": {
    title:
      "Peptide Safety, Side Effects, and Regulations: What You Need to Know",
    description:
      "Understand peptide safety, common side effects, FDA regulatory status, and how to evaluate vendor quality using third-party lab data.",
    canonical: `${SITE_URL}/peptides/safety`,
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Build Next.js Metadata from seoConfig entry */
export function buildMetadata(path: string): Metadata {
  const config = seoConfig[path];
  if (!config) return {};

  return {
    title: config.title,
    description: config.description,
    alternates: config.canonical ? { canonical: config.canonical } : undefined,
    robots: config.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: config.title,
      description: config.description,
      siteName: SITE_NAME,
      type: "website",
      url: config.canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
    },
  };
}

/** Build a dynamic title for peptide detail pages */
export function buildPeptideDetailMeta(peptide: {
  name: string;
  slug: string;
  category?: string;
  description?: string;
}): Metadata {
  const title = `${peptide.name}: Vendor Prices, Lab Grades, Reviews, and Safety`;
  const description =
    peptide.description ||
    `Compare ${peptide.name} prices across vendors. See Finnrick lab grades, community reviews, and safety considerations.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/peptides/${peptide.slug}` },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
