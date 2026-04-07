/**
 * Defines which peptide fields are comparable and how to display them.
 */

export interface CompareField {
  key: string;
  label: string;
  /** How to extract the value from a peptide record */
  extract: (peptide: ComparablePeptide) => string | null;
}

export interface ComparablePeptide {
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  molecularWeight: number | null;
  halfLife: string | null;
  administrationRoute: string | null;
  regulatoryStatus: string | null;
  goalTags: string[];
  aliases: string[];
  mechanismOfAction: string | null;
  bestPrice: number | null;
  bestPriceVendor: string | null;
  vendorCount: number;
  bestFinnrickGrade: string | null;
  averageRating: number | null;
  reviewCount: number;
}

const REGULATORY_LABELS: Record<string, string> = {
  "fda-approved": "FDA Approved",
  investigational: "Investigational",
  "research-chemical": "Research Chemical",
  compounded: "Compounded",
  "approved-intl": "Approved (International)",
};

const CATEGORY_LABELS: Record<string, string> = {
  metabolic: "Metabolic & GLP-1",
  "growth-hormone": "Growth Hormone",
  "tissue-repair": "Tissue Repair",
  melanocortin: "Melanocortin",
  neuroprotective: "Neuroprotective",
  cosmetic: "Cosmetic & Dermal",
  "immune-modulating": "Immune Modulation",
  longevity: "Longevity",
  antimicrobial: "Antimicrobial",
  sleep: "Sleep & Recovery",
  gastrointestinal: "Gastrointestinal",
};

export const COMPARE_FIELDS: CompareField[] = [
  {
    key: "category",
    label: "Category",
    extract: (p) => (p.category ? CATEGORY_LABELS[p.category] ?? p.category : null),
  },
  {
    key: "regulatoryStatus",
    label: "Regulatory Status",
    extract: (p) =>
      p.regulatoryStatus ? REGULATORY_LABELS[p.regulatoryStatus] ?? p.regulatoryStatus : null,
  },
  {
    key: "mechanismOfAction",
    label: "Mechanism",
    extract: (p) => p.mechanismOfAction,
  },
  {
    key: "halfLife",
    label: "Half-Life",
    extract: (p) => p.halfLife,
  },
  {
    key: "administrationRoute",
    label: "Administration",
    extract: (p) => p.administrationRoute,
  },
  {
    key: "molecularWeight",
    label: "Molecular Weight",
    extract: (p) => (p.molecularWeight ? `${p.molecularWeight.toLocaleString()} Da` : null),
  },
  {
    key: "goalTags",
    label: "Research Areas",
    extract: (p) => (p.goalTags.length > 0 ? p.goalTags.join(", ") : null),
  },
  {
    key: "aliases",
    label: "Also Known As",
    extract: (p) => (p.aliases.length > 0 ? p.aliases.join(", ") : null),
  },
  {
    key: "bestPrice",
    label: "Best Price",
    extract: (p) =>
      p.bestPrice != null
        ? `$${p.bestPrice.toFixed(2)}${p.bestPriceVendor ? ` (${p.bestPriceVendor})` : ""}`
        : null,
  },
  {
    key: "vendorCount",
    label: "Available From",
    extract: (p) => (p.vendorCount > 0 ? `${p.vendorCount} vendor${p.vendorCount !== 1 ? "s" : ""}` : null),
  },
  {
    key: "bestFinnrickGrade",
    label: "Best Lab Grade",
    extract: (p) => p.bestFinnrickGrade,
  },
  {
    key: "averageRating",
    label: "User Rating",
    extract: (p) =>
      p.averageRating != null
        ? `${p.averageRating.toFixed(1)} / 5 (${p.reviewCount} review${p.reviewCount !== 1 ? "s" : ""})`
        : null,
  },
];
