import { BaseFetcher } from "./base-fetcher";
import { parsePrice, parseConcentration, normalizePeptideName, normalizeAvailability } from "./html-parser";
import type { VendorPeptideData } from "@/types";
import { logger } from "@/lib/utils/logger";

/**
 * Fetcher for aminoasylum.shop
 *
 * Amino Asylum is a Shopify-based research peptide vendor with a broad catalog
 * including GLP-1 analogs, recovery peptides, and growth hormone secretagogues.
 *
 * To activate live scraping:
 *   1. Capture HTML to __fixtures__/amino-asylum-products.html
 *   2. Verify robots.txt allows crawling /collections/peptides
 *   3. Uncomment the fetchWithRetry block below
 *   4. Set scrapingEnabled = true in scraper-config.ts
 */

export class AminoAsylumFetcher extends BaseFetcher {
  vendorName = "Amino Asylum";
  private baseUrl = "https://aminoasylum.shop";

  async fetchAll(): Promise<VendorPeptideData[]> {
    logger.info(`[${this.vendorName}] Starting data fetch`);

    try {
      // Live scraping (uncomment when HTML fixtures are verified):
      // const response = await this.fetchWithRetry(`${this.baseUrl}/collections/peptides`);
      // const html = await response.text();
      // return this.parseProductListing(html);

      const products: VendorPeptideData[] = [
        {
          vendorName: this.vendorName,
          peptideName: "BPC-157",
          concentration: "5mg",
          price: 35.99,
          currency: "USD",
          sku: "AA-BPC157-5",
          productUrl: `${this.baseUrl}/products/bpc-157-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "TB-500",
          concentration: "5mg",
          price: 31.99,
          currency: "USD",
          sku: "AA-TB500-5",
          productUrl: `${this.baseUrl}/products/tb-500-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Semaglutide",
          concentration: "3mg",
          price: 84.99,
          currency: "USD",
          sku: "AA-SEMA-3",
          productUrl: `${this.baseUrl}/products/semaglutide-3mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Ipamorelin",
          concentration: "5mg",
          price: 27.99,
          currency: "USD",
          sku: "AA-IPA-5",
          productUrl: `${this.baseUrl}/products/ipamorelin-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "CJC-1295",
          concentration: "5mg",
          price: 33.99,
          currency: "USD",
          sku: "AA-CJC1295-5",
          productUrl: `${this.baseUrl}/products/cjc-1295-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "GHK-Cu",
          concentration: "50mg",
          price: 41.99,
          currency: "USD",
          sku: "AA-GHKCU-50",
          productUrl: `${this.baseUrl}/products/ghk-cu-50mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "PT-141",
          concentration: "10mg",
          price: 26.99,
          currency: "USD",
          sku: "AA-PT141-10",
          productUrl: `${this.baseUrl}/products/pt-141-10mg`,
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
    // Shopify collection page — same structure as Polaris
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
      products.push({
        vendorName: this.vendorName,
        peptideName,
        concentration,
        price,
        currency: "USD",
        sku: `aa-${peptideName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${concentration}`,
        productUrl: rawLink ? `${this.baseUrl}${rawLink}` : `${this.baseUrl}/collections/peptides`,
        availabilityStatus: normalizeAvailability(soldOut ? "sold out" : "in stock"),
        lastUpdated: new Date(),
      });
    }
    return products;
  }
}
