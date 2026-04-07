import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

const applySchema = z.object({
  contactName: z.string().min(1).max(100),
  contactEmail: z.string().email(),
  organizationName: z.string().min(1).max(200),
  organizationType: z.string().min(1),
  website: z.string().url().optional().or(z.literal("")),
  message: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  const rateLimited = await withRateLimit(req, { max: 5, windowSeconds: 3600 });
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json();
    const parsed = applySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Please fill in all required fields correctly.", 400);
    }

    const { contactName, contactEmail } = parsed.data;

    // Check for duplicate application
    const existing = await prisma.verifiedSourceApplication.findFirst({
      where: {
        contactEmail,
        status: { in: ["pending", "approved"] },
      },
    });

    if (existing) {
      return errorResponse(
        "An application with this email is already on file.",
        409,
      );
    }

    await prisma.verifiedSourceApplication.create({
      data: { contactName, contactEmail },
    });

    return successResponse({ message: "Application received" }, 201);
  } catch (error) {
    console.error("[API] POST /api/verified-source/apply error:", error);
    return errorResponse("Failed to submit application", 500);
  }
}
