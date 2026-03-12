import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { cacheGet, cacheSet } from "@/lib/redis/client";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { withRateLimit } from "@/lib/security/rate-limit";
import { computeTrustScore, bestFinnrickGrade } from "@/lib/finnrick/trust-score";
import type { FinnrickRatingItem, FinnrickGrade, FinnrickTestItem } from "@/types";

/**
 * GET /api/peptides/:id
 * Fetch a single peptide with all vendor prices, reviews, and Finnrick ratings.
 * Accepts either a cuid ID or a slug.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  try {
    const { id } = await params;
    const cacheKey = `peptide:${id}`;

    const cached = await cacheGet(cacheKey);
    if (cached) {
      return Response.json(cached);
    }

    const peptide = await prisma.peptide.findFirst({
      where: {
        OR: [{ slug: id }, { id }],
      },
      include: {
        prices: {
          include: {
            vendor: {
              select: { id: true, name: true, slug: true, website: true },
            },
          },
          orderBy: { price: "asc" },
        },
        reviews: {
          where: { flagged: false },
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        finnrickRatings: {
          include: {
            tests: {
              orderBy: { testDate: "desc" },
              take: 10,
            },
            vendor: { select: { slug: true } },
          },
        },
      },
    });

    if (!peptide) {
      return errorResponse("Peptide not found", 404);
    }

    const ratings = peptide.reviews.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    const bestPrice = peptide.prices.length > 0 ? peptide.prices[0] : null;

    // Build finnrickRatings map keyed by vendor slug (both DTO and raw tests)
    const finnrickRatingsMap: Record<string, FinnrickRatingItem> = {};
    const finnrickTestsMap: Record<string, FinnrickTestItem[]> = {};
    for (const fr of peptide.finnrickRatings) {
      finnrickRatingsMap[fr.vendor.slug] = {
        grade: fr.grade as FinnrickGrade,
        averageScore: Number(fr.averageScore),
        testCount: fr.testCount,
        minScore: Number(fr.minScore),
        maxScore: Number(fr.maxScore),
        oldestTestDate: fr.oldestTestDate.toISOString(),
        newestTestDate: fr.newestTestDate.toISOString(),
        finnrickUrl: fr.finnrickUrl,
      };
      finnrickTestsMap[fr.vendor.slug] = fr.tests.map((t) => ({
        id: t.id,
        testDate: t.testDate.toISOString(),
        testScore: Number(t.testScore),
        advertisedQuantity: Number(t.advertisedQuantity),
        actualQuantity: Number(t.actualQuantity),
        quantityVariance: Number(t.quantityVariance),
        purity: Number(t.purity),
        batchId: t.batchId,
        containerType: t.containerType,
        labId: t.labId,
        source: t.source,
        endotoxinsStatus: t.endotoxinsStatus,
        certificateLink: t.certificateLink,
        identityResult: t.identityResult,
      }));
    }

    // Pricing signal: median price across vendors
    const allPrices = peptide.prices.map((pr) => Number(pr.price)).sort((a, b) => a - b);
    const median = allPrices.length > 0 ? allPrices[Math.floor(allPrices.length / 2)] : null;

    const response = {
      id: peptide.id,
      name: peptide.name,
      slug: peptide.slug,
      description: peptide.description,
      category: peptide.category,
      sequence: peptide.sequence,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: ratings.length,
      bestPrice: bestPrice ? Number(bestPrice.price) : null,
      bestPriceVendor: bestPrice ? bestPrice.vendor.name : null,
      priceCount: peptide.prices.length,
      bestFinnrickGrade: bestFinnrickGrade(Object.values(finnrickRatingsMap)),
      trustScore: bestPrice
        ? computeTrustScore({
            finnrickRating: finnrickRatingsMap[bestPrice.vendor.slug] ?? null,
            averageReviewRating: avgRating,
            reviewCount: ratings.length,
            priceRelativeToMedian:
              median && median > 0 ? Number(bestPrice.price) / median : undefined,
          })
        : null,
      finnrickRatings: finnrickRatingsMap,
      prices: peptide.prices.map((p) => {
        const vendorFinnrick = finnrickRatingsMap[p.vendor.slug] ?? null;
        const trustScore = computeTrustScore({
          finnrickRating: vendorFinnrick,
          averageReviewRating: avgRating,
          reviewCount: ratings.length,
          priceRelativeToMedian:
            median && median > 0 ? Number(p.price) / median : undefined,
        });
        return {
          id: p.id,
          vendorId: p.vendor.id,
          vendorName: p.vendor.name,
          vendorSlug: p.vendor.slug,
          vendorWebsite: p.vendor.website,
          price: Number(p.price),
          currency: p.currency,
          concentration: p.concentration,
          sku: p.sku,
          productUrl: p.productUrl,
          availabilityStatus: p.availabilityStatus,
          lastUpdated: p.lastUpdated,
          finnrickRating: vendorFinnrick,
          trustScore,
          finnrickTests: finnrickTestsMap[p.vendor.slug] ?? [],
        };
      }),
      reviews: peptide.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        user: {
          id: r.user.id,
          name: r.user.name,
          image: r.user.image,
        },
      })),
    };

    await cacheSet(cacheKey, response, 300);
    return successResponse(response);
  } catch (err) {
    console.error("Error fetching peptide:", err);
    return errorResponse("Failed to fetch peptide", 500);
  }
}
