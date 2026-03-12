/**
 * GET /api/admin/debug
 *
 * Internal debug view data for the admin dashboard:
 *  - Recent news articles with peptide tags
 *  - Recent price ingestion entries with anomaly flags
 *    (price spike/drop: ±50% from median across vendors for that peptide)
 *  - News source health (lastFetchedAt, errorCount per source)
 *
 * Requires ADMIN role.
 */

import { requireRole } from "@/lib/auth/helpers";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";

export async function GET() {
  const authError = await requireRole("ADMIN");
  if (authError) return authError;

  try {
    const [recentArticles, recentPrices, newsSources] = await Promise.all([
      // Last 20 ingested news articles with tags
      prisma.newsArticle.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          title: true,
          sourceUrl: true,
          publishedAt: true,
          createdAt: true,
          tags: true,
          isHidden: true,
          isEditorsPick: true,
          source: { select: { name: true, slug: true } },
        },
      }),

      // Last 50 price records updated, across vendors
      prisma.peptidePrice.findMany({
        orderBy: { lastUpdated: "desc" },
        take: 50,
        select: {
          id: true,
          price: true,
          concentration: true,
          availabilityStatus: true,
          lastUpdated: true,
          productUrl: true,
          peptide: { select: { name: true, slug: true } },
          vendor: { select: { name: true, slug: true } },
        },
      }),

      // All news sources with health stats
      prisma.newsSource.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          feedUrl: true,
          isActive: true,
          robotsTxtAllows: true,
          lastFetchedAt: true,
          lastFetchStatus: true,
          lastFetchError: true,
          fetchCount: true,
          errorCount: true,
          _count: { select: { articles: true } },
        },
      }),
    ]);

    // Flag prices that look anomalous:
    // mark as anomalous if price is >1.5× or <0.5× the per-peptide median
    const pricesByPeptide = new Map<string, number[]>();
    for (const p of recentPrices) {
      const key = p.peptide.name;
      if (!pricesByPeptide.has(key)) pricesByPeptide.set(key, []);
      pricesByPeptide.get(key)!.push(Number(p.price));
    }

    const annotatedPrices = recentPrices.map((p) => {
      const prices = pricesByPeptide.get(p.peptide.name) ?? [];
      const sorted = [...prices].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)] ?? Number(p.price);
      const ratio = Number(p.price) / median;
      return {
        ...p,
        price: Number(p.price),
        lastUpdated: p.lastUpdated.toISOString(),
        anomaly: ratio > 1.5 ? "spike" : ratio < 0.5 ? "drop" : null,
        medianPrice: median,
      };
    });

    const anomalies = annotatedPrices.filter((p) => p.anomaly !== null);

    return successResponse({
      data: {
        recentArticles: recentArticles.map((a) => ({
          ...a,
          publishedAt: a.publishedAt.toISOString(),
          createdAt: a.createdAt.toISOString(),
        })),
        recentPrices: annotatedPrices,
        anomalies,
        newsSources: newsSources.map((s) => ({
          ...s,
          articleCount: s._count.articles,
          lastFetchedAt: s.lastFetchedAt?.toISOString() ?? null,
          isStale: s.lastFetchedAt
            ? Date.now() - s.lastFetchedAt.getTime() > 24 * 60 * 60 * 1000
            : true,
        })),
      },
    });
  } catch (err) {
    logger.error("GET /api/admin/debug failed", {
      metadata: { error: (err as Error).message },
    });
    return errorResponse("Failed to fetch debug data", 500);
  }
}
