import { prisma } from "@/lib/db/prisma";
import { cacheGet, cacheSet } from "@/lib/redis/client";
import type { VendorMappingConfig } from "@/types";

/** Cache TTL for vendor mappings: 30 minutes */
const MAPPING_TTL = 1800;

/**
 * Returns all VendorMapping records enriched with vendor name,
 * used by the admin API and scraping scheduler.
 */
export async function getAllVendorMappings(): Promise<VendorMappingConfig[]> {
  const cacheKey = "vendor-mappings:all";
  const cached = await cacheGet<VendorMappingConfig[]>(cacheKey);
  if (cached) return cached;

  const mappings = await prisma.vendorMapping.findMany({
    include: { vendor: { select: { name: true } } },
    orderBy: { finnrickSlug: "asc" },
  });

  const result: VendorMappingConfig[] = mappings.map((m) => ({
    id: m.id,
    vendorId: m.vendorId,
    vendorName: m.vendor.name,
    finnrickSlug: m.finnrickSlug,
    vendorDomain: m.vendorDomain,
    scrapingEnabled: m.scrapingEnabled,
    scrapingAdapter: m.scrapingAdapter,
    rateLimit: m.rateLimit,
    notes: m.notes,
  }));

  await cacheSet(cacheKey, result, MAPPING_TTL);
  return result;
}

/**
 * Lookup a single VendorMapping by Finnrick slug.
 */
export async function getVendorMappingByFinnrickSlug(
  finnrickSlug: string,
): Promise<VendorMappingConfig | null> {
  const cacheKey = `vendor-mapping:finnrick:${finnrickSlug}`;
  const cached = await cacheGet<VendorMappingConfig>(cacheKey);
  if (cached) return cached;

  const mapping = await prisma.vendorMapping.findUnique({
    where: { finnrickSlug },
    include: { vendor: { select: { name: true } } },
  });

  if (!mapping) return null;

  const result: VendorMappingConfig = {
    id: mapping.id,
    vendorId: mapping.vendorId,
    vendorName: mapping.vendor.name,
    finnrickSlug: mapping.finnrickSlug,
    vendorDomain: mapping.vendorDomain,
    scrapingEnabled: mapping.scrapingEnabled,
    scrapingAdapter: mapping.scrapingAdapter,
    rateLimit: mapping.rateLimit,
    notes: mapping.notes,
  };

  await cacheSet(cacheKey, result, MAPPING_TTL);
  return result;
}

/**
 * Returns only mappings where scrapingEnabled = true.
 * Used by the vendor refresh worker to determine which vendors to scrape.
 */
export async function getScrapableVendors(): Promise<VendorMappingConfig[]> {
  const all = await getAllVendorMappings();
  return all.filter((m) => m.scrapingEnabled && m.scrapingAdapter);
}

/**
 * Resolve a Vendor record by domain name.
 */
export async function resolveVendorByDomain(
  domain: string,
): Promise<{ id: string; name: string; slug: string } | null> {
  const mapping = await prisma.vendorMapping.findFirst({
    where: { vendorDomain: domain },
    include: { vendor: { select: { id: true, name: true, slug: true } } },
  });
  return mapping?.vendor ?? null;
}
