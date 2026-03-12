import { prisma } from "@/lib/db/prisma";
import { cacheDelete } from "@/lib/redis/client";
import { vendorFetchers } from "./registry";
import { logger } from "@/lib/utils/logger";
import { scraperConfigs } from "./scraper-config";
import type { VendorPeptideData } from "@/types";

/**
 * Aggregation pipeline that:
 *  1. Runs all vendor fetchers (in parallel)
 *  2. Normalizes and upserts data into PostgreSQL
 *  3. Updates per-vendor health metrics in VendorMapping
 *  4. Invalidates the Redis cache so fresh data is served
 *
 * Called by the BullMQ background job on a schedule.
 * Can also be triggered manually via admin API.
 *
 * TECH_NOTES — Health metrics are updated here after each aggregation run:
 *  - Successful vendors: lastScrapedAt, activeProducts
 *  - Failed vendors:     scraperErrorCount++, lastScraperError
 * These are exposed via GET /api/admin/vendor-health.
 */

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function runAggregation(): Promise<{
  vendorsProcessed: number;
  productsUpserted: number;
  errors: string[];
}> {
  const startTime = Date.now();
  let productsUpserted = 0;
  const errors: string[] = [];

  logger.info("Starting vendor data aggregation");

  // Fetch from all vendors in parallel
  const results = await Promise.allSettled(
    vendorFetchers.map((fetcher) => fetcher.fetchAll()),
  );

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const fetcher = vendorFetchers[i];
    const vendorName = fetcher.vendorName;
    const vendorSlug = slugify(vendorName);

    if (result.status === "rejected") {
      const errMsg = `[${vendorName}] Fetch failed: ${result.reason}`;
      errors.push(errMsg);
      logger.error(errMsg);
      // Record scraper error in VendorMapping health metrics
      await updateVendorHealth(vendorSlug, { error: String(result.reason) });
      continue;
    }

    const products = result.value;
    let vendorUpserted = 0;

    for (const product of products) {
      try {
        await upsertProduct(product);
        vendorUpserted++;
        productsUpserted++;
      } catch (err) {
        const errMsg = `[${vendorName}] Failed to upsert ${product.peptideName}: ${err}`;
        errors.push(errMsg);
        logger.error(errMsg);
      }
    }

    // Count in_stock products for this vendor and record health
    const inStockCount = products.filter(
      (p) => p.availabilityStatus === "in_stock",
    ).length;
    await updateVendorHealth(vendorSlug, { activeProducts: inStockCount });

    logger.info(
      `[${vendorName}] Upserted ${vendorUpserted}/${products.length} products (${inStockCount} in stock)`,
    );
  }

  // Invalidate cached peptide data
  await cacheDelete("peptides:*");
  await cacheDelete("peptide:*");

  const duration = Date.now() - startTime;
  logger.info(
    `Aggregation complete: ${productsUpserted} products from ${vendorFetchers.length} vendors in ${duration}ms`,
  );

  return {
    vendorsProcessed: vendorFetchers.length,
    productsUpserted,
    errors,
  };
}

async function upsertProduct(data: VendorPeptideData): Promise<void> {
  const vendorSlug = slugify(data.vendorName);

  // Resolve website from scraper config, fall back to slug-based guess
  const cfg = scraperConfigs[vendorSlug];
  const website = cfg?.baseUrl ?? `https://${vendorSlug}.com`;

  // Upsert vendor
  const vendor = await prisma.vendor.upsert({
    where: { name: data.vendorName },
    update: { updatedAt: new Date() },
    create: {
      name: data.vendorName,
      slug: vendorSlug,
      website,
    },
  });

  // Upsert peptide
  const peptide = await prisma.peptide.upsert({
    where: { name: data.peptideName },
    update: { updatedAt: new Date() },
    create: {
      name: data.peptideName,
      slug: slugify(data.peptideName),
    },
  });

  // Upsert price entry
  await prisma.peptidePrice.upsert({
    where: {
      peptideId_vendorId_sku: {
        peptideId: peptide.id,
        vendorId: vendor.id,
        sku: data.sku,
      },
    },
    update: {
      price: data.price,
      currency: data.currency,
      concentration: data.concentration,
      productUrl: data.productUrl,
      availabilityStatus: data.availabilityStatus,
      lastUpdated: data.lastUpdated,
    },
    create: {
      peptideId: peptide.id,
      vendorId: vendor.id,
      price: data.price,
      currency: data.currency,
      concentration: data.concentration,
      sku: data.sku,
      productUrl: data.productUrl,
      availabilityStatus: data.availabilityStatus,
      lastUpdated: data.lastUpdated,
    },
  });
}

