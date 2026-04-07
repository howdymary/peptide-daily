import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  try {
    const { id } = await params;

    // Look up by ID or shareToken
    const protocol = await prisma.protocol.findFirst({
      where: {
        OR: [{ id }, { shareToken: id }],
      },
    });

    if (!protocol) {
      return errorResponse("Protocol not found", 404);
    }

    // Increment view count for shared protocols
    if (protocol.shareToken === id) {
      await prisma.protocol.update({
        where: { id: protocol.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return successResponse(protocol);
  } catch (error) {
    console.error("[API] GET /api/protocols/[id] error:", error);
    return errorResponse("Failed to fetch protocol", 500);
  }
}
