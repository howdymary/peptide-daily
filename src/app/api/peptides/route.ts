import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { cacheGet, cacheSet } from "@/lib/redis/client";
import { peptideQuerySchema } from "@/lib/validation/schemas";
import { errorResponse } from "@/lib/utils/api-response";
import { withRateLimit } from "@/lib/security/rate-limit";
import { computeTrustScore, GRADE_ORDER, bestFinnrickGrade } from "@/lib/finnrick/trust-score";
import type { FinnrickRatingItem, FinnrickGrade } from "@/types";
import { Prisma } from "@prisma/client";

/**
 * GET /api/peptides
 * List peptides with search, filters, sorting, and pagination.
 * Results are cached in Redis with a 5-minute TTL.
 *
 * Finnrick filters: finnrickGrade, minFinnrickScore
 * Extended sorts: finnrick_rating, trust_score
 */
export async function GET(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const parsed = peptideQuerySchema.safeParse(params);

    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues.map((i) => i.message).join(", "),
        422,
      );
    }

    const {
      search,
      vendor,
      minPrice,
      maxPrice,
      availability,
      finnrickGrade,
      minFinnrickScore,
      sortBy,
      page,
      pageSize,
    } = parsed.data;

    const cacheKey = `peptides:list:${JSON.stringify(parsed.data)}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return Response.json(cached);
    }

    const where: Prisma.PeptideWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    if (vendor || minPrice !== undefined || maxPrice !== undefined || availability) {
      where.prices = {
        some: {
          ...(vendor
            ? { vendor: { name: { contains: vendor, mode: "insensitive" } } }
            : {}),
          ...(minPrice !== undefined ? { price: { gte: minPrice } } : {}),
          ...(maxPrice !== undefined ? { price: { lte: maxPrice } } : {}),
          ...(availability ? { availabilityStatus: availability } : {}),
        },
      };
    }

    if (finnrickGrade || minFinnrickScore !== undefined) {
      where.finnrickRatings = {
        some: {
          ...(finnrickGrade ? { grade: finnrickGrade } : {}),
          ...(minFinnrickScore !== undefined
            ? { averageScore: { gte: minFinnrickScore } }
            : {}),
        },
      };
    }

    const totalCount = await prisma.peptide.count({ where });
    const orderBy: Prisma.PeptideOrderByWithRelationInput = { name: "asc" };

    const peptides = await prisma.peptide.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy,
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
    });

    const data = peptides.map((p) => {
      const ratings = p.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      const bestPrice = p.prices.length > 0 ? p.prices[0] : null;

      const topFinnrickGrade = bestFinnrickGrade(p.finnrickRatings);

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
        const median = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : null;

        trustScore = computeTrustScore({
          finnrickRating: finnrickItem,
          averageReviewRating: avgRating,
          reviewCount: ratings.length,
          priceRelativeToMedian:
            median && median > 0 ? Number(bestPrice.price) / median : undefined,
        });
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: p.category,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: ratings.length,
        bestPrice: bestPrice ? Number(bestPrice.price) : null,
        bestPriceVendor: bestPrice ? bestPrice.vendor.name : null,
        priceCount: p.prices.length,
        bestFinnrickGrade: topFinnrickGrade,
        trustScore,
      };
    });

    if (sortBy === "price_asc") {
      data.sort((a, b) => (a.bestPrice ?? Infinity) - (b.bestPrice ?? Infinity));
    } else if (sortBy === "price_desc") {
      data.sort((a, b) => (b.bestPrice ?? 0) - (a.bestPrice ?? 0));
    } else if (sortBy === "rating") {
      data.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === "finnrick_rating") {
      data.sort(
        (a, b) =>
          (GRADE_ORDER[b.bestFinnrickGrade ?? ""] ?? 0) -
          (GRADE_ORDER[a.bestFinnrickGrade ?? ""] ?? 0),
      );
    } else if (sortBy === "trust_score") {
      data.sort(
        (a, b) => (b.trustScore?.overall ?? 0) - (a.trustScore?.overall ?? 0),
      );
    }

    const totalPages = Math.ceil(totalCount / pageSize);
    const response = {
      data,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    await cacheSet(cacheKey, response, 300);
    return Response.json(response);
  } catch (err) {
    console.error("Error fetching peptides:", err);
    return errorResponse("Failed to fetch peptides", 500);
  }
}
