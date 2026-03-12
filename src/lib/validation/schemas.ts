import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { finnrickGradeSchema } from "@/lib/finnrick/types";

/**
 * Zod schemas for input validation.
 * All user-facing inputs go through these before touching the database.
 */

// ── Sanitizer ───────────────────────────────────────────────────────────────

function sanitize(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

const sanitized = z.string().transform(sanitize);

// ── Review schemas ──────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  peptideId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: sanitized.pipe(
    z.string().min(3, "Title must be at least 3 characters").max(200),
  ),
  body: sanitized.pipe(
    z.string().min(20, "Review must be at least 20 characters").max(5000),
  ),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: sanitized
    .pipe(z.string().min(3, "Title must be at least 3 characters").max(200))
    .optional(),
  body: sanitized
    .pipe(z.string().min(20, "Review must be at least 20 characters").max(5000))
    .optional(),
});

// ── Peptide query schemas ───────────────────────────────────────────────────

export const peptideQuerySchema = z.object({
  search: z.string().max(200).optional(),
  vendor: z.string().max(100).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  availability: z.enum(["in_stock", "out_of_stock", "pre_order"]).optional(),
  finnrickGrade: finnrickGradeSchema.optional(),
  minFinnrickScore: z.coerce.number().min(0).max(10).optional(),
  sortBy: z
    .enum(["name", "price_asc", "price_desc", "rating", "finnrick_rating", "trust_score"])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  // Cap at 50 to avoid expensive full-table scans in a single request
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

// ── Finnrick import schema ───────────────────────────────────────────────────

// 5 MB max for import payloads — prevents memory exhaustion via huge uploads
const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

export const finnrickImportSchema = z.object({
  format: z.enum(["csv", "json"]),
  content: z
    .string()
    .min(1, "File content is required")
    .max(MAX_IMPORT_BYTES, "Import file must be smaller than 5 MB"),
  filename: z.string().min(1).default("import"),
});

// ── Vendor mapping schema ────────────────────────────────────────────────────

export const vendorMappingUpdateSchema = z.object({
  finnrickSlug: z.string().min(1).max(100),
  vendorDomain: z.string().max(255).nullable().optional(),
  scrapingEnabled: z.boolean().optional(),
  scrapingAdapter: z.string().max(100).nullable().optional(),
  rateLimit: z.coerce.number().int().min(1).max(60).optional(),
  notes: z.string().max(1000).nullable().optional(),
});

// ── Auth schemas ────────────────────────────────────────────────────────────

export const signUpSchema = z.object({
  name: sanitized.pipe(
    z.string().min(2, "Name must be at least 2 characters").max(100),
  ),
  email: z.string().email("Invalid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and a number",
    ),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ── Type exports ────────────────────────────────────────────────────────────

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type PeptideQueryInput = z.infer<typeof peptideQuerySchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type FinnrickImportInput = z.infer<typeof finnrickImportSchema>;
export type VendorMappingUpdateInput = z.infer<typeof vendorMappingUpdateSchema>;
