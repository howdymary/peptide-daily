import { prisma } from "@/lib/db/prisma";
import { cacheDelete } from "@/lib/redis/client";
import { vendorFetchers } from "./registry";
import { logger } from "@/lib/utils/logger";
import type { VendorPeptideData } from "@/types";

/**
 * Aggregation pipeline that:
 *  1. Runs all vendor fetchers
 *  2. Normalizes and upserts data into PostgreSQL
 *  3. Invalidates the Redis cache so fresh data is served
 *
 * Called by the BullMQ background job on a schedule.
 * Can also be triggered manually via admin API.
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
    const vendorName = vendorFetchers[i].vendorName;

    if (result.status === "rejected") {
      const errMsg = `[${vendorName}] Fetch failed: ${result.reason}`;
      errors.push(errMsg);
      logger.error(errMsg);
      continue;
    }

    const products = result.value;

    for (const product of products) {
      try {
        await upsertProduct(product);
        productsUpserted++;
      } catch (err) {
        const errMsg = `[${vendorName}] Failed to upsert ${product.peptideName}: ${err}`;
        errors.push(errMsg);
        logger.error(errMsg);
      }
    }
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
  // Upsert vendor
  const vendor = await prisma.vendor.upsert({
    where: { name: data.vendorName },
    update: { updatedAt: new Date() },
    create: {
      name: data.vendorName,
      slug: slugify(data.vendorName),
      website:
        data.vendorName === "Verified Peptides"
          ? "https://verifiedpeptides.com"
          : data.vendorName === "Peptide Partners"
            ? "https://peptide.partners"
            : `https://${slugify(data.vendorName)}.com`,
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
