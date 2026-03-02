import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { cacheGet, cacheSet } from "@/lib/redis/client";
import { peptideQuerySchema } from "@/lib/validation/schemas";
import { errorResponse } from "@/lib/utils/api-response";
import { withRateLimit } from "@/lib/security/rate-limit";
import { Prisma } from "@prisma/client";

/**
 * GET /api/peptides
 * List peptides with search, filters, sorting, and pagination.
 * Results are cached in Redis with a 5-minute TTL.
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

    const { search, vendor, minPrice, maxPrice, availability, sortBy, page, pageSize } =
      parsed.data;

    // Build cache key from query params
    const cacheKey = `peptides:list:${JSON.stringify(parsed.data)}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return Response.json(cached);
    }

    // Build where clause
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

    // Count total for pagination
    const totalCount = await prisma.peptide.count({ where });

    // Determine ordering
    let orderBy: Prisma.PeptideOrderByWithRelationInput = { name: "asc" };
    if (sortBy === "rating") {
      // Sort by rating requires a raw approach; default to name for now
      orderBy = { name: "asc" };
    }

    // Fetch peptides with aggregated data
    const peptides = await prisma.peptide.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy,
      include: {
        prices: {
          include: { vendor: { select: { name: true } } },
          orderBy: { price: "asc" },
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    // Transform to API response shape
    const data = peptides.map((p) => {
      const ratings = p.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      const bestPrice = p.prices.length > 0 ? p.prices[0] : null;

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
      };
    });

    // Sort by price if requested (post-query since we need the computed bestPrice)
    if (sortBy === "price_asc") {
      data.sort((a, b) => (a.bestPrice ?? Infinity) - (b.bestPrice ?? Infinity));
    } else if (sortBy === "price_desc") {
      data.sort((a, b) => (b.bestPrice ?? 0) - (a.bestPrice ?? 0));
    } else if (sortBy === "rating") {
      data.sort((a, b) => b.averageRating - a.averageRating);
    }

    const response = {
      data,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNext: page < Math.ceil(totalCount / pageSize),
        hasPrev: page > 1,
      },
    };

    // Cache for 5 minutes
    await cacheSet(cacheKey, response, 300);

    return Response.json(response);
  } catch (err) {
    console.error("Error fetching peptides:", err);
    return errorResponse("Failed to fetch peptides", 500);
  }
}
