/**
 * GET /api/homepage
 *
 * Single-round-trip aggregate endpoint for the homepage.
 * Returns:
 *   featuredNews    — 6 most recent non-hidden articles
 *   editorsPicks    — up to 3 editor's picks
 *   guides          — all published guides (sorted by category + order)
 *   trendingPeptides — top 4 peptides by trust score with price snapshots
 *   newsSources     — source health summary
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import { errorResponse } from "@/lib/utils/api-response";
import { cacheGet, cacheSet } from "@/lib/redis/client";
import { computeTrustScore, bestFinnrickGrade } from "@/lib/finnrick/trust-score";
import type { FinnrickRatingItem, FinnrickGrade } from "@/types";

export async function GET(req: NextRequest) {
  const limited = await withRateLimit(req);
  if (limited) return limited;

  try {
    const cacheKey = "homepage:aggregate";
    const cached = await cacheGet(cacheKey);
    if (cached) return Response.json(cached);

    const [featuredNews, editorsPicks, guides, peptides, sources] =
      await Promise.all([
        // Latest 6 articles
        prisma.newsArticle.findMany({
          where: { isHidden: false },
          orderBy: { publishedAt: "desc" },
          take: 6,
          include: { source: { select: { name: true, slug: true, siteUrl: true } } },
        }),

        // Editor's picks (up to 3)
        prisma.newsArticle.findMany({
          where: { isHidden: false, isEditorsPick: true },
          orderBy: { publishedAt: "desc" },
          take: 3,
          include: { source: { select: { name: true, slug: true, siteUrl: true } } },
        }),

        // Published guides
        prisma.guide.findMany({
          where: { isPublished: true },
          orderBy: [{ category: "asc" }, { order: "asc" }],
        }),

        // Peptides with prices + Finnrick data
        prisma.peptide.findMany({
          include: {
            prices: {
              include: { vendor: { select: { name: true, slug: true } } },
              orderBy: { price: "asc" },
            },
            reviews: { select: { rating: true } },
            finnrickRatings: {
              select: {
                grade: true,
                averageScore: true,
                testCount: true,
                minScore: true,
                maxScore: true,
                oldestTestDate: true,
                newestTestDate: true,
                finnrickUrl: true,
                vendor: { select: { slug: true } },
              },
            },
          },
        }),

        // Source health
        prisma.newsSource.findMany({
          select: {
            name: true,
            slug: true,
            isActive: true,
            robotsTxtAllows: true,
            lastFetchedAt: true,
            lastFetchStatus: true,
            fetchCount: true,
            errorCount: true,
          },
          orderBy: { name: "asc" },
        }),
      ]);

    // ── Build trending peptides ─────────────────────────────────────────

    const gradeOrder: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };

    const peptideSnapshots = peptides
      .map((p) => {
        const avgRating =
          p.reviews.length > 0
            ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
            : 0;

        const bestPrice = p.prices[0] ?? null;
        const topGrade = bestFinnrickGrade(p.finnrickRatings);

        let trustScore = null;
        if (bestPrice) {
          const finnrickForBest = p.finnrickRatings.find(
            (r) => r.vendor.slug === bestPrice.vendor.slug,
          );
          const finnrickItem: FinnrickRatingItem | null = finnrickForBest
            ? {
                grade: finnrickForBest.grade as FinnrickGrade,
                averageScore: Number(finnrickForBest.averageScore),
                testCount: finnrickForBest.testCount,
                minScore: Number(finnrickForBest.minScore),
                maxScore: Number(finnrickForBest.maxScore),
                oldestTestDate: finnrickForBest.oldestTestDate.toISOString(),
                newestTestDate: finnrickForBest.newestTestDate.toISOString(),
                finnrickUrl: finnrickForBest.finnrickUrl,
              }
            : null;

          const prices = p.prices.map((pr) => Number(pr.price)).sort((a, b) => a - b);
          const median = prices[Math.floor(prices.length / 2)] ?? null;

          trustScore = computeTrustScore({
            finnrickRating: finnrickItem,
            averageReviewRating: avgRating,
            reviewCount: p.reviews.length,
            priceRelativeToMedian:
              median && median > 0 ? Number(bestPrice.price) / median : undefined,
          });
        }

        // Top 3 vendors for the snapshot
        const topVendors = p.prices.slice(0, 3).map((pr) => ({
          vendorName: pr.vendor.name,
          vendorSlug: pr.vendor.slug,
          price: Number(pr.price),
          currency: pr.currency,
        }));

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          category: p.category,
          bestPrice: bestPrice ? Number(bestPrice.price) : null,
          bestPriceVendor: bestPrice?.vendor.name ?? null,
          priceCount: p.prices.length,
          bestFinnrickGrade: topGrade,
          trustScore,
          topVendors,
        };
      })
      .sort(
        (a, b) =>
          (b.trustScore?.overall ?? 0) - (a.trustScore?.overall ?? 0) ||
          (gradeOrder[b.bestFinnrickGrade ?? ""] ?? 0) -
            (gradeOrder[a.bestFinnrickGrade ?? ""] ?? 0),
      )
      .slice(0, 4);

    // ── Collect all unique tags for the news filter bar ─────────────────

    const allTags = [
      ...new Set(featuredNews.flatMap((a) => a.tags)),
    ].sort();

    // ── Build response ──────────────────────────────────────────────────

    const serializeArticle = (a: (typeof featuredNews)[0]) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      sourceUrl: a.sourceUrl,
      excerpt: a.excerpt,
      author: a.author,
      publishedAt: a.publishedAt.toISOString(),
      tags: a.tags,
      isEditorsPick: a.isEditorsPick,
      isPinned: a.isPinned,
      source: a.source,
    });

    const response = {
      featuredNews: featuredNews.map(serializeArticle),
      editorsPicks: editorsPicks.map(serializeArticle),
      guides: guides.map((g) => ({
        id: g.id,
        title: g.title,
        slug: g.slug,
        excerpt: g.excerpt,
        category: g.category,
        readingTime: g.readingTime,
        order: g.order,
      })),
      trendingPeptides: peptideSnapshots,
      allTags,
      sources: sources.map((s) => ({
        name: s.name,
        slug: s.slug,
        isActive: s.isActive,
        robotsTxtAllows: s.robotsTxtAllows,
        lastFetchedAt: s.lastFetchedAt?.toISOString() ?? null,
        lastFetchStatus: s.lastFetchStatus,
        fetchCount: s.fetchCount,
        errorCount: s.errorCount,
      })),
    };

    await cacheSet(cacheKey, response, 300); // 5-min cache
    return Response.json(response);
  } catch (err) {
    console.error("Error fetching homepage data:", err);
    return errorResponse("Failed to fetch homepage data", 500);
  }
}
