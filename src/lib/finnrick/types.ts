import { z } from "zod";

/**
 * Zod schemas for validating Finnrick import data (CSV or JSON).
 * These match the structure of data we export from Finnrick's website.
 */

// ── Grade validation ─────────────────────────────────────────────────────────

export const finnrickGradeSchema = z.enum(["A", "B", "C", "D", "E"]);

// ── Aggregate rating row ─────────────────────────────────────────────────────

/**
 * One row per vendor+peptide pair representing the aggregate Finnrick rating.
 * vendorSlug and peptideSlug must match slugs in our database.
 */
export const finnrickRatingRowSchema = z.object({
  vendorSlug: z.string().min(1),
  peptideSlug: z.string().min(1),
  grade: finnrickGradeSchema,
  averageScore: z.coerce.number().min(0).max(10),
  testCount: z.coerce.number().int().min(1),
  minScore: z.coerce.number().min(0).max(10),
  maxScore: z.coerce.number().min(0).max(10),
  oldestTestDate: z.coerce.date(),
  newestTestDate: z.coerce.date(),
  finnrickUrl: z.string().url().nullable().optional(),
});

export type FinnrickRatingRow = z.infer<typeof finnrickRatingRowSchema>;

// ── Individual test result row ───────────────────────────────────────────────

/**
 * One row per individual lab test.
 * vendorSlug + peptideSlug links it to the parent FinnrickVendorRating.
 */
export const finnrickTestRowSchema = z.object({
  vendorSlug: z.string().min(1),
  peptideSlug: z.string().min(1),
  testDate: z.coerce.date(),
  testScore: z.coerce.number().min(0).max(10),
  advertisedQuantity: z.coerce.number().min(0),
  actualQuantity: z.coerce.number().min(0),
  quantityVariance: z.coerce.number(),
  purity: z.coerce.number().min(0).max(100),
  batchId: z.string().min(1),
  containerType: z.string().default(""),
  labId: z.string().min(1),
  source: z.string().default("Public"),
  endotoxinsStatus: z.string().nullable().optional(),
  certificateLink: z.string().nullable().optional(),
  identityResult: z.string().default("Pass"),
});

export type FinnrickTestRow = z.infer<typeof finnrickTestRowSchema>;

// ── Full import payload ──────────────────────────────────────────────────────

export interface FinnrickImportData {
  ratings: FinnrickRatingRow[];
  tests: FinnrickTestRow[];
  parseErrors: string[];
}

// ── Import result ────────────────────────────────────────────────────────────

export interface FinnrickImportResult {
  importId: string;
  ratingsUpserted: number;
  testsCreated: number;
  skipped: number;
  errors: string[];
  status: "completed" | "failed";
}
