import Papa from "papaparse";
import {
  finnrickRatingRowSchema,
  finnrickTestRowSchema,
  type FinnrickImportData,
  type FinnrickRatingRow,
  type FinnrickTestRow,
} from "./types";

/**
 * Parsers for Finnrick import files.
 *
 * Two formats supported:
 *  - JSON: { ratings: [...], tests: [...] }
 *  - CSV: separate files for ratings and tests, distinguished by presence of
 *    a "grade" column (ratings) vs "testScore" column (tests).
 *    A combined CSV may interleave both types — rows are dispatched by type.
 *
 * Invalid rows are collected as errors; valid rows are returned.
 * The whole import never fails from a single bad row.
 */

export interface FinnrickParser {
  parse(content: string): Promise<FinnrickImportData>;
}

// ── JSON Parser ──────────────────────────────────────────────────────────────

export class JsonParser implements FinnrickParser {
  async parse(content: string): Promise<FinnrickImportData> {
    const parseErrors: string[] = [];
    const ratings: FinnrickRatingRow[] = [];
    const tests: FinnrickTestRow[] = [];

    let raw: unknown;
    try {
      raw = JSON.parse(content);
    } catch {
      return { ratings, tests, parseErrors: ["Invalid JSON: could not parse file"] };
    }

    if (typeof raw !== "object" || raw === null) {
      return { ratings, tests, parseErrors: ["JSON root must be an object"] };
    }

    const obj = raw as Record<string, unknown>;

    // Parse ratings array
    if (Array.isArray(obj.ratings)) {
      for (let i = 0; i < obj.ratings.length; i++) {
        const result = finnrickRatingRowSchema.safeParse(obj.ratings[i]);
        if (result.success) {
          ratings.push(result.data);
        } else {
          parseErrors.push(
            `ratings[${i}]: ${result.error.issues.map((e) => e.message).join(", ")}`,
          );
        }
      }
    }

    // Parse tests array
    if (Array.isArray(obj.tests)) {
      for (let i = 0; i < obj.tests.length; i++) {
        const result = finnrickTestRowSchema.safeParse(obj.tests[i]);
        if (result.success) {
          tests.push(result.data);
        } else {
          parseErrors.push(
            `tests[${i}]: ${result.error.issues.map((e) => e.message).join(", ")}`,
          );
        }
      }
    }

    return { ratings, tests, parseErrors };
  }
}

// ── CSV Parser ───────────────────────────────────────────────────────────────

export class CsvParser implements FinnrickParser {
  async parse(content: string): Promise<FinnrickImportData> {
    const parseErrors: string[] = [];
    const ratings: FinnrickRatingRow[] = [];
    const tests: FinnrickTestRow[] = [];

    const result = Papa.parse<Record<string, string>>(content, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      transform: (v) => v.trim(),
    });

    if (result.errors.length > 0) {
      result.errors.forEach((e) => {
        parseErrors.push(`CSV parse error row ${e.row}: ${e.message}`);
      });
    }

    for (let i = 0; i < result.data.length; i++) {
      const row = result.data[i];
      // Dispatch by presence of distinguishing columns
      if ("grade" in row) {
        const parsed = finnrickRatingRowSchema.safeParse(row);
        if (parsed.success) {
          ratings.push(parsed.data);
        } else {
          parseErrors.push(
            `row ${i + 1} (rating): ${parsed.error.issues.map((e) => e.message).join(", ")}`,
          );
        }
      } else if ("testScore" in row || "test_score" in row) {
        // Normalise snake_case CSV headers to camelCase
        const normalised = normaliseCsvRow(row);
        const parsed = finnrickTestRowSchema.safeParse(normalised);
        if (parsed.success) {
          tests.push(parsed.data);
        } else {
          parseErrors.push(
            `row ${i + 1} (test): ${parsed.error.issues.map((e) => e.message).join(", ")}`,
          );
        }
      } else {
        parseErrors.push(`row ${i + 1}: cannot determine row type (missing 'grade' or 'testScore')`);
      }
    }

    return { ratings, tests, parseErrors };
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

export function getParser(format: "csv" | "json"): FinnrickParser {
  return format === "csv" ? new CsvParser() : new JsonParser();
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Convert snake_case CSV keys to camelCase for schema compatibility. */
function normaliseCsvRow(row: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(row)) {
    const camel = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    out[camel] = val;
  }
  return out;
}
