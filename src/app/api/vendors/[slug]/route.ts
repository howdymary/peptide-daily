import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import { errorResponse } from "@/lib/utils/api-response";
import { cacheGet, cacheSet } from "@/lib/redis/client";

/**
 * GET /api/vendors/[slug]
 * Returns detailed vendor info with all Finnrick ratings and peptide price list.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  const { slug } = await params;
  const cacheKey = `vendors:detail:${slug}`;

  try {
    const cached = await cacheGet(cacheKey);
    if (cached) return Response.json(cached);

    const vendor = await prisma.vendor.findUnique({
      where: { slug },
      include: {
        prices: {
          include: {
            peptide: { select: { id: true, name: true, slug: true, category: true } },
          },
          orderBy: { price: "asc" },
        },
        finnrickRatings: {
          include: {
            peptide: { select: { name: true, slug: true } },
            tests: {
              orderBy: { testDate: "desc" },
              take: 10,
            },
          },
          orderBy: { averageScore: "desc" },
        },
        vendorMapping: {
          select: { vendorDomain: true, finnrickSlug: true, notes: true },
        },
      },
    });

    if (!vendor) {
      return errorResponse("Vendor not found", 404);
    }

    const gradeOrder: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };
    const ratings = vendor.finnrickRatings;

    const bestGrade =
      ratings.length > 0
        ? ratings.reduce((best, r) =>
            (gradeOrder[r.grade] ?? 0) > (gradeOrder[best.grade] ?? 0) ? r : best
          ).grade
        : null;

    const totalTests = ratings.reduce((sum, r) => sum + r.testCount, 0);
    const latestTest =
      ratings.length > 0
        ? ratings.reduce((best, r) =>
            r.newestTestDate > best.newestTestDate ? r : best
          ).newestTestDate
        : null;
    const avgScore =
      ratings.length > 0
        ? ratings.reduce((s, r) => s + Number(r.averageScore), 0) / ratings.length
        : null;

    const result = {
      id: vendor.id,
      name: vendor.name,
      slug: vendor.slug,
      website: vendor.website,
      vendorDomain: vendor.vendorMapping?.vendorDomain ?? null,
      finnrickSlug: vendor.vendorMapping?.finnrickSlug ?? null,
      notes: vendor.vendorMapping?.notes ?? null,
      bestFinnrickGrade: bestGrade,
      averageFinnrickScore: avgScore !== null ? Math.round(avgScore * 10) / 10 : null,
      totalTestCount: totalTests,
      latestTestDate: latestTest?.toISOString() ?? null,
      finnrickRatingCount: ratings.length,

      // Per-peptide Finnrick ratings
      finnrickRatings: ratings.map((r) => ({
        peptideName: r.peptide.name,
        peptideSlug: r.peptide.slug,
        grade: r.grade,
        averageScore: Number(r.averageScore),
        testCount: r.testCount,
        newestTestDate: r.newestTestDate.toISOString(),
        finnrickUrl: r.finnrickUrl,
        tests: r.tests.map((t) => ({
          id: t.id,
          testDate: t.testDate.toISOString(),
          testScore: Number(t.testScore),
          purity: Number(t.purity),
          quantityVariance: Number(t.quantityVariance),
          advertisedQuantity: Number(t.advertisedQuantity),
          actualQuantity: Number(t.actualQuantity),
          batchId: t.batchId,
          containerType: t.containerType,
          labId: t.labId,
          source: t.source,
          endotoxinsStatus: t.endotoxinsStatus,
          certificateLink: t.certificateLink,
          identityResult: t.identityResult,
        })),
      })),

      // Prices listed by this vendor
      prices: vendor.prices.map((p) => ({
        id: p.id,
        peptideId: p.peptideId,
        peptideName: p.peptide.name,
        peptideSlug: p.peptide.slug,
        peptideCategory: p.peptide.category,
        price: Number(p.price),
        currency: p.currency,
        concentration: p.concentration,
        productUrl: p.productUrl,
        availabilityStatus: p.availabilityStatus,
        lastUpdated: p.lastUpdated.toISOString(),
      })),
    };

    await cacheSet(cacheKey, result, 300);
    return Response.json(result);
  } catch (err) {
    console.error("Error fetching vendor:", err);
    return errorResponse("Failed to fetch vendor", 500);
  }
}
