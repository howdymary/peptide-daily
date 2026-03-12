import { prisma } from "@/lib/db/prisma";
import { cacheDelete } from "@/lib/redis/client";
import { logger } from "@/lib/utils/logger";
import { getParser } from "./parsers";
import type { FinnrickImportResult } from "./types";

/**
 * Core Finnrick import pipeline.
 *
 * Accepts raw CSV or JSON content (as a string), parses it, resolves
 * vendor+peptide slugs to database IDs, then upserts FinnrickVendorRating
 * rows and inserts FinnrickTestResult rows.
 *
 * Idempotent: re-importing the same data upserts ratings (no duplicates)
 * and skips test rows already present via the importBatchId.
 *
 * Failures per row are collected; the overall import continues.
 */
export async function importFinnrickData(
  content: string,
  format: "csv" | "json",
  filename: string,
  importedBy?: string,
): Promise<FinnrickImportResult> {
  // Create audit record
  const importRecord = await prisma.finnrickImport.create({
    data: {
      filename,
      format,
      importedBy: importedBy ?? null,
      status: "processing",
    },
  });

  const importBatchId = importRecord.id;
  const errors: string[] = [];
  let ratingsUpserted = 0;
  let testsCreated = 0;
  let skipped = 0;

  try {
    // Parse content
    const parser = getParser(format);
    const { ratings, tests, parseErrors } = await parser.parse(content);
    errors.push(...parseErrors);

    logger.info(`[Finnrick Import] ${importBatchId}: parsed ${ratings.length} ratings, ${tests.length} tests, ${parseErrors.length} parse errors`);

    // ── Upsert ratings ─────────────────────────────────────────────────────

    // Pre-fetch all vendor and peptide slugs for efficient lookup
    const [allVendors, allPeptides] = await Promise.all([
      prisma.vendor.findMany({ select: { id: true, slug: true } }),
      prisma.peptide.findMany({ select: { id: true, slug: true } }),
    ]);

    const vendorBySlug = new Map(allVendors.map((v) => [v.slug, v.id]));
    const peptideBySlug = new Map(allPeptides.map((p) => [p.slug, p.id]));

    // Map vendorSlug+peptideSlug -> ratingId for test linking
    const ratingIdMap = new Map<string, string>();

    for (const row of ratings) {
      const vendorId = vendorBySlug.get(row.vendorSlug);
      const peptideId = peptideBySlug.get(row.peptideSlug);

      if (!vendorId) {
        const msg = `Rating skipped: vendor slug "${row.vendorSlug}" not found`;
        errors.push(msg);
        skipped++;
        continue;
      }
      if (!peptideId) {
        const msg = `Rating skipped: peptide slug "${row.peptideSlug}" not found`;
        errors.push(msg);
        skipped++;
        continue;
      }

      try {
        const rating = await prisma.finnrickVendorRating.upsert({
          where: { vendorId_peptideId: { vendorId, peptideId } },
          update: {
            grade: row.grade,
            averageScore: row.averageScore,
            testCount: row.testCount,
            minScore: row.minScore,
            maxScore: row.maxScore,
            oldestTestDate: row.oldestTestDate,
            newestTestDate: row.newestTestDate,
            finnrickUrl: row.finnrickUrl ?? null,
            importBatchId,
          },
          create: {
            vendorId,
            peptideId,
            grade: row.grade,
            averageScore: row.averageScore,
            testCount: row.testCount,
            minScore: row.minScore,
            maxScore: row.maxScore,
            oldestTestDate: row.oldestTestDate,
            newestTestDate: row.newestTestDate,
            finnrickUrl: row.finnrickUrl ?? null,
            importBatchId,
          },
          select: { id: true },
        });

        ratingIdMap.set(`${row.vendorSlug}:${row.peptideSlug}`, rating.id);
        ratingsUpserted++;
      } catch (err) {
        const msg = `Rating upsert failed [${row.vendorSlug}/${row.peptideSlug}]: ${err instanceof Error ? err.message : String(err)}`;
        errors.push(msg);
        logger.error(msg);
      }
    }

    // ── Insert test results ────────────────────────────────────────────────

    for (const row of tests) {
      const ratingId = ratingIdMap.get(`${row.vendorSlug}:${row.peptideSlug}`);

      if (!ratingId) {
        // Rating may have been skipped or not yet imported — try DB lookup
        const vendorId = vendorBySlug.get(row.vendorSlug);
        const peptideId = peptideBySlug.get(row.peptideSlug);

        if (!vendorId || !peptideId) {
          skipped++;
          continue;
        }

        const existing = await prisma.finnrickVendorRating.findUnique({
          where: { vendorId_peptideId: { vendorId, peptideId } },
          select: { id: true },
        });

        if (!existing) {
          errors.push(`Test skipped: no rating found for ${row.vendorSlug}/${row.peptideSlug}`);
          skipped++;
          continue;
        }

        ratingIdMap.set(`${row.vendorSlug}:${row.peptideSlug}`, existing.id);
      }

      const resolvedRatingId = ratingIdMap.get(`${row.vendorSlug}:${row.peptideSlug}`)!;

      try {
        await prisma.finnrickTestResult.create({
          data: {
            ratingId: resolvedRatingId,
            testDate: row.testDate,
            testScore: row.testScore,
            advertisedQuantity: row.advertisedQuantity,
            actualQuantity: row.actualQuantity,
            quantityVariance: row.quantityVariance,
            purity: row.purity,
            batchId: row.batchId,
            containerType: row.containerType,
            labId: row.labId,
            source: row.source,
            endotoxinsStatus: row.endotoxinsStatus ?? null,
            certificateLink: row.certificateLink ?? null,
            identityResult: row.identityResult,
            importBatchId,
          },
        });
        testsCreated++;
      } catch (err) {
        const msg = `Test insert failed [${row.vendorSlug}/${row.peptideSlug} ${row.batchId}]: ${err instanceof Error ? err.message : String(err)}`;
        errors.push(msg);
        logger.error(msg);
      }
    }

    // ── Invalidate caches ──────────────────────────────────────────────────

    await Promise.all([
      cacheDelete("finnrick:*"),
      cacheDelete("peptides:*"),
      cacheDelete("peptide:*"),
    ]);

    // ── Update audit record ────────────────────────────────────────────────

    const recordCount = ratings.length + tests.length;
    await prisma.finnrickImport.update({
      where: { id: importBatchId },
      data: {
        status: "completed",
        recordCount,
        errorCount: errors.length,
        errors: errors.length > 0 ? JSON.stringify(errors) : null,
        completedAt: new Date(),
      },
    });

    logger.info(`[Finnrick Import] ${importBatchId}: completed — ${ratingsUpserted} ratings, ${testsCreated} tests, ${skipped} skipped, ${errors.length} errors`);

    return {
      importId: importBatchId,
      ratingsUpserted,
      testsCreated,
      skipped,
      errors,
      status: "completed",
    };
  } catch (err) {
    const msg = `Import failed: ${err instanceof Error ? err.message : String(err)}`;
    logger.error(`[Finnrick Import] ${importBatchId}: ${msg}`);

    await prisma.finnrickImport.update({
      where: { id: importBatchId },
      data: {
        status: "failed",
        errors: JSON.stringify([msg, ...errors]),
        errorCount: errors.length + 1,
        completedAt: new Date(),
      },
    });

    return {
      importId: importBatchId,
      ratingsUpserted,
      testsCreated,
      skipped,
      errors: [msg, ...errors],
      status: "failed",
    };
  }
}
