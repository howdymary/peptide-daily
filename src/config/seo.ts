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
          title: "Peptide Daily — Independent Peptide Prices, Lab Data, and Reviews",
          description:
                  "Compare peptide prices across vendors with third-party lab testing from Finnrick. Evidence-based quality ratings, community reviews, and real-time pricing for 50+ compounds.",
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
          title: "Peptide Catalog — Compare Prices, Lab Grades, and Reviews",
          description:
                  "Browse 50+ peptides with live vendor pricing, Finnrick lab grades, and community reviews. Filter by category, price, and lab quality.",
          canonical: `${SITE_URL}/peptides`,
    },

    "/learn": {
          title: "Peptide Education Hub — Research-Led Guides and Reference",
          description:
                  "Educational overviews of 15+ key peptides — from FDA-approved medications to investigational compounds. Clinical context, peer-reviewed references, and regulatory status.",
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

    "/vendors": {
          title: "Peptide Vendor Rankings — Lab-Tested Quality and Pricing",
          description:
                  "Compare peptide vendors by Finnrick lab grade, pricing, and community reviews. See which suppliers have the best third-party testing results.",
          canonical: `${SITE_URL}/vendors`,
    },

    "/peptides/weight-loss": {
          title:
                  "Peptides for Weight Loss: Pricing, Lab Data, and What the Research Says",
          description:
                  "Compare peptides commonly studied for weight management — including semaglutide, tirzepatide, and tesamorelin. Vendor prices, Finnrick lab grades, and community reviews.",
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
                  "Explore peptides studied for skin health — including GHK-Cu and copper peptides. Compare vendor pricing, lab quality data, and user reviews.",
          canonical: `${SITE_URL}/peptides/skin-beauty`,
    },

    "/peptides/pain-recovery": {
          title:
                  "Peptides for Chronic Pain, Injury, and Recovery: Data and Pricing",
          description:
                  "Research peptides studied for tissue repair — including BPC-157 and TB-500. Compare vendor prices, lab purity data, and community experiences.",
          canonical: `${SITE_URL}/peptides/pain-recovery`,
    },

    "/peptides/muscle-growth": {
          title:
                  "Peptides for Muscle Growth and Workout Recovery: Prices and Lab Data",
          description:
                  "Compare growth hormone secretagogues — including ipamorelin, CJC-1295, and GHRP-6. Vendor prices, Finnrick lab grades, and reviews.",
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
  };
}
