/**
 * GET /api/admin/vendor-health
 *
 * Returns per-vendor health metrics for the admin dashboard:
 *  - vendorName, domain, status, vendorType
 *  - scrapingEnabled flag
 *  - lastScrapedAt, activeProducts, errorCount, lastError
 *  - isStale (not scraped in the last 7 days)
 *
 * Also returns duplicate domain detections and a source registry summary.
 *
 * Requires ADMIN role.
 */

import { requireRole } from "@/lib/auth/helpers";
import { getVendorHealthReport, detectDuplicateVendors } from "@/lib/vendors/vendor-health";
import { getSourceRegistrySummary } from "@/lib/vendors/scraper-config";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";

export async function GET() {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  try {
    const [healthReport, duplicates] = await Promise.all([
      getVendorHealthReport(),
      detectDuplicateVendors(),
    ]);

    const registrySummary = getSourceRegistrySummary();
    const summaryCounts = Object.fromEntries(
      Object.entries(registrySummary).map(([status, cfgs]) => [status, cfgs.length]),
    );

    return successResponse({
      data: {
        vendors: healthReport,
        duplicates,
        registrySummary: summaryCounts,
        totalVendors: healthReport.length,
        staleVendors: healthReport.filter((v) => v.isStale).length,
        errorVendors: healthReport.filter((v) => v.errorCount > 0).length,
      },
    });
  } catch (err) {
    logger.error("GET /api/admin/vendor-health failed", {
      metadata: { error: (err as Error).message },
    });
    return errorResponse("Failed to fetch vendor health", 500);
  }
}
