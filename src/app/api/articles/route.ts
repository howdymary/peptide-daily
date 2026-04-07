import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import { errorResponse, paginatedResponse } from "@/lib/utils/api-response";
import { cacheGet, cacheSet } from "@/lib/redis/client";

const querySchema = z.object({
  category: z.enum(["investigation", "education", "technical", "market"]).optional(),
  tag: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

export async function GET(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const parsed = querySchema.safeParse(params);
    if (!parsed.success) return errorResponse("Invalid query", 400);

    const { category, tag, page, pageSize } = parsed.data;
    const cacheKey = `articles:list:${JSON.stringify(parsed.data)}`;
    const cached = await cacheGet<{ data: unknown[]; total: number }>(cacheKey);

    if (cached) {
      return paginatedResponse(cached.data, page, pageSize, cached.total);
    }

    const where: Record<string, unknown> = { isPublished: true };
    if (category) where.category = category;
    if (tag) where.tags = { has: tag };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category: true,
          authorName: true,
          coverImage: true,
          tags: true,
          readingTime: true,
          publishedAt: true,
        },
      }),
      prisma.article.count({ where }),
    ]);

    await cacheSet(cacheKey, { data: articles, total }, 300);
    return paginatedResponse(articles, page, pageSize, total);
  } catch (error) {
    console.error("[API] GET /api/articles error:", error);
    return errorResponse("Failed to fetch articles", 500);
  }
}
