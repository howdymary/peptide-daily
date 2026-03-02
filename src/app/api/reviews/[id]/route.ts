import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { updateReviewSchema } from "@/lib/validation/schemas";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { requireAuth } from "@/lib/auth/helpers";
import { withRateLimit } from "@/lib/security/rate-limit";
import { cacheDelete } from "@/lib/redis/client";
import { logger } from "@/lib/utils/logger";

/**
 * PATCH /api/reviews/:id
 * Edit a review. Only the author can edit their own review.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rateLimited = await withRateLimit(req, {
    max: 20,
    windowSeconds: 60,
    keyPrefix: "rl:review-edit",
  });
  if (rateLimited) return rateLimited;

  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: { peptide: { select: { slug: true } } },
    });

    if (!review) {
      return errorResponse("Review not found", 404);
    }

    if (review.userId !== session!.user.id) {
      return errorResponse("You can only edit your own reviews", 403);
    }

    const body = await req.json();
    const parsed = updateReviewSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues.map((i) => i.message).join(", "),
        422,
      );
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(parsed.data.rating !== undefined && { rating: parsed.data.rating }),
        ...(parsed.data.title !== undefined && { title: parsed.data.title }),
        ...(parsed.data.body !== undefined && { body: parsed.data.body }),
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    await cacheDelete(`peptide:${review.peptideId}`);
    await cacheDelete(`peptide:${review.peptide.slug}`);
    await cacheDelete("peptides:*");

    logger.audit("review_updated", session!.user.id, {
      reviewId: id,
      peptideId: review.peptideId,
    });

    return successResponse({
      id: updated.id,
      rating: updated.rating,
      title: updated.title,
      body: updated.body,
      updatedAt: updated.updatedAt,
      user: updated.user,
    });
  } catch (err) {
    console.error("Error updating review:", err);
    return errorResponse("Failed to update review", 500);
  }
}

/**
 * DELETE /api/reviews/:id
 * Delete a review. Only the author or an admin can delete.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: { peptide: { select: { slug: true } } },
    });

    if (!review) {
      return errorResponse("Review not found", 404);
    }

    // Author or admin can delete
    const isAuthor = review.userId === session!.user.id;
    const isAdmin = session!.user.role === "ADMIN";

    if (!isAuthor && !isAdmin) {
      return errorResponse("You can only delete your own reviews", 403);
    }

    await prisma.review.delete({ where: { id } });

    await cacheDelete(`peptide:${review.peptideId}`);
    await cacheDelete(`peptide:${review.peptide.slug}`);
    await cacheDelete("peptides:*");

    logger.audit("review_deleted", session!.user.id, {
      reviewId: id,
      peptideId: review.peptideId,
      deletedByAdmin: isAdmin && !isAuthor,
    });

    return successResponse({ message: "Review deleted" });
  } catch (err) {
    console.error("Error deleting review:", err);
    return errorResponse("Failed to delete review", 500);
  }
}
