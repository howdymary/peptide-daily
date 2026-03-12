import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import { errorResponse } from "@/lib/utils/api-response";
import { cacheGet, cacheSet } from "@/lib/redis/client";

/**
 * GET /api/vendors
 * Returns all active vendors with aggregate Finnrick stats and peptide counts.
 */
export async function GET(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  try {
    const cacheKey = "vendors:list";
    const cached = await cacheGet(cacheKey);
    if (cached) return Response.json(cached);

    const vendors = await prisma.vendor.findMany({
      where: { isActive: true },
      include: {
        prices: {
          select: { peptideId: true, price: true },
          distinct: ["peptideId"],
        },
        finnrickRatings: {
          select: {
            grade: true,
            averageScore: true,
            testCount: true,
            newestTestDate: true,
            finnrickUrl: true,
          },
        },
        vendorMapping: {
          select: { vendorDomain: true, finnrickSlug: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const gradeOrder: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };

    const data = vendors.map((v) => {
      const ratings = v.finnrickRatings;
      const totalTests = ratings.reduce((sum, r) => sum + r.testCount, 0);
      const latestTest = ratings.length > 0
        ? ratings.reduce((best, r) =>
            r.newestTestDate > best.newestTestDate ? r : best
          ).newestTestDate
        : null;

      // Best overall grade across all peptides
      const bestGrade = ratings.length > 0
        ? ratings.reduce((best, r) =>
            (gradeOrder[r.grade] ?? 0) > (gradeOrder[best.grade] ?? 0) ? r : best
          ).grade
        : null;

      // Average score across all ratings
      const avgScore =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + Number(r.averageScore), 0) / ratings.length
          : null;

      return {
        id: v.id,
        name: v.name,
        slug: v.slug,
        website: v.website,
        peptideCount: v.prices.length,
        finnrickRatingCount: ratings.length,
        bestFinnrickGrade: bestGrade,
        averageFinnrickScore: avgScore !== null ? Math.round(avgScore * 10) / 10 : null,
        totalTestCount: totalTests,
        latestTestDate: latestTest?.toISOString() ?? null,
        finnrickUrl: ratings.find((r) => r.finnrickUrl)?.finnrickUrl ?? null,
        vendorDomain: v.vendorMapping?.vendorDomain ?? null,
      };
    });

    await cacheSet(cacheKey, data, 600); // 10-min cache
    return Response.json(data);
  } catch (err) {
    console.error("Error fetching vendors:", err);
    return errorResponse("Failed to fetch vendors", 500);
  }
}
