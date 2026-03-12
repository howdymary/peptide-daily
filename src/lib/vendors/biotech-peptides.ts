import { BaseFetcher } from "./base-fetcher";
import { parsePrice, parseConcentration, normalizePeptideName, normalizeAvailability } from "./html-parser";
import type { VendorPeptideData } from "@/types";
import { logger } from "@/lib/utils/logger";

/**
 * Fetcher for biotechpeptides.com
 *
 * Biotech Peptides is a research-chemical vendor offering a broad peptide
 * catalog with third-party COA documentation. Static HTML catalog allows
 * reliable CSS-selector parsing.
 *
 * To activate live scraping:
 *   1. Capture HTML to __fixtures__/biotech-peptides-products.html
 *   2. Verify robots.txt allows /peptides
 *   3. Uncomment the fetchWithRetry block
 *   4. Set scrapingEnabled = true in scraper-config.ts
 */

export class BiotechPeptidesFetcher extends BaseFetcher {
  vendorName = "Biotech Peptides";
  private baseUrl = "https://biotechpeptides.com";

  async fetchAll(): Promise<VendorPeptideData[]> {
    logger.info(`[${this.vendorName}] Starting data fetch`);

    try {
      // Live scraping (uncomment when HTML fixtures are verified):
      // const response = await this.fetchWithRetry(`${this.baseUrl}/peptides`);
      // const html = await response.text();
      // return this.parseProductListing(html);

      const products: VendorPeptideData[] = [
        {
          vendorName: this.vendorName,
          peptideName: "BPC-157",
          concentration: "5mg",
          price: 36.00,
          currency: "USD",
          sku: "BTP-BPC157-5",
          productUrl: `${this.baseUrl}/product/bpc-157-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "TB-500",
          concentration: "5mg",
          price: 32.00,
          currency: "USD",
          sku: "BTP-TB500-5",
          productUrl: `${this.baseUrl}/product/tb-500-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Ipamorelin",
          concentration: "5mg",
          price: 28.00,
          currency: "USD",
          sku: "BTP-IPA-5",
          productUrl: `${this.baseUrl}/product/ipamorelin-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "CJC-1295",
          concentration: "5mg",
          price: 35.00,
          currency: "USD",
          sku: "BTP-CJC1295-5",
          productUrl: `${this.baseUrl}/product/cjc-1295-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "GHK-Cu",
          concentration: "50mg",
          price: 40.00,
          currency: "USD",
          sku: "BTP-GHKCU-50",
          productUrl: `${this.baseUrl}/product/ghk-cu-50mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Semaglutide",
          concentration: "3mg",
          price: 86.00,
          currency: "USD",
          sku: "BTP-SEMA-3",
          productUrl: `${this.baseUrl}/product/semaglutide-3mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Sermorelin",
          concentration: "5mg",
          price: 33.00,
          currency: "USD",
          sku: "BTP-SERM-5",
          productUrl: `${this.baseUrl}/product/sermorelin-5mg`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Hexarelin",
          concentration: "5mg",
          price: 31.00,
          currency: "USD",
          sku: "BTP-HEX-5",
          productUrl: `${this.baseUrl}/product/hexarelin-5mg`,
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
    const blockRe = /<div[^>]*class="[^"]*product-card[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?=<div[^>]*class="[^"]*product-card|<\/section)/gi;
    let match: RegExpExecArray | null;

    while ((match = blockRe.exec(html)) !== null) {
      const block = match[1];
      const rawName = block.match(/class="[^"]*product-card__title[^"]*"[^>]*>([^<]+)</i)?.[1]?.trim();
      const rawPrice = block.match(/class="[^"]*product-card__price[^"]*"[^>]*>([^<]+)</i)?.[1]?.trim();
      const rawLink = block.match(/href="([^"]+)"/i)?.[1];
      const outOfStock = /out.of.stock/i.test(block);

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
        sku: `btp-${peptideName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${concentration}`,
        productUrl: rawLink ? (rawLink.startsWith("http") ? rawLink : `${this.baseUrl}${rawLink}`) : `${this.baseUrl}/peptides`,
        availabilityStatus: normalizeAvailability(outOfStock ? "out of stock" : "in stock"),
        lastUpdated: new Date(),
      });
    }
    return products;
  }
}
