import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import {
  errorResponse,
  paginatedResponse,
} from "@/lib/utils/api-response";
import {
  providerQuerySchema,
  buildProviderWhere,
} from "@/lib/providers/search";
import { cacheGet, cacheSet } from "@/lib/redis/client";

export async function GET(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const parsed = providerQuerySchema.safeParse(params);

    if (!parsed.success) {
      return errorResponse("Invalid query parameters", 400);
    }

    const query = parsed.data;
    const cacheKey = `providers:list:${JSON.stringify(query)}`;
    const cached = await cacheGet<{ data: unknown[]; total: number }>(cacheKey);

    if (cached) {
      return paginatedResponse(
        cached.data,
        query.page,
        query.pageSize,
        cached.total,
      );
    }

    const where = buildProviderWhere(query);
    const skip = (query.page - 1) * query.pageSize;

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        skip,
        take: query.pageSize,
        orderBy: [{ fdaRegistered: "desc" }, { cpsVerified: "desc" }, { name: "asc" }],
      }),
      prisma.provider.count({ where }),
    ]);

    await cacheSet(cacheKey, { data: providers, total }, 600);

    return paginatedResponse(providers, query.page, query.pageSize, total);
  } catch (error) {
    console.error("[API] GET /api/providers error:", error);
    return errorResponse("Failed to fetch providers", 500);
  }
}
