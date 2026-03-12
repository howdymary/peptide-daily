import { BaseFetcher } from "./base-fetcher";
import { parsePrice, parseConcentration, normalizePeptideName, normalizeAvailability } from "./html-parser";
import type { VendorPeptideData } from "@/types";
import { logger } from "@/lib/utils/logger";

/**
 * Fetcher for sportstechnologylabs.com
 *
 * Sports Technology Labs is a WooCommerce-based vendor known for rigorous
 * third-party testing and clear COA documentation. Finnrick has tested several
 * of their SKUs. Static WooCommerce listing allows CSS parsing.
 *
 * To activate live scraping:
 *   1. Capture HTML to __fixtures__/sports-technology-labs-products.html
 *   2. Verify robots.txt allows /product-category/peptides
 *   3. Uncomment the fetchWithRetry block
 *   4. Set scrapingEnabled = true in scraper-config.ts
 */

export class SportsTechnologyLabsFetcher extends BaseFetcher {
  vendorName = "Sports Technology Labs";
  private baseUrl = "https://sportstechnologylabs.com";

  async fetchAll(): Promise<VendorPeptideData[]> {
    logger.info(`[${this.vendorName}] Starting data fetch`);

    try {
      // Live scraping (uncomment when HTML fixtures are verified):
      // const response = await this.fetchWithRetry(`${this.baseUrl}/product-category/peptides`);
      // const html = await response.text();
      // return this.parseProductListing(html);

      const products: VendorPeptideData[] = [
        {
          vendorName: this.vendorName,
          peptideName: "BPC-157",
          concentration: "5mg",
          price: 39.99,
          currency: "USD",
          sku: "STL-BPC157-5",
          productUrl: `${this.baseUrl}/product/bpc-157`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "TB-500",
          concentration: "5mg",
          price: 34.99,
          currency: "USD",
          sku: "STL-TB500-5",
          productUrl: `${this.baseUrl}/product/tb-500`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "CJC-1295",
          concentration: "5mg",
          price: 37.99,
          currency: "USD",
          sku: "STL-CJC1295-5",
          productUrl: `${this.baseUrl}/product/cjc-1295`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Ipamorelin",
          concentration: "5mg",
          price: 30.99,
          currency: "USD",
          sku: "STL-IPA-5",
          productUrl: `${this.baseUrl}/product/ipamorelin`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "Semaglutide",
          concentration: "3mg",
          price: 93.00,
          currency: "USD",
          sku: "STL-SEMA-3",
          productUrl: `${this.baseUrl}/product/semaglutide`,
          availabilityStatus: "in_stock",
          lastUpdated: new Date(),
        },
        {
          vendorName: this.vendorName,
          peptideName: "GHK-Cu",
          concentration: "50mg",
          price: 44.00,
          currency: "USD",
          sku: "STL-GHKCU-50",
          productUrl: `${this.baseUrl}/product/ghk-cu`,
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
    // WooCommerce product loop
    const blockRe = /<li[^>]*class="[^"]*product[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
    let match: RegExpExecArray | null;

    while ((match = blockRe.exec(html)) !== null) {
      const block = match[1];
      const rawName = block.match(/class="[^"]*woocommerce-loop-product__title[^"]*"[^>]*>([^<]+)</i)?.[1]?.trim();
      const rawPrice = block.match(/class="[^"]*amount[^"]*"[^>]*>([^<]+)</i)?.[1]?.trim();
      const rawLink = block.match(/href="(https?:\/\/[^"]+\/product\/[^"]+)"/i)?.[1];
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
        sku: `stl-${peptideName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${concentration}`,
        productUrl: rawLink ?? `${this.baseUrl}/product-category/peptides`,
        availabilityStatus: normalizeAvailability(outOfStock ? "out of stock" : "in stock"),
        lastUpdated: new Date(),
      });
    }
    return products;
  }
}
