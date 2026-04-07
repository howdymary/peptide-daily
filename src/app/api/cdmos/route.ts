import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import { errorResponse, successResponse } from "@/lib/utils/api-response";
import { cacheGet, cacheSet } from "@/lib/redis/client";

export async function GET(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  try {
    const cacheKey = "cdmos:list";
    const cached = await cacheGet(cacheKey);
    if (cached) return successResponse(cached);

    const cdmos = await prisma.cdmo.findMany({
      where: { isActive: true },
      orderBy: [{ fdaRegistered: "desc" }, { name: "asc" }],
    });

    await cacheSet(cacheKey, cdmos, 3600);
    return successResponse(cdmos);
  } catch (error) {
    console.error("[API] GET /api/cdmos error:", error);
    return errorResponse("Failed to fetch manufacturers", 500);
  }
}
