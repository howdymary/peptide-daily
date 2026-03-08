/**
 * Per-vendor scraping configuration.
 *
 * Defines base URLs, product list endpoints, rate limits, and CSS selectors
 * used by each fetcher to parse product listings.
 *
 * Selectors are CSS-style strings passed to the html-parser utilities.
 * They are intentionally simple (class-based) to survive minor HTML changes.
 *
 * When scrapingEnabled is false the vendor is marked for manual/offline import.
 */

export interface ScraperConfig {
  vendorName: string;
  baseUrl: string;
  productListUrl: string;
  /** Max HTTP requests per minute (conservative — be a good citizen) */
  rateLimit: number;
  /** Whether automated scraping is enabled for this vendor */
  scrapingEnabled: boolean;
  /** Reason scraping is disabled, if applicable */
  disabledReason?: string;
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
  "paradigm-peptide": {
    vendorName: "Paradigm Peptide",
    baseUrl: "https://paradigmpeptide.com",
    productListUrl: "https://paradigmpeptide.com/research-peptides",
    rateLimit: 6,
    scrapingEnabled: true,
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
    rateLimit: 6,
    scrapingEnabled: true,
    selectors: {
      productContainer: ".product-item",
      name: ".product-item__title",
      price: ".price__regular .price-item",
      concentration: ".product-item__title",
      availability: ".product-item__sold-out",
      productLink: "a.product-item__image-link",
    },
  },

  "skye-peptides": {
    vendorName: "Skye Peptides",
    baseUrl: "https://skyepeptides.com",
    productListUrl: "https://skyepeptides.com/collections/peptides",
    rateLimit: 6,
    // Many peptide vendor Shopify sites require JS rendering for dynamic pricing.
    // Marking as disabled until a proper adapter is built.
    scrapingEnabled: false,
    disabledReason: "Site requires JavaScript rendering for price display",
    selectors: {
      productContainer: ".product-item",
      name: ".product-item__title",
      price: ".price",
      concentration: ".product-item__title",
      availability: ".sold-out",
      productLink: "a.product-item__link",
    },
  },

  "verified-peptides": {
    vendorName: "Verified Peptides",
    baseUrl: "https://verifiedpeptides.com",
    productListUrl: "https://verifiedpeptides.com/products",
    rateLimit: 6,
    scrapingEnabled: true,
    selectors: {
      productContainer: ".product-item",
      name: ".product-name",
      price: ".product-price",
      concentration: ".product-name",
      availability: ".availability",
      productLink: "a.product-link",
    },
  },

  "peptide-partners": {
    vendorName: "Peptide Partners",
    baseUrl: "https://peptide.partners",
    productListUrl: "https://peptide.partners/shop",
    rateLimit: 6,
    scrapingEnabled: false,
    disabledReason: "Site is JavaScript-rendered (React SPA); use manual import",
    selectors: {
      productContainer: ".product-card",
      name: ".product-name",
      price: ".price",
      concentration: ".product-name",
      availability: ".stock",
      productLink: "a",
    },
  },
};

export function getScraperConfig(vendorSlug: string): ScraperConfig | undefined {
  return scraperConfigs[vendorSlug];
}
