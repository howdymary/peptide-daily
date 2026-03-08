import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth/helpers";
import { importFinnrickData } from "@/lib/finnrick/importer";
import { finnrickImportSchema } from "@/lib/validation/schemas";
import { errorResponse, successResponse } from "@/lib/utils/api-response";
import { withRateLimit } from "@/lib/security/rate-limit";

/**
 * POST /api/finnrick/import
 *
 * Admin-only endpoint to import Finnrick rating data (CSV or JSON).
 *
 * Request body:
 *   { format: "json" | "csv", content: "<file content>", filename?: string }
 *
 * Returns a summary of records processed, skipped, and any errors.
 */
export async function POST(req: NextRequest) {
  const rateLimited = await withRateLimit(req, { max: 5, windowSeconds: 3600 });
  if (rateLimited) return rateLimited;

  const { session, error } = await requireRole("ADMIN");
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = finnrickImportSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues.map((i) => i.message).join(", "),
        422,
      );
    }

    const { format, content, filename } = parsed.data;

    const result = await importFinnrickData(
      content,
      format,
      filename,
      session!.user.id,
    );

    return successResponse(result, result.status === "failed" ? 500 : 200);
  } catch (err) {
    console.error("[POST /api/finnrick/import]", err);
    return errorResponse("Import failed", 500);
  }
}
