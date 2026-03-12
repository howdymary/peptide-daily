import { BaseFetcher } from "./base-fetcher";
import { parsePrice, parseConcentration, normalizePeptideName, normalizeAvailability } from "./html-parser";
import type { VendorPeptideData } from "@/types";
import { logger } from "@/lib/utils/logger";

/**
 * Fetcher for peptidesciences.com
 *
 * Peptide Sciences is one of the longest-established research peptide vendors.
 * They maintain a large catalog with COA documentation. Static catalog listing
 * allows straightforward CSS parsing.
 *
 * To activate live scraping:
 *   1. Capture HTML to __fixtures__/peptide-sciences-products.html
 *   2. Verify robots.txt allows /buy-peptides
 *   3. Uncomment the fetchWithRetry block
 *   4. Set scrapingEnabled = true in scraper-config.ts
 */

export class PeptideSciencesFetcher extends BaseFetcher {
  vendorName = "Peptide Sciences";
  private baseUrl = "https://www.peptidesciences.com";

  async fetchAll(): Promise<VendorPeptideData[]> {
    logger.info(`[${this.vendorName}] Starting data fetch`);

    try {
      // Live scraping (uncomment when HTML fixtures are verified):
      // const response = await this.fetchWithRetry(`${this.baseUrl}/buy-peptides`);
      // const html = await response.text();
      // return this.parseProductListing(html);

      const products: VendorPeptideData[] = [
        {
          vendorName: this.vendorName,
          peptideName: "BPC-157",
          concentration: "5mg",
          price: 45.00,
          currency: "USD",
          sku: "PS-BPC157-5",
          productUrl: `${this.baseUrl}/bpc-157`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "TB-500",
          concentration: "5mg",
          price: 40.00,
          currency: "USD",
          sku: "PS-TB500-5",
          productUrl: `${this.baseUrl}/tb-500`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "GHK-Cu",
          concentration: "50mg",
          price: 50.00,
          currency: "USD",
          sku: "PS-GHKCU-50",
          productUrl: `${this.baseUrl}/ghk-cu`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Ipamorelin",
          concentration: "5mg",
          price: 35.00,
          currency: "USD",
          sku: "PS-IPA-5",
          productUrl: `${this.baseUrl}/ipamorelin`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "CJC-1295",
          concentration: "5mg",
          price: 38.00,
          currency: "USD",
          sku: "PS-CJC1295-5",
          productUrl: `${this.baseUrl}/cjc-1295`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Semaglutide",
          concentration: "3mg",
          price: 98.00,
          currency: "USD",
          sku: "PS-SEMA-3",
          productUrl: `${this.baseUrl}/semaglutide`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "PT-141",
          concentration: "10mg",
          price: 32.00,
          currency: "USD",
          sku: "PS-PT141-10",
          productUrl: `${this.baseUrl}/pt-141`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Melanotan II",
          concentration: "10mg",
          price: 28.00,
          currency: "USD",
          sku: "PS-MT2-10",
          productUrl: `${this.baseUrl}/melanotan-2`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Sermorelin",
          concentration: "5mg",
          price: 36.00,
          currency: "USD",
          sku: "PS-SERM-5",
          productUrl: `${this.baseUrl}/sermorelin`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Hexarelin",
          concentration: "5mg",
          price: 34.00,
          currency: "USD",
          sku: "PS-HEX-5",
          productUrl: `${this.baseUrl}/hexarelin`,
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
    const blockRe = /<div[^>]*class="[^"]*product-item[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?=<div[^>]*class="[^"]*product-item|<\/[a-z])/gi;
    let match: RegExpExecArray | null;

    while ((match = blockRe.exec(html)) !== null) {
      const block = match[1];
      const rawName = block.match(/class="[^"]*product-name[^"]*"[^>]*>([^<]+)</i)?.[1]?.trim();
      const rawPrice = block.match(/class="[^"]*product-price[^"]*"[^>]*>([^<]+)</i)?.[1]?.trim();
      const rawLink = block.match(/href="([^"]+)"/i)?.[1];
      const inStock = /in-stock/i.test(block);

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
        sku: `ps-${peptideName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${concentration}`,
        productUrl: rawLink ? (rawLink.startsWith("http") ? rawLink : `${this.baseUrl}${rawLink}`) : `${this.baseUrl}/buy-peptides`,
        availabilityStatus: normalizeAvailability(inStock ? "in stock" : "out of stock"),
        lastUpdated: new Date(),
      });
    }
    return products;
  }
}
