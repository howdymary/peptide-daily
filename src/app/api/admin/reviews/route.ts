import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse, paginatedResponse } from "@/lib/utils/api-response";
import { requireRole } from "@/lib/auth/helpers";
import { withRateLimit } from "@/lib/security/rate-limit";
import { logger } from "@/lib/utils/logger";
import { z } from "zod";

const querySchema = z.object({
  flagged: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * GET /api/admin/reviews
 * List reviews for admin moderation. Admin only.
 */
export async function GET(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  const { error } = await requireRole("ADMIN");
  if (error) return error;

  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const parsed = querySchema.safeParse(params);

    if (!parsed.success) {
      return errorResponse("Invalid query parameters", 422);
    }

    const { flagged, page, pageSize } = parsed.data;

    const where = flagged !== undefined ? { flagged: flagged === "true" } : {};

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
          peptide: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return paginatedResponse(reviews, page, pageSize, totalCount);
  } catch (err) {
    console.error("Error fetching admin reviews:", err);
    return errorResponse("Failed to fetch reviews", 500);
  }
}

/**
 * PATCH /api/admin/reviews
 * Flag or unflag a review. Admin only.
 * Body: { reviewId: string, flagged: boolean }
 */
export async function PATCH(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  const { session, error } = await requireRole("ADMIN");
  if (error) return error;

  try {
    const body = await req.json();
    const { reviewId, flagged } = z
      .object({
        reviewId: z.string().cuid(),
        flagged: z.boolean(),
      })
      .parse(body);

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { flagged },
    });

    logger.audit("review_flag_toggled", session!.user.id, {
      reviewId,
      flagged,
    });

    return successResponse({ id: review.id, flagged: review.flagged });
  } catch (err) {
    console.error("Error updating review flag:", err);
    return errorResponse("Failed to update review", 500);
  }
}
