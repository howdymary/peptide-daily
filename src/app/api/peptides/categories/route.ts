import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import { errorResponse, successResponse } from "@/lib/utils/api-response";
import { cacheGet, cacheSet } from "@/lib/redis/client";

export async function GET(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  try {
    const cacheKey = "peptides:categories";
    const cached = await cacheGet(cacheKey);

    if (cached) {
      return successResponse(cached);
    }

    const categories = await prisma.peptideCategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: { select: { peptides: true } },
      },
    });

    const result = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      displayOrder: c.displayOrder,
      peptideCount: c._count.peptides,
    }));

    await cacheSet(cacheKey, result, 3600);

    return successResponse(result);
  } catch (error) {
    console.error("[API] GET /api/peptides/categories error:", error);
    return errorResponse("Failed to fetch categories", 500);
  }
}