/** Update health metrics in the VendorMapping for a given vendor slug. */
async function updateVendorHealth(
  vendorSlug: string,
  update: { error?: string; activeProducts?: number },
): Promise<void> {
  try {
    // Find vendor by slug, then its mapping
    const vendor = await prisma.vendor.findUnique({
      where: { slug: vendorSlug },
      select: { id: true },
    });
    if (!vendor) return;

    const mapping = await prisma.vendorMapping.findUnique({
      where: { vendorId: vendor.id },
      select: { id: true, scraperErrorCount: true },
    });
    if (!mapping) return;

    if (update.error !== undefined) {
      await prisma.vendorMapping.update({
        where: { id: mapping.id },
        data: {
          lastScraperError: update.error,
          scraperErrorCount: { increment: 1 },
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.vendorMapping.update({
        where: { id: mapping.id },
        data: {
          lastScrapedAt: new Date(),
          activeProducts: update.activeProducts ?? 0,
          lastScraperError: null,
          updatedAt: new Date(),
        },
      });
    }
  } catch (err) {
    // Health update is best-effort — don't fail the whole aggregation
    logger.warn(`Failed to update vendor health for ${vendorSlug}`, {
      metadata: { error: (err as Error).message },
    });
  }
}

/**
 * Detect duplicate vendor domains: vendors sharing the same domain in
 * VendorMapping but with different IDs. Returns pairs of duplicates.
 * Called from the admin health dashboard.
 */
export async function detectDuplicateVendors(): Promise<
  { domain: string; vendors: { id: string; name: string; slug: string }[] }[]
> {
  const mappings = await prisma.vendorMapping.findMany({
    where: { vendorDomain: { not: null } },
    include: { vendor: { select: { id: true, name: true, slug: true } } },
  });

  const byDomain = new Map<string, { id: string; name: string; slug: string }[]>();
  for (const m of mappings) {
    if (!m.vendorDomain) continue;
    const domain = m.vendorDomain.toLowerCase().replace(/^www\./, "");
    if (!byDomain.has(domain)) byDomain.set(domain, []);
    byDomain.get(domain)!.push(m.vendor);
  }

  return [...byDomain.entries()]
    .filter(([, vendors]) => vendors.length > 1)
    .map(([domain, vendors]) => ({ domain, vendors }));
}

/**
 * Returns per-vendor health metrics for the admin dashboard.
 * Includes freshness indicator: data is "stale" if not scraped in 7+ days.
 */
export async function getVendorHealthReport(): Promise<
  {
    vendorName: string;
    vendorSlug: string;
    domain: string | null;
    status: string;
    vendorType: string;
    scrapingEnabled: boolean;
    lastScrapedAt: string | null;
    activeProducts: number;
    errorCount: number;
    lastError: string | null;
    isStale: boolean;
  }[]
> {
  const mappings = await prisma.vendorMapping.findMany({
    include: { vendor: { select: { name: true, slug: true } } },
    orderBy: { vendor: { name: "asc" } },
  });

  const staleDays = 7;
  const staleMs = staleDays * 24 * 60 * 60 * 1000;
  const now = Date.now();

  return mappings.map((m) => ({
    vendorName: m.vendor.name,
    vendorSlug: m.vendor.slug,
    domain: m.vendorDomain,
    status: m.statusFlag,
    vendorType: m.vendorType,
    scrapingEnabled: m.scrapingEnabled,
    lastScrapedAt: m.lastScrapedAt?.toISOString() ?? null,
    activeProducts: m.activeProducts,
    errorCount: m.scraperErrorCount,
    lastError: m.lastScraperError,
    isStale: m.lastScrapedAt
      ? now - m.lastScrapedAt.getTime() > staleMs
      : true,
  }));
}
