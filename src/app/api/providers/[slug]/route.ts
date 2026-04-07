import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import { errorResponse, successResponse } from "@/lib/utils/api-response";
import { cacheGet, cacheSet } from "@/lib/redis/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  try {
    const { slug } = await params;
    const cacheKey = `providers:detail:${slug}`;
    const cached = await cacheGet(cacheKey);

    if (cached) {
      return successResponse(cached);
    }

    const provider = await prisma.provider.findUnique({
      where: { slug, isActive: true },
    });

    if (!provider) {
      return errorResponse("Provider not found", 404);
    }

    await cacheSet(cacheKey, provider, 600);

    return successResponse(provider);
  } catch (error) {
    console.error("[API] GET /api/providers/[slug] error:", error);
    return errorResponse("Failed to fetch provider", 500);
  }
}
