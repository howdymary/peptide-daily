import { BaseFetcher } from "./base-fetcher";
import type { VendorPeptideData } from "@/types";
import { logger } from "@/lib/utils/logger";

/**
 * Fetcher for skyepeptides.com
 *
 * Skye Peptides is a Finnrick-rated vendor. Their site uses JavaScript
 * rendering (React SPA) for dynamic pricing, making static HTML scraping
 * unreliable. Scraping is currently DISABLED.
 *
 * This adapter provides stub data for development/testing. In production,
 * use the manual JSON import endpoint (/api/finnrick/import) or implement
 * a Playwright-based headless browser adapter when JS rendering support
 * is added to the scraping infrastructure.
 *
 * To enable: set scrapingEnabled=true in scraper-config.ts and replace
 * fetchAll() with a Playwright-based implementation.
 */

export class SkyePeptidesFetcher extends BaseFetcher {
  vendorName = "Skye Peptides";
  private baseUrl = "https://skyepeptides.com";

  async fetchAll(): Promise<VendorPeptideData[]> {
    logger.info(`[${this.vendorName}] Starting data fetch (stub — JS rendering required)`);

    // Note: live scraping disabled for this vendor.
    // Return stub data for development purposes only.
    const products: VendorPeptideData[] = [
      {
        vendorName: this.vendorName,
        peptideName: "BPC-157",
        concentration: "5mg",
        price: 40.00,
        currency: "USD",
        sku: "SKYE-BPC157-5",
        productUrl: `${this.baseUrl}/products/bpc-157-5mg`,
        availabilityStatus: "in_stock",
        lastUpdated: new Date(),
      },
      {
        vendorName: this.vendorName,
        peptideName: "TB-500",
        concentration: "5mg",
        price: 35.00,
        currency: "USD",
        sku: "SKYE-TB500-5",
        productUrl: `${this.baseUrl}/products/tb-500-5mg`,
        availabilityStatus: "in_stock",
        lastUpdated: new Date(),
      },
      {
        vendorName: this.vendorName,
        peptideName: "Semaglutide",
        concentration: "3mg",
        price: 92.00,
        currency: "USD",
        sku: "SKYE-SEMA-3",
        productUrl: `${this.baseUrl}/products/semaglutide-3mg`,
        availabilityStatus: "in_stock",
        lastUpdated: new Date(),
      },
    ];

    logger.info(`[${this.vendorName}] Returned ${products.length} stub products`);
    return products;
  }
}
