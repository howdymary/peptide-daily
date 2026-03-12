import { BaseFetcher } from "./base-fetcher";
import { parsePrice, parseConcentration, normalizePeptideName, normalizeAvailability } from "./html-parser";
import type { VendorPeptideData } from "@/types";
import { logger } from "@/lib/utils/logger";

/**
 * Fetcher for paradigmpeptide.com
 *
 * Paradigm Peptide is one of Finnrick's top-rated vendors (A, 16 tests).
 * Site uses standard server-rendered HTML product listings.
 *
 * The stub data below demonstrates the expected VendorPeptideData shape.
 * Replace the fetchAll() body with live HTML parsing once HTML structure
 * has been captured in __fixtures__/paradigm-peptide-products.html and
 * verified against the live site's robots.txt (allow: /research-peptides).
 *
 * To activate live scraping:
 *   1. Uncomment the fetchWithRetry call
 *   2. Set scrapingEnabled = true in scraper-config.ts
 *   3. Ensure VendorMapping.scrapingEnabled = true for this vendor
 */

export class ParadigmPeptideFetcher extends BaseFetcher {
  vendorName = "Paradigm Peptide";
  private baseUrl = "https://paradigmpeptide.com";

  async fetchAll(): Promise<VendorPeptideData[]> {
    logger.info(`[${this.vendorName}] Starting data fetch`);

    try {
      // Live scraping (uncomment when ready):
      // const response = await this.fetchWithRetry(`${this.baseUrl}/research-peptides`);
      // const html = await response.text();
      // return this.parseProductListing(html);

      // Stub data based on Finnrick-rated products for this vendor
      const products: VendorPeptideData[] = [
        {
          vendorName: this.vendorName,
          peptideName: "BPC-157",
          concentration: "5mg",
          price: 38.99,
          currency: "USD",
          sku: "PP-BPC157-5",
          productUrl: `${this.baseUrl}/product/bpc-157-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Ipamorelin",
          concentration: "5mg",
          price: 30.99,
          currency: "USD",
          sku: "PP-IPA-5",
          productUrl: `${this.baseUrl}/product/ipamorelin-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "TB-500",
          concentration: "5mg",
          price: 33.99,
          currency: "USD",
          sku: "PP-TB500-5",
          productUrl: `${this.baseUrl}/product/tb-500-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "CJC-1295",
          concentration: "5mg",
          price: 36.99,
          currency: "USD",
          sku: "PP-CJC1295-5",
          productUrl: `${this.baseUrl}/product/cjc-1295-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Semaglutide",
          concentration: "3mg",
          price: 87.99,
          currency: "USD",
          sku: "PP-SEMA-3",
          productUrl: `${this.baseUrl}/product/semaglutide-3mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "PT-141",
          concentration: "10mg",
          price: 27.99,
          currency: "USD",
          sku: "PP-PT141-10",
          productUrl: `${this.baseUrl}/product/pt-141-10mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
      ];

      logger.info(`[${this.vendorName}] Fetched ${products.length} products`);
      return products;
    } catch (err) {
      logger.error(`[${this.vendorName}] Fetch failed`, {
        metadata: { error: err instanceof Error ? err.message : "Unknown" },
      });
      throw err;
    }
  }

  /**
   * Parse product listing HTML into VendorPeptideData[].
   * Called when live scraping is enabled.
   */
  private parseProductListing(html: string): VendorPeptideData[] {
    const products: VendorPeptideData[] = [];

    // Extract product blocks — adjust regex when fixture HTML is captured
    const blockRe = /<div[^>]*class="[^"]*product-item[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    let match: RegExpExecArray | null;

    while ((match = blockRe.exec(html)) !== null) {
      const block = match[1];

      const rawName = block.match(/<[^>]*class="[^"]*product-title[^"]*"[^>]*>([^<]+)</i)?.[1]?.trim();
      const rawPrice = block.match(/<[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)</i)?.[1]?.trim();
      const rawLink = block.match(/href="([^"]+)"/i)?.[1];
      const rawAvail = block.match(/<[^>]*class="[^"]*stock[^"]*"[^>]*>([^<]+)</i)?.[1]?.trim() ?? "in stock";

      if (!rawName || !rawPrice) continue;

      const price = parsePrice(rawPrice);
      if (!price) continue;

      const peptideName = normalizePeptideName(rawName);
      const concentration = parseConcentration(rawName) ?? "unknown";
      const availabilityStatus = normalizeAvailability(rawAvail);

      products.push({
        vendorName: this.vendorName,
        peptideName,
        concentration,
        price,
        currency: "USD",
        sku: `paradigm-${peptideName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${concentration}`,
        productUrl: rawLink ? `${this.baseUrl}${rawLink}` : `${this.baseUrl}/research-peptides`,
        availabilityStatus,
        lastUpdated: new Date(),
      });
    }

    return products;
  }
}
