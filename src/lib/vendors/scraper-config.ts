/**
 * Per-vendor scraping configuration — source registry.
 *
 * This is the single source of truth for all vendor data sources.
 * Each entry describes:
 *  - Display name, base URL, vendor type, and status flag
 *  - CSS selectors for HTML parsing (class-based for resilience)
 *  - Rate-limit budget (max requests per minute — be a good citizen)
 *  - Notes on special parsing requirements or known limitations
 *
 * TECH_NOTES — How price sources are configured and monitored:
 *  1. Add an entry here with scrapingEnabled: true/false.
 *  2. Create a fetcher class in /lib/vendors/<slug>.ts extending BaseFetcher.
 *  3. Register it in registry.ts.
 *  4. Seed a Vendor + VendorMapping row in prisma/seed.ts.
 *  5. Health metrics (lastScrapedAt, activeProducts, errorCount) are updated
 *     by the aggregator after each run and visible in the admin dashboard.
 *
 * Status flags:
 *  "active"      — automated scraping is running
 *  "paused"      — temporarily disabled (rate-limit or maintenance)
 *  "manual-only" — JS-rendered site; import via CSV/admin upload
 *  "js-required" — needs Playwright/Puppeteer adapter (planned)
 *  "disabled"    — permanently excluded (TOS concern or defunct)
 *
 * Vendor types:
 *  "research"     — research-use-only peptides
 *  "cosmetic"     — topical / cosmetic peptide products
 *  "pharmaceutical" — compounding pharmacy / licensed dispensary
 *  "catalog"      — broad life-science chemical catalog
 */

export type VendorStatus = "active" | "paused" | "manual-only" | "js-required" | "disabled";
export type VendorType = "research" | "cosmetic" | "pharmaceutical" | "catalog";

export interface ScraperConfig {
  vendorName: string;
  baseUrl: string;
  productListUrl: string;
  /** Vendor category — used for display and filtering */
  vendorType: VendorType;
  /** Operational status of this source */
  status: VendorStatus;
  /** Max HTTP requests per minute (conservative — be a good citizen) */
  rateLimit: number;
  /** Whether automated scraping is enabled for this vendor */
  scrapingEnabled: boolean;
  /** Reason scraping is disabled, if applicable */
  disabledReason?: string;
  /** Free-text notes about parsing quirks or compliance requirements */
  notes?: string;
  selectors: {
    productContainer: string;
    name: string;
    price: string;
    concentration: string;
    availability: string;
    productLink: string;
  };
}

