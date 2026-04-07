import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import { errorResponse } from "@/lib/utils/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  try {
    const { slug } = await params;

    const leadMagnet = await prisma.leadMagnet.findUnique({
      where: { slug, isActive: true },
    });

    if (!leadMagnet) {
      return errorResponse("Resource not found", 404);
    }

    // Increment download count
    await prisma.leadMagnet.update({
      where: { id: leadMagnet.id },
      data: { downloadCount: { increment: 1 } },
    });

    // Redirect to the file
    const fileUrl = leadMagnet.fileName.startsWith("http")
      ? leadMagnet.fileName
      : `/downloads/${leadMagnet.fileName}`;

    return NextResponse.redirect(new URL(fileUrl, req.url));
  } catch (error) {
    console.error("[API] GET /api/lead-magnets/[slug]/download error:", error);
    return errorResponse("Failed to process download", 500);
  }
}
