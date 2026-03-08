import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/helpers";
import { getAllVendorMappings } from "@/lib/vendors/mapping";
import { vendorMappingUpdateSchema } from "@/lib/validation/schemas";
import { cacheDelete } from "@/lib/redis/client";
import { errorResponse, successResponse } from "@/lib/utils/api-response";
import { withRateLimit } from "@/lib/security/rate-limit";

/**
 * GET /api/admin/vendor-mappings
 * List all vendor→Finnrick mappings with scraping configuration.
 *
 * PUT /api/admin/vendor-mappings
 * Create or update a vendor mapping.
 * Body: { vendorId, finnrickSlug, vendorDomain?, scrapingEnabled?, scrapingAdapter?, rateLimit?, notes? }
 */

export async function GET(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  const { error } = await requireRole("ADMIN");
  if (error) return error;

  try {
    const mappings = await getAllVendorMappings();
    return successResponse(mappings);
  } catch (err) {
    console.error("[GET /api/admin/vendor-mappings]", err);
    return errorResponse("Failed to fetch vendor mappings", 500);
  }
}

export async function PUT(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  const { error } = await requireRole("ADMIN");
  if (error) return error;

  try {
    const body = await req.json();

    if (!body.vendorId || typeof body.vendorId !== "string") {
      return errorResponse("vendorId is required", 422);
    }

    const parsed = vendorMappingUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues.map((i) => i.message).join(", "),
        422,
      );
    }

    const { finnrickSlug, vendorDomain, scrapingEnabled, scrapingAdapter, rateLimit, notes } =
      parsed.data;

    const mapping = await prisma.vendorMapping.upsert({
      where: { vendorId: body.vendorId as string },
      update: {
        finnrickSlug,
        ...(vendorDomain !== undefined ? { vendorDomain } : {}),
        ...(scrapingEnabled !== undefined ? { scrapingEnabled } : {}),
        ...(scrapingAdapter !== undefined ? { scrapingAdapter } : {}),
        ...(rateLimit !== undefined ? { rateLimit } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
      create: {
        vendorId: body.vendorId as string,
        finnrickSlug,
        vendorDomain: vendorDomain ?? null,
        scrapingEnabled: scrapingEnabled ?? false,
        scrapingAdapter: scrapingAdapter ?? null,
        rateLimit: rateLimit ?? 10,
        notes: notes ?? null,
      },
    });

    // Invalidate mapping caches
    await Promise.all([
      cacheDelete("vendor-mappings:*"),
      cacheDelete(`vendor-mapping:finnrick:${finnrickSlug}`),
    ]);

    return successResponse(mapping);
  } catch (err) {
    console.error("[PUT /api/admin/vendor-mappings]", err);
    return errorResponse("Failed to update vendor mapping", 500);
  }
}
