import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { withRateLimit } from "@/lib/security/rate-limit";
import { errorResponse, successResponse } from "@/lib/utils/api-response";
import { checkInteractions } from "@/lib/protocols/interaction-checker";
import { computeSafetyScore } from "@/lib/protocols/safety-scorer";

const checkSchema = z.object({
  peptideIds: z.array(z.string()).min(2).max(10),
});

export async function POST(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json();
    const parsed = checkSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Provide 2-10 peptide IDs", 400);
    }

    const { peptideIds } = parsed.data;

    // Fetch peptide names for display
    const peptides = await prisma.peptide.findMany({
      where: { id: { in: peptideIds } },
      select: { id: true, name: true },
    });

    const nameMap = new Map(peptides.map((p) => [p.id, p.name]));

    // Fetch all known interactions for these peptides
    const interactions = await prisma.peptideInteraction.findMany({
      where: {
        OR: [
          { peptideAId: { in: peptideIds }, peptideBId: { in: peptideIds } },
        ],
      },
    });

    const interactionRecords = interactions.map((i) => ({
      peptideAId: i.peptideAId,
      peptideBId: i.peptideBId,
      severity: i.severity as "safe" | "caution" | "avoid",
      description: i.description,
      source: i.source,
    }));

    const checkResult = checkInteractions(peptideIds, nameMap, interactionRecords);
    const safetyScore = computeSafetyScore(checkResult, peptideIds.length);

    return successResponse({
      ...checkResult,
      safetyScore,
    });
  } catch (error) {
    console.error("[API] POST /api/interactions/check error:", error);
    return errorResponse("Failed to check interactions", 500);
  }
}
