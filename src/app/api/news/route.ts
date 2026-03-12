/**
 * GET /api/news
 *
 * Paginated, filterable news articles.
 *
 * Query params:
 *   page         number (default 1)
 *   pageSize     number (default 12, max 50)
 *   tag          string  — filter by tag (case-insensitive contains)
 *   source       string  — filter by source slug
 *   search       string  — search in title
 *   editorsPick  "true"  — only editor's picks
 *   dateFrom     ISO     — articles published after this date
 *   dateTo       ISO     — articles published before this date
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import { errorResponse } from "@/lib/utils/api-response";
import { cacheGet, cacheSet } from "@/lib/redis/client";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const limited = await withRateLimit(req);
  if (limited) return limited;

  try {
    const sp = req.nextUrl.searchParams;

    const page = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const pageSize = Math.min(50, Math.max(1, parseInt(sp.get("pageSize") ?? "12")));
    const tag = sp.get("tag") ?? "";
    const source = sp.get("source") ?? "";
    const search = sp.get("search") ?? "";
    const editorsPick = sp.get("editorsPick") === "true";
    const dateFrom = sp.get("dateFrom");
    const dateTo = sp.get("dateTo");

    const cacheKey = `news:list:${JSON.stringify({ page, pageSize, tag, source, search, editorsPick, dateFrom, dateTo })}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return Response.json(cached);

    const where: Prisma.NewsArticleWhereInput = {
      isHidden: false,
    };

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }
    if (tag) {
      where.tags = { has: tag };
    }
    if (source) {
      where.source = { slug: source };
    }
    if (editorsPick) {
      where.isEditorsPick = true;
    }
    if (dateFrom || dateTo) {
      where.publishedAt = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo) } : {}),
      };
    }

    const [totalCount, articles] = await Promise.all([
      prisma.newsArticle.count({ where }),
      prisma.newsArticle.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          source: { select: { name: true, slug: true, siteUrl: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const response = {
      data: articles.map((a) => ({
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
      })),
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    await cacheSet(cacheKey, response, 180); // 3-min cache
    return Response.json(response);
  } catch (err) {
    console.error("Error fetching news:", err);
    return errorResponse("Failed to fetch news", 500);
  }
}
