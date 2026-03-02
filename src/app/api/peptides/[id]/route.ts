import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { cacheGet, cacheSet } from "@/lib/redis/client";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { withRateLimit } from "@/lib/security/rate-limit";

/**
 * GET /api/peptides/:id
 * Fetch a single peptide with all vendor prices and reviews.
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

    // Try finding by slug first, then by ID
    const peptide = await prisma.peptide.findFirst({
      where: {
        OR: [{ slug: id }, { id }],
      },
      include: {
        prices: {
          include: {
            vendor: {
              select: { name: true, slug: true, website: true },
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
      },
    });

    if (!peptide) {
      return errorResponse("Peptide not found", 404);
    }

    // Compute aggregated data
    const ratings = peptide.reviews.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    const bestPrice = peptide.prices.length > 0 ? peptide.prices[0] : null;

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
      prices: peptide.prices.map((p) => ({
        id: p.id,
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
      })),
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
