import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import { errorResponse, successResponse } from "@/lib/utils/api-response";
import { generateShareToken } from "@/lib/protocols/share-token";
import { auth } from "@/lib/auth/config";
import slugify from "slugify";

const createProtocolSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  goalTags: z.array(z.string()).default([]),
  peptideIds: z.array(z.string()).min(1).max(10),
  isPublic: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  try {
    const protocols = await prisma.protocol.findMany({
      where: { isPublic: true },
      orderBy: { viewCount: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        goalTags: true,
        peptideIds: true,
        safetyScore: true,
        shareToken: true,
        viewCount: true,
        createdAt: true,
      },
    });

    return successResponse(protocols);
  } catch (error) {
    console.error("[API] GET /api/protocols error:", error);
    return errorResponse("Failed to fetch protocols", 500);
  }
}

export async function POST(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  try {
    const session = await auth();
    const body = await req.json();
    const parsed = createProtocolSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Invalid protocol data", 400);
    }

    const { name, description, goalTags, peptideIds, isPublic } = parsed.data;
    const slug = slugify(name, { lower: true, strict: true });
    const shareToken = generateShareToken();

    const protocol = await prisma.protocol.create({
      data: {
        name,
        slug: `${slug}-${shareToken.slice(0, 6)}`,
        description: description ?? null,
        goalTags,
        peptideIds,
        isPublic,
        shareToken,
        creatorId: session?.user?.email
          ? (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id ?? null
          : null,
      },
    });

    return successResponse(protocol, 201);
  } catch (error) {
    console.error("[API] POST /api/protocols error:", error);
    return errorResponse("Failed to create protocol", 500);
  }
}
