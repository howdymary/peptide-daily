/**
 * Tests for the NewsTickerBanner component and TickerItem data shape.
 *
 * We test:
 *  1. TickerItem data construction (the server-side logic that builds ticker items)
 *  2. That ticker items are properly deduped and shaped
 *  3. Ticker items are correctly interleaved (news first, then price)
 *
 * Full React rendering tests would require @testing-library/react; these tests
 * validate the data pipeline and logic that feeds the component.
 */

import { describe, it, expect } from "vitest";
import type { TickerItem } from "@/components/home/news-ticker";

// ── Helpers (mirrors logic in src/app/page.tsx) ───────────────────────────────

type MockArticle = { title: string; sourceUrl: string };
type MockPrice = { peptideName: string; price: number; vendorName: string; productUrl: string };

function buildTickerItems(
  articles: MockArticle[],
  prices: MockPrice[],
): TickerItem[] {
  const tickerNewsItems: TickerItem[] = articles.slice(0, 8).map((a) => ({
    text: a.title.length > 90 ? a.title.slice(0, 88) + "…" : a.title,
    href: a.sourceUrl,
    type: "news" as const,
  }));

  // Deduplicate by peptide name (keep cheapest — already sorted)
  const cheapestByPeptide = new Map<string, MockPrice>();
  for (const p of prices) {
    if (!cheapestByPeptide.has(p.peptideName)) cheapestByPeptide.set(p.peptideName, p);
  }
  const priceInsights: TickerItem[] = [...cheapestByPeptide.values()].slice(0, 5).map((p) => ({
    text: `${p.peptideName} from $${Number(p.price).toFixed(2)} at ${p.vendorName}`,
    href: p.productUrl,
    type: "price" as const,
  }));

  const items: TickerItem[] = [];
  const maxLen = Math.max(tickerNewsItems.length, priceInsights.length);
  for (let i = 0; i < maxLen; i++) {
    if (tickerNewsItems[i]) items.push(tickerNewsItems[i]);
    if (priceInsights[i]) items.push(priceInsights[i]);
  }
  return items;
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const sampleArticles: MockArticle[] = [
  { title: "Semaglutide shows 15% reduction in cardiovascular events in SURMOUNT trial", sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/1" },
  { title: "BPC-157 accelerates tendon repair in rat model", sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/2" },
  { title: "FDA approves new GLP-1 drug for pediatric obesity", sourceUrl: "https://www.fda.gov/3" },
  { title: "Growth hormone secretagogues: a systematic review", sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/4" },
];

const samplePrices: MockPrice[] = [
  { peptideName: "BPC-157", price: 35.99, vendorName: "Amino Asylum", productUrl: "https://aminoasylum.shop/products/bpc-157-5mg" },
  { peptideName: "BPC-157", price: 38.99, vendorName: "Pure Rawz", productUrl: "https://purerawz.co/product/bpc-157-5mg" }, // duplicate → should be deduped
  { peptideName: "Semaglutide", price: 84.99, vendorName: "Amino Asylum", productUrl: "https://aminoasylum.shop/products/semaglutide-3mg" },
  { peptideName: "TB-500", price: 31.99, vendorName: "Amino Asylum", productUrl: "https://aminoasylum.shop/products/tb-500-5mg" },
];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("TickerItem — data shape", () => {
  it("type must be 'news' or 'price'", () => {
    const items = buildTickerItems(sampleArticles, samplePrices);
    for (const item of items) {
      expect(["news", "price"]).toContain(item.type);
    }
  });

  it("text must be a non-empty string", () => {
    const items = buildTickerItems(sampleArticles, samplePrices);
    for (const item of items) {
      expect(typeof item.text).toBe("string");
      expect(item.text.trim().length).toBeGreaterThan(0);
    }
  });

  it("href is undefined or a valid URL string", () => {
    const items = buildTickerItems(sampleArticles, samplePrices);
    for (const item of items) {
      if (item.href !== undefined) {
        expect(typeof item.href).toBe("string");
        expect(item.href).toMatch(/^https?:\/\//);
      }
    }
  });
});

describe("TickerItem — text truncation", () => {
  it("truncates news titles over 90 characters", () => {
    const longTitle = "x".repeat(100);
    const items = buildTickerItems([{ title: longTitle, sourceUrl: "https://example.com" }], []);
    expect(items[0].text.length).toBeLessThanOrEqual(90);
    expect(items[0].text.endsWith("…")).toBe(true);
  });

  it("does not truncate titles under 90 characters", () => {
    const shortTitle = "BPC-157 promotes gut healing";
    const items = buildTickerItems([{ title: shortTitle, sourceUrl: "https://example.com" }], []);
    expect(items[0].text).toBe(shortTitle);
    expect(items[0].text.endsWith("…")).toBe(false);
  });
});

describe("TickerItem — price insight format", () => {
  it("price items include peptide name, price, and vendor", () => {
    const items = buildTickerItems([], samplePrices);
    const priceItem = items.find((i) => i.type === "price");
    expect(priceItem).toBeDefined();
    expect(priceItem!.text).toMatch(/from \$\d+\.\d{2} at .+/);
  });

  it("price is formatted to 2 decimal places", () => {
    const items = buildTickerItems([], [
      { peptideName: "BPC-157", price: 35.9, vendorName: "Test", productUrl: "https://example.com" },
    ]);
    const priceItem = items.find((i) => i.type === "price");
    expect(priceItem!.text).toContain("$35.90");
  });
});

describe("TickerItem — deduplication", () => {
  it("deduplicates prices by peptide name (keeps first/cheapest)", () => {
    const items = buildTickerItems([], samplePrices);
    const priceItems = items.filter((i) => i.type === "price");
    const peptideNames = priceItems.map((i) => i.text.split(" from")[0]);
    const unique = new Set(peptideNames);
    expect(unique.size).toBe(priceItems.length);
  });

  it("keeps only cheapest price for BPC-157", () => {
    const items = buildTickerItems([], samplePrices);
    const bpcItem = items.find((i) => i.type === "price" && i.text.startsWith("BPC-157"));
    expect(bpcItem!.text).toContain("$35.99"); // cheapest, not $38.99
  });
});

describe("TickerItem — interleaving", () => {
  it("interleaves news and price items", () => {
    const items = buildTickerItems(sampleArticles, samplePrices);
    if (items.length >= 2) {
      // First item should be news (news comes first in interleave)
      expect(items[0].type).toBe("news");
      // Second item should be price (if prices available)
      expect(items[1].type).toBe("price");
    }
  });

  it("returns empty array when both inputs are empty", () => {
    expect(buildTickerItems([], [])).toHaveLength(0);
  });

  it("returns only news items when no prices", () => {
    const items = buildTickerItems(sampleArticles, []);
    expect(items.every((i) => i.type === "news")).toBe(true);
  });

  it("limits news items to 8", () => {
    const manyArticles = Array.from({ length: 20 }, (_, i) => ({
      title: `Article ${i}`,
      sourceUrl: `https://example.com/${i}`,
    }));
    const items = buildTickerItems(manyArticles, []);
    expect(items.filter((i) => i.type === "news").length).toBeLessThanOrEqual(8);
  });

  it("limits price items to 5 unique peptides", () => {
    const manyPrices = Array.from({ length: 20 }, (_, i) => ({
      peptideName: `Peptide-${i}`,
      price: 30 + i,
      vendorName: "TestVendor",
      productUrl: `https://example.com/product-${i}`,
    }));
    const items = buildTickerItems([], manyPrices);
    expect(items.filter((i) => i.type === "price").length).toBeLessThanOrEqual(5);
  });
});
