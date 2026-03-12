/**
 * Shared utilities for extracting product data from vendor HTML pages.
 *
 * These are pure functions — no side effects, no HTTP calls.
 * They are used by concrete vendor fetchers to parse HTML responses.
 */

/** Canonical peptide name aliases — maps common variations to our canonical names. */
const PEPTIDE_ALIASES: Record<string, string> = {
  "bpc 157": "BPC-157",
  "bpc157": "BPC-157",
  "tb 500": "TB-500",
  "tb500": "TB-500",
  "thymosin beta 4": "TB-500",
  "ghk cu": "GHK-Cu",
  "ghkcu": "GHK-Cu",
  "copper peptide": "GHK-Cu",
  "cjc 1295": "CJC-1295",
  "cjc1295": "CJC-1295",
  "pt 141": "PT-141",
  "pt141": "PT-141",
  "bremelanotide": "PT-141",
  "melanotan 2": "Melanotan II",
  "mt 2": "Melanotan II",
  "mt2": "Melanotan II",
  "ipamorelin": "Ipamorelin",
  "semaglutide": "Semaglutide",
  "tirzepatide": "Tirzepatide",
  "retatrutide": "Retatrutide",
  "tesamorelin": "Tesamorelin",
  "hexarelin": "Hexarelin",
  "sermorelin": "Sermorelin",
  "selank": "Selank",
  "semax": "Semax",
  "epithalon": "Epithalon",
  "epitalon": "Epithalon",
  "kisspeptin": "Kisspeptin-10",
  "mots c": "MOTS-C",
  "motsc": "MOTS-C",
  "ss 31": "SS-31",
  "ss31": "SS-31",
};

/**
 * Normalise a raw product name from a vendor website to our canonical peptide name.
 * Returns null if the name cannot be matched.
 */
export function normalizePeptideName(raw: string): string {
  const lower = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Direct alias lookup
  if (PEPTIDE_ALIASES[lower]) return PEPTIDE_ALIASES[lower];

  // Partial match — find first alias whose key appears in the lowered string
  for (const [alias, canonical] of Object.entries(PEPTIDE_ALIASES)) {
    if (lower.includes(alias)) return canonical;
  }

  // Fall back: title-case the original (best effort)
  return raw.trim();
}

/**
 * Extract a numeric price from a string like "$39.99", "39.99 USD", "From $29".
 * Returns null if no price can be parsed.
 */
export function parsePrice(text: string): number | null {
  const match = text.match(/[\d,]+\.?\d*/);
  if (!match) return null;
  const num = parseFloat(match[0].replace(/,/g, ""));
  return isNaN(num) ? null : num;
}

/**
 * Extract a concentration string like "5mg", "10 mg", "2.5mg".
 * Returns null if nothing recognisable is found.
 */
export function parseConcentration(text: string): string | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|g|iu|ml)\b/i);
  if (!match) return null;
  return `${match[1]}${match[2].toLowerCase()}`;
}

/**
 * Map a vendor availability string to our enum values.
 */
export function normalizeAvailability(
  text: string,
): "in_stock" | "out_of_stock" | "pre_order" {
  const lower = text.toLowerCase();
  if (lower.includes("out of stock") || lower.includes("sold out") || lower.includes("unavailable")) {
    return "out_of_stock";
  }
  if (lower.includes("pre") && (lower.includes("order") || lower.includes("sale"))) {
    return "pre_order";
  }
  return "in_stock";
}

/**
 * Extract text content from an HTML string using a simple regex selector.
 * Supports only a subset of CSS: element, .class, #id, element.class.
 * For robust parsing, concrete fetchers should use a proper HTML parser.
 */
export function extractText(html: string, selector: string): string | null {
  // Build a loose regex for the selector
  const tagMatch = selector.match(/^([a-zA-Z][\w-]*)?(?:\.[\w-]+)*(?:#[\w-]+)?/);
  if (!tagMatch) return null;
  const tag = tagMatch[1] || "[a-zA-Z][\\w-]*";
  const classMatches = [...selector.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
  const idMatch = selector.match(/#([\w-]+)/);

  const classPattern = classMatches.length
    ? classMatches.map((c) => `(?:[^>]*class="[^"]*\\b${c}\\b[^"]*")`).join("")
    : "";
  const idPattern = idMatch ? `(?:[^>]*id="${idMatch[1]}")` : "";
  const attrPattern = [classPattern, idPattern].filter(Boolean).join("|");

  const re = attrPattern
    ? new RegExp(`<${tag}[^>]*(?:${attrPattern})[^>]*>([^<]*)<`, "i")
    : new RegExp(`<${tag}[^>]*>([^<]*)<`, "i");

  const m = html.match(re);
  return m ? m[1].trim() : null;
}
