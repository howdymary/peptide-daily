/**
 * Entity / tag extraction for news articles.
 *
 * Uses keyword matching against known peptide names and theme tokens.
 * Returns a deduplicated, lowercase-normalised list of tags.
 */

const PEPTIDE_KEYWORDS: Record<string, string> = {
  // Common peptides — maps keyword to canonical tag
  "bpc-157": "BPC-157",
  bpc157: "BPC-157",
  "body protection compound": "BPC-157",
  "tb-500": "TB-500",
  tb500: "TB-500",
  "thymosin beta": "TB-500",
  semaglutide: "semaglutide",
  ozempic: "semaglutide",
  wegovy: "semaglutide",
  tirzepatide: "tirzepatide",
  mounjaro: "tirzepatide",
  "ghk-cu": "GHK-Cu",
  "ghk cu": "GHK-Cu",
  "copper peptide": "GHK-Cu",
  ipamorelin: "ipamorelin",
  "cjc-1295": "CJC-1295",
  cjc1295: "CJC-1295",
  "pt-141": "PT-141",
  pt141: "PT-141",
  bremelanotide: "PT-141",
  "melanotan ii": "Melanotan II",
  "melanotan 2": "Melanotan II",
  aod9604: "AOD-9604",
  "aod-9604": "AOD-9604",
  sermorelin: "sermorelin",
  hexarelin: "hexarelin",
  "mk-677": "MK-677",
  mk677: "MK-677",
  ibutamoren: "MK-677",
};

const THEME_KEYWORDS: Record<string, string> = {
  // GLP-1 / metabolic
  "glp-1": "GLP-1",
  glp1: "GLP-1",
  "glucagon-like peptide": "GLP-1",
  "weight loss": "weight-management",
  obesity: "weight-management",
  diabetes: "metabolic",
  insulin: "metabolic",
  "blood sugar": "metabolic",
  // Growth hormone
  "growth hormone": "growth-hormone",
  ghrh: "growth-hormone",
  "growth hormone secretagogue": "growth-hormone",
  igf: "growth-hormone",
  // Recovery
  "tissue repair": "recovery",
  "wound healing": "recovery",
  "anti-inflammatory": "recovery",
  tendon: "recovery",
  // Cosmetic / skin
  collagen: "cosmetic",
  "skin health": "cosmetic",
  "anti-aging": "cosmetic",
  "anti-ageing": "cosmetic",
  wrinkle: "cosmetic",
  "hair loss": "cosmetic",
  // Regulatory
  fda: "regulatory",
  "food and drug administration": "regulatory",
  "drug approval": "regulatory",
  "clinical trial": "research",
  "phase 1": "research",
  "phase 2": "research",
  "phase 3": "research",
  "randomized controlled": "research",
  "systematic review": "research",
  // Safety
  safety: "safety",
  "adverse event": "safety",
  "side effect": "safety",
  toxicity: "safety",
};

/**
 * Extract tags from combined title + excerpt text.
 * Returns canonical tag strings, deduped and sorted.
 */
export function extractTags(title: string, excerpt: string | null): string[] {
  const haystack = `${title} ${excerpt ?? ""}`.toLowerCase();
  const found = new Set<string>();

  for (const [kw, tag] of Object.entries(PEPTIDE_KEYWORDS)) {
    if (haystack.includes(kw)) found.add(tag);
  }
  for (const [kw, tag] of Object.entries(THEME_KEYWORDS)) {
    if (haystack.includes(kw)) found.add(tag);
  }

  // Always tag with "peptides" if any peptide keyword matched
  const hasPeptide = [...found].some((t) =>
    Object.values(PEPTIDE_KEYWORDS).includes(t),
  );
  if (hasPeptide) found.add("peptides");

  return [...found].sort();
}
