import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/helpers";
import { errorResponse, successResponse } from "@/lib/utils/api-response";
import { withRateLimit } from "@/lib/security/rate-limit";

/**
 * GET /api/finnrick/imports
 *
 * Admin-only endpoint listing past Finnrick import audit records,
 * newest first.
 */
export async function GET(req: NextRequest) {
  const rateLimited = await withRateLimit(req);
  if (rateLimited) return rateLimited;

  const { error } = await requireRole("ADMIN");
  if (error) return error;

  try {
    const imports = await prisma.finnrickImport.findMany({
      orderBy: { startedAt: "desc" },
      take: 50,
    });

    const data = imports.map((imp) => ({
      id: imp.id,
      filename: imp.filename,
      format: imp.format,
      status: imp.status,
      recordCount: imp.recordCount,
      errorCount: imp.errorCount,
      errors: imp.errors ? (JSON.parse(imp.errors) as string[]) : [],
      importedBy: imp.importedBy,
      startedAt: imp.startedAt,
      completedAt: imp.completedAt,
    }));

    return successResponse(data);
  } catch (err) {
    console.error("[GET /api/finnrick/imports]", err);
    return errorResponse("Failed to fetch import history", 500);
  }
}