export const scraperConfigs: Record<string, ScraperConfig> = {
  // ── Currently active scrapers ────────────────────────────────────────────

  "paradigm-peptide": {
    vendorName: "Paradigm Peptide",
    baseUrl: "https://paradigmpeptide.com",
    productListUrl: "https://paradigmpeptide.com/research-peptides",
    vendorType: "research",
    status: "active",
    rateLimit: 6,
    scrapingEnabled: true,
    notes: "WooCommerce storefront; static HTML. Selectors verified 2025-Q4.",
    selectors: {
      productContainer: ".product-item",
      name: ".product-title",
      price: ".price",
      concentration: ".product-title",
      availability: ".stock-status",
      productLink: "a.product-link",
    },
  },

  "polaris-peptides": {
    vendorName: "Polaris Peptides",
    baseUrl: "https://polarispeptides.com",
    productListUrl: "https://polarispeptides.com/collections/peptides",
    vendorType: "research",
    status: "active",
    rateLimit: 6,
    scrapingEnabled: true,
    notes: "Shopify storefront. One of Finnrick's most-tested vendors (97 tests).",
    selectors: {
      productContainer: ".product-item",
      name: ".product-item__title",
      price: ".price__regular .price-item",
      concentration: ".product-item__title",
      availability: ".product-item__sold-out",
      productLink: "a.product-item__image-link",
    },
  },

  "verified-peptides": {
    vendorName: "Verified Peptides",
    baseUrl: "https://verifiedpeptides.com",
    productListUrl: "https://verifiedpeptides.com/products",
    vendorType: "research",
    status: "active",
    rateLimit: 6,
    scrapingEnabled: true,
    notes: "Custom storefront. Prices include COA links in product detail pages.",
    selectors: {
      productContainer: ".product-item",
      name: ".product-name",
      price: ".product-price",
      concentration: ".product-name",
      availability: ".availability",
      productLink: "a.product-link",
    },
  },

  "amino-asylum": {
    vendorName: "Amino Asylum",
    baseUrl: "https://aminoasylum.shop",
    productListUrl: "https://aminoasylum.shop/collections/peptides",
    vendorType: "research",
    status: "active",
    rateLimit: 6,
    scrapingEnabled: true,
    notes: "Shopify storefront. Carries a broad peptide catalog including GLP-1 analogs.",
    selectors: {
      productContainer: ".product-item",
      name: ".product-item__title",
      price: ".price__regular .price-item",
      concentration: ".product-item__title",
      availability: ".product-item__sold-out",
      productLink: "a.product-item__link",
    },
  },

  "pure-rawz": {
    vendorName: "Pure Rawz",
    baseUrl: "https://purerawz.co",
    productListUrl: "https://purerawz.co/product-category/peptides",
    vendorType: "research",
    status: "active",
    rateLimit: 6,
    scrapingEnabled: true,
    notes: "WooCommerce. Wide selection; COA available on request per product page.",
    selectors: {
      productContainer: ".product",
      name: ".woocommerce-loop-product__title",
      price: ".price .amount",
      concentration: ".woocommerce-loop-product__title",
      availability: ".stock",
      productLink: "a.woocommerce-LoopProduct-link",
    },
  },

  "biotech-peptides": {
    vendorName: "Biotech Peptides",
    baseUrl: "https://biotechpeptides.com",
    productListUrl: "https://biotechpeptides.com/peptides",
    vendorType: "research",
    status: "active",
    rateLimit: 6,
    scrapingEnabled: true,
    notes: "Custom cart; static product listing. Verified robots.txt allows /peptides.",
    selectors: {
      productContainer: ".product-card",
      name: ".product-card__title",
      price: ".product-card__price",
      concentration: ".product-card__title",
      availability: ".product-card__stock",
      productLink: "a.product-card__link",
    },
  },

  "sports-technology-labs": {
    vendorName: "Sports Technology Labs",
    baseUrl: "https://sportstechnologylabs.com",
    productListUrl: "https://sportstechnologylabs.com/product-category/peptides",
    vendorType: "research",
    status: "active",
    rateLimit: 6,
    scrapingEnabled: true,
    notes: "WooCommerce. Strong COA documentation; Finnrick tested for several SKUs.",
    selectors: {
      productContainer: ".product",
      name: ".woocommerce-loop-product__title",
      price: ".price .amount",
      concentration: ".woocommerce-loop-product__title",
      availability: ".stock",
      productLink: "a.woocommerce-LoopProduct-link",
    },
  },

  "peptide-sciences": {
    vendorName: "Peptide Sciences",
    baseUrl: "https://www.peptidesciences.com",
    productListUrl: "https://www.peptidesciences.com/buy-peptides",
    vendorType: "research",
    status: "active",
    rateLimit: 6,
    scrapingEnabled: true,
    notes: "One of the oldest peptide research vendors. Static HTML catalog page.",
    selectors: {
      productContainer: ".product-item",
      name: ".product-name",
      price: ".product-price",
      concentration: ".product-name",
      availability: ".in-stock",
      productLink: "a.product-link",
    },
  },

  // ── JS-rendered sites (need Playwright adapter) ──────────────────────────

  "skye-peptides": {
    vendorName: "Skye Peptides",
    baseUrl: "https://skyepeptides.com",
    productListUrl: "https://skyepeptides.com/collections/peptides",
    vendorType: "research",
    status: "js-required",
    rateLimit: 6,
    scrapingEnabled: false,
    disabledReason: "Site requires JavaScript rendering for price display",
    notes: "Shopify with client-side price hydration. Planned: Playwright adapter.",
    selectors: {
      productContainer: ".product-item",
      name: ".product-item__title",
      price: ".price",
      concentration: ".product-item__title",
      availability: ".sold-out",
      productLink: "a.product-item__link",
    },
  },

  "behemoth-labz": {
    vendorName: "Behemoth Labz",
    baseUrl: "https://behemothlabz.com",
    productListUrl: "https://behemothlabz.com/product-category/peptides",
    vendorType: "research",
    status: "js-required",
    rateLimit: 6,
    scrapingEnabled: false,
    disabledReason: "React SPA — prices loaded via client-side API calls",
    notes: "Planned: intercept product API endpoints (/wp-json/wc/v3/products).",
    selectors: {
      productContainer: ".product",
      name: ".woocommerce-loop-product__title",
      price: ".price .amount",
      concentration: ".woocommerce-loop-product__title",
      availability: ".stock",
      productLink: "a.woocommerce-LoopProduct-link",
    },
  },

  // ── Manual-import only ────────────────────────────────────────────────────

  "peptide-partners": {
    vendorName: "Peptide Partners",
    baseUrl: "https://peptide.partners",
    productListUrl: "https://peptide.partners/shop",
    vendorType: "research",
    status: "manual-only",
    rateLimit: 6,
    scrapingEnabled: false,
    disabledReason: "Site is JavaScript-rendered (React SPA); use manual import",
    notes: "Use Admin > Import CSV to update prices. Export from their internal portal.",
    selectors: {
      productContainer: ".product-card",
      name: ".product-name",
      price: ".price",
      concentration: ".product-name",
      availability: ".stock",
      productLink: "a",
    },
  },

  "limitless-life-nootropics": {
    vendorName: "Limitless Life Nootropics",
    baseUrl: "https://limitlesslifenootropics.com",
    productListUrl: "https://limitlesslifenootropics.com/product-category/peptides",
    vendorType: "research",
    status: "manual-only",
    rateLimit: 6,
    scrapingEnabled: false,
    disabledReason: "Cloudflare bot protection on product listing pages",
    notes: "Robots.txt blocks automated crawlers. Manual import or API integration needed.",
    selectors: {
      productContainer: ".product",
      name: ".woocommerce-loop-product__title",
      price: ".price .amount",
      concentration: ".woocommerce-loop-product__title",
      availability: ".stock",
      productLink: "a.woocommerce-LoopProduct-link",
    },
  },
};

export function getScraperConfig(vendorSlug: string): ScraperConfig | undefined {
  return scraperConfigs[vendorSlug];
}

/** Returns only vendors with automated scraping enabled. */
export function getActiveScraperConfigs(): ScraperConfig[] {
  return Object.values(scraperConfigs).filter((c) => c.scrapingEnabled);
}

/** Returns all vendor source entries grouped by status. */
export function getSourceRegistrySummary(): Record<VendorStatus, ScraperConfig[]> {
  const result: Record<VendorStatus, ScraperConfig[]> = {
    active: [],
    paused: [],
    "manual-only": [],
    "js-required": [],
    disabled: [],
  };
  for (const cfg of Object.values(scraperConfigs)) {
    result[cfg.status].push(cfg);
  }
  return result;
}
