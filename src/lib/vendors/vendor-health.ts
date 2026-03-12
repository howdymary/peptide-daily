/**
 * Vendor health queries for the admin dashboard.
 *
 * Intentionally separated from aggregator.ts so this module does NOT import
 * registry.ts → base-fetcher.ts → env.ts. That import chain causes
 * Next.js build failures when env vars are absent at build time.
 */

import { prisma } from "@/lib/db/prisma";

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

  const staleMs = 7 * 24 * 60 * 60 * 1000;
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
    isStale: m.lastScrapedAt ? now - m.lastScrapedAt.getTime() > staleMs : true,
  }));
}
