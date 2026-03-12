import { BaseFetcher } from "./base-fetcher";
import { parsePrice, parseConcentration, normalizePeptideName, normalizeAvailability } from "./html-parser";
import type { VendorPeptideData } from "@/types";
import { logger } from "@/lib/utils/logger";

/**
 * Fetcher for polarispeptides.com
 *
 * Polaris Peptides is one of Finnrick's most-tested vendors (A-D, 97 tests).
 * Site uses Shopify — product listings at /collections/peptides.
 *
 * To activate live scraping:
 *   1. Capture HTML to __fixtures__/polaris-peptides-products.html
 *   2. Verify robots.txt allows crawling /collections/
 *   3. Uncomment the fetchWithRetry block
 *   4. Set scrapingEnabled = true in scraper-config.ts
 */

export class PolarisPeptidesFetcher extends BaseFetcher {
  vendorName = "Polaris Peptides";
  private baseUrl = "https://polarispeptides.com";

  async fetchAll(): Promise<VendorPeptideData[]> {
    logger.info(`[${this.vendorName}] Starting data fetch`);

    try {
      // Live scraping (uncomment when ready):
      // const response = await this.fetchWithRetry(`${this.baseUrl}/collections/peptides`);
      // const html = await response.text();
      // return this.parseProductListing(html);

      const products: VendorPeptideData[] = [
        {
          vendorName: this.vendorName,
          peptideName: "BPC-157",
          concentration: "5mg",
          price: 37.50,
          currency: "USD",
          sku: "POL-BPC157-5",
          productUrl: `${this.baseUrl}/products/bpc-157-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "TB-500",
          concentration: "5mg",
          price: 33.50,
          currency: "USD",
          sku: "POL-TB500-5",
          productUrl: `${this.baseUrl}/products/tb-500-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Ipamorelin",
          concentration: "5mg",
          price: 28.50,
          currency: "USD",
          sku: "POL-IPA-5",
          productUrl: `${this.baseUrl}/products/ipamorelin-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "CJC-1295",
          concentration: "5mg",
          price: 34.50,
          currency: "USD",
          sku: "POL-CJC1295-5",
          productUrl: `${this.baseUrl}/products/cjc-1295-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Semaglutide",
          concentration: "3mg",
          price: 88.50,
          currency: "USD",
          sku: "POL-SEMA-3",
          productUrl: `${this.baseUrl}/products/semaglutide-3mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "GHK-Cu",
          concentration: "50mg",
          price: 43.50,
          currency: "USD",
          sku: "POL-GHKCU-50",
          productUrl: `${this.baseUrl}/products/ghk-cu-50mg`,
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

  private parseProductListing(html: string): VendorPeptideData[] {
    const products: VendorPeptideData[] = [];

    // Shopify collection page product blocks
    const blockRe = /<li[^>]*class="[^"]*product-item[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
    let match: RegExpExecArray | null;

    while ((match = blockRe.exec(html)) !== null) {
      const block = match[1];

      const rawName = block.match(/class="[^"]*product-item__title[^"]*"[^>]*>([^<]+)</i)?.[1]?.trim();
      const rawPrice = block.match(/class="[^"]*price-item--regular[^"]*"[^>]*>([^<]+)</i)?.[1]?.trim();
      const rawLink = block.match(/href="(\/products\/[^"]+)"/i)?.[1];
      const soldOut = /sold.?out/i.test(block);

      if (!rawName || !rawPrice) continue;

      const price = parsePrice(rawPrice);
      if (!price) continue;

      const peptideName = normalizePeptideName(rawName);
      const concentration = parseConcentration(rawName) ?? "unknown";
      const availabilityStatus = normalizeAvailability(soldOut ? "sold out" : "in stock");

      products.push({
        vendorName: this.vendorName,
        peptideName,
        concentration,
        price,
        currency: "USD",
        sku: `polaris-${peptideName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${concentration}`,
        productUrl: rawLink ? `${this.baseUrl}${rawLink}` : `${this.baseUrl}/collections/peptides`,
        availabilityStatus,
        lastUpdated: new Date(),
      });
    }

    return products;
  }
}
