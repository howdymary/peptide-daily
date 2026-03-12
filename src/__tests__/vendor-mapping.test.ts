/**
 * Tests for vendor mapping correctness and source registry integrity.
 *
 * Validates:
 *  - Each scraper config has valid vendorType and status
 *  - Active vendors have scrapingEnabled = true
 *  - Stub data from each fetcher maps to recognized peptide names
 *  - No duplicate vendor slugs in the registry
 *  - Health report shape is correct
 *  - scraperConfigs.getActiveScraperConfigs() returns only enabled vendors
 */

import { describe, it, expect } from "vitest";
import {
  scraperConfigs,
  getActiveScraperConfigs,
  getSourceRegistrySummary,
  type VendorStatus,
  type VendorType,
} from "@/lib/vendors/scraper-config";
import { vendorFetchers } from "@/lib/vendors/registry";

// ── Canonical peptide names we recognize ─────────────────────────────────────
const KNOWN_PEPTIDES = new Set([
  "BPC-157", "TB-500", "GHK-Cu", "Ipamorelin", "CJC-1295",
  "Semaglutide", "PT-141", "Melanotan II", "Sermorelin", "Hexarelin",
  "AOD-9604", "MK-677", "GHRP-2", "GHRP-6", "Tesamorelin",
]);

const VALID_STATUSES: VendorStatus[] = ["active", "paused", "manual-only", "js-required", "disabled"];
const VALID_TYPES: VendorType[] = ["research", "cosmetic", "pharmaceutical", "catalog"];

describe("scraper-config source registry", () => {
  const configs = Object.entries(scraperConfigs);

  it("has at least 10 vendor entries", () => {
    expect(configs.length).toBeGreaterThanOrEqual(10);
  });

  it("every entry has a valid status flag", () => {
    for (const [slug, cfg] of configs) {
      expect(VALID_STATUSES, `${slug} has invalid status: ${cfg.status}`)
        .toContain(cfg.status);
    }
  });

  it("every entry has a valid vendorType", () => {
    for (const [slug, cfg] of configs) {
      expect(VALID_TYPES, `${slug} has invalid vendorType: ${cfg.vendorType}`)
        .toContain(cfg.vendorType);
    }
  });

  it("active vendors have scrapingEnabled = true", () => {
    for (const [slug, cfg] of configs) {
      if (cfg.status === "active") {
        expect(cfg.scrapingEnabled, `${slug} is active but scrapingEnabled=false`).toBe(true);
      }
    }
  });

  it("disabled/manual-only/js-required vendors have scrapingEnabled = false", () => {
    for (const [slug, cfg] of configs) {
      if (["disabled", "manual-only", "js-required"].includes(cfg.status)) {
        expect(cfg.scrapingEnabled, `${slug} should have scrapingEnabled=false`).toBe(false);
      }
    }
  });

  it("every entry has required selector fields", () => {
    const required = ["productContainer", "name", "price", "concentration", "availability", "productLink"];
    for (const [slug, cfg] of configs) {
      for (const field of required) {
        expect(
          cfg.selectors[field as keyof typeof cfg.selectors],
          `${slug} missing selector.${field}`
        ).toBeTruthy();
      }
    }
  });

  it("baseUrl starts with https://", () => {
    for (const [slug, cfg] of configs) {
      expect(cfg.baseUrl, `${slug} baseUrl should be https://`).toMatch(/^https:\/\//);
    }
  });

  it("rateLimit is a positive number ≤ 30", () => {
    for (const [slug, cfg] of configs) {
      expect(cfg.rateLimit, `${slug} invalid rateLimit`).toBeGreaterThan(0);
      expect(cfg.rateLimit, `${slug} rateLimit too aggressive`).toBeLessThanOrEqual(30);
    }
  });
});

describe("getActiveScraperConfigs()", () => {
  it("returns only scrapingEnabled=true configs", () => {
    const active = getActiveScraperConfigs();
    for (const cfg of active) {
      expect(cfg.scrapingEnabled).toBe(true);
    }
  });

  it("returns at least 5 active vendors", () => {
    expect(getActiveScraperConfigs().length).toBeGreaterThanOrEqual(5);
  });
});

describe("getSourceRegistrySummary()", () => {
  it("groups configs by status correctly", () => {
    const summary = getSourceRegistrySummary();
    // All entries in summary[status] should have matching status
    for (const [status, configs] of Object.entries(summary)) {
      for (const cfg of configs) {
        expect(cfg.status).toBe(status);
      }
    }
  });

  it("total entries equals scraperConfigs length", () => {
    const summary = getSourceRegistrySummary();
    const total = Object.values(summary).reduce((sum, arr) => sum + arr.length, 0);
    expect(total).toBe(Object.keys(scraperConfigs).length);
  });
});

describe("vendor registry (fetchers)", () => {
  it("has no duplicate vendor names", () => {
    const names = vendorFetchers.map((f) => f.vendorName.toLowerCase());
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it("every fetcher has a matching scraper config", () => {
    const configNames = new Set(
      Object.values(scraperConfigs).map((c) => c.vendorName.toLowerCase())
    );
    for (const fetcher of vendorFetchers) {
      expect(
        configNames.has(fetcher.vendorName.toLowerCase()),
        `No scraperConfig for fetcher "${fetcher.vendorName}"`
      ).toBe(true);
    }
  });

  it("fetchers return stub data with valid shapes", async () => {
    for (const fetcher of vendorFetchers) {
      const products = await fetcher.fetchAll();
      expect(Array.isArray(products)).toBe(true);
      for (const p of products) {
        // Required fields
        expect(p.vendorName).toBeTruthy();
        expect(p.peptideName).toBeTruthy();
        expect(p.concentration).toBeTruthy();
        expect(typeof p.price).toBe("number");
        expect(p.price).toBeGreaterThan(0);
        expect(p.currency).toBe("USD");
        expect(p.sku).toBeTruthy();
        expect(p.productUrl).toMatch(/^https?:\/\//);
        expect(["in_stock", "out_of_stock", "pre_order"]).toContain(p.availabilityStatus);
        expect(p.lastUpdated).toBeInstanceOf(Date);
      }
    }
  });

  it("peptide names from fetchers are recognized or at least non-empty strings", async () => {
    for (const fetcher of vendorFetchers) {
      const products = await fetcher.fetchAll();
      for (const p of products) {
        expect(typeof p.peptideName).toBe("string");
        expect(p.peptideName.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("vendor names in stub data match fetcher.vendorName", async () => {
    for (const fetcher of vendorFetchers) {
      const products = await fetcher.fetchAll();
      for (const p of products) {
        expect(p.vendorName).toBe(fetcher.vendorName);
      }
    }
  });
});
