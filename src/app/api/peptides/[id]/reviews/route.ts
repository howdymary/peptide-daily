import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createReviewSchema } from "@/lib/validation/schemas";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { requireAuth } from "@/lib/auth/helpers";
import { withRateLimit } from "@/lib/security/rate-limit";
import { cacheDelete } from "@/lib/redis/client";
import { logger } from "@/lib/utils/logger";

/**
 * POST /api/peptides/:id/reviews
 * Create a new review for a peptide. Requires authentication.
 * Rate limited: 10 reviews per hour per user.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // Rate limit
  const rateLimited = await withRateLimit(req, {
    max: 10,
    windowSeconds: 3600,
    keyPrefix: "rl:review",
  });
  if (rateLimited) return rateLimited;

  // Auth check
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id: peptideId } = await params;
    const body = await req.json();

    // Validate input
    const parsed = createReviewSchema.safeParse({
      ...body,
      peptideId,
    });

    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues.map((i) => i.message).join(", "),
        422,
      );
    }

    // Verify peptide exists
    const peptide = await prisma.peptide.findUnique({
      where: { id: peptideId },
    });

    if (!peptide) {
      return errorResponse("Peptide not found", 404);
    }

    // Check if user already reviewed this peptide
    const existing = await prisma.review.findUnique({
      where: {
        peptideId_userId: {
          peptideId,
          userId: session!.user.id,
        },
      },
    });

    if (existing) {
      return errorResponse(
        "You have already reviewed this peptide. Edit your existing review instead.",
        409,
      );
    }

    const review = await prisma.review.create({
      data: {
        peptideId,
        userId: session!.user.id,
        rating: parsed.data.rating,
        title: parsed.data.title,
        body: parsed.data.body,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    // Invalidate caches
    await cacheDelete(`peptide:${peptideId}`);
    await cacheDelete(`peptide:${peptide.slug}`);
    await cacheDelete("peptides:*");

    logger.audit("review_created", session!.user.id, {
      reviewId: review.id,
      peptideId,
      rating: review.rating,
    });

    return successResponse(
      {
        id: review.id,
        rating: review.rating,
        title: review.title,
        body: review.body,
        createdAt: review.createdAt,
        user: review.user,
      },
      201,
    );
  } catch (err) {
    console.error("Error creating review:", err);
    return errorResponse("Failed to create review", 500);
  }
}
