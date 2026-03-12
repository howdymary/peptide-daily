/**
 * Entity / tag extraction for news articles.
 *
 * Uses keyword matching against known peptide names and theme tokens.
 * Returns a deduplicated, lowercase-normalised list of tags.
 *
 * TECH_NOTES — Adding new keywords:
 *  - PEPTIDE_KEYWORDS: maps any alias → canonical tag (e.g. "ozempic" → "semaglutide")
 *  - THEME_KEYWORDS:   maps topic tokens → theme tag (e.g. "clinical trial" → "research")
 *  - Any article matching ≥1 PEPTIDE_KEYWORDS entry is also tagged "peptides"
 */

const PEPTIDE_KEYWORDS: Record<string, string> = {
  // ── BPC-157 ────────────────────────────────────────────────────────────────
  "bpc-157": "BPC-157",
  bpc157: "BPC-157",
  "bpc 157": "BPC-157",
  "body protection compound": "BPC-157",
  "pentadecapeptide": "BPC-157",

  // ── TB-500 / Thymosin Beta-4 ───────────────────────────────────────────────
  "tb-500": "TB-500",
  tb500: "TB-500",
  "tb 500": "TB-500",
  "thymosin beta-4": "TB-500",
  "thymosin beta 4": "TB-500",
  "thymosin beta": "TB-500",
  "tβ4": "TB-500",

  // ── GLP-1 peptides ─────────────────────────────────────────────────────────
  semaglutide: "semaglutide",
  ozempic: "semaglutide",
  wegovy: "semaglutide",
  rybelsus: "semaglutide",
  tirzepatide: "tirzepatide",
  mounjaro: "tirzepatide",
  zepbound: "tirzepatide",
  liraglutide: "liraglutide",
  victoza: "liraglutide",
  saxenda: "liraglutide",
  exenatide: "exenatide",
  byetta: "exenatide",
  dulaglutide: "dulaglutide",
  trulicity: "dulaglutide",

  // ── Growth hormone peptides ────────────────────────────────────────────────
  ipamorelin: "ipamorelin",
  "cjc-1295": "CJC-1295",
  cjc1295: "CJC-1295",
  "cjc 1295": "CJC-1295",
  sermorelin: "sermorelin",
  hexarelin: "hexarelin",
  "mk-677": "MK-677",
  mk677: "MK-677",
  ibutamoren: "MK-677",
  "ghrp-2": "GHRP-2",
  ghrp2: "GHRP-2",
  "ghrp-6": "GHRP-6",
  ghrp6: "GHRP-6",
  tesamorelin: "tesamorelin",
  egrifta: "tesamorelin",
  "aod-9604": "AOD-9604",
  aod9604: "AOD-9604",

  // ── Cosmetic / skin peptides ───────────────────────────────────────────────
  "ghk-cu": "GHK-Cu",
  "ghk cu": "GHK-Cu",
  "copper peptide": "GHK-Cu",
  ghkcu: "GHK-Cu",
  "matrixyl": "matrixyl",
  "palmitoyl pentapeptide": "matrixyl",
  "syn-ake": "syn-ake",
  "argireline": "argireline",
  "acetyl hexapeptide": "argireline",

  // ── Sexual health / melanocortin ───────────────────────────────────────────
  "pt-141": "PT-141",
  pt141: "PT-141",
  bremelanotide: "PT-141",
  "melanotan ii": "Melanotan II",
  "melanotan 2": "Melanotan II",
  "melanotan-ii": "Melanotan II",
  "melanotan-2": "Melanotan II",
  "mt-ii": "Melanotan II",
  "mt2": "Melanotan II",

  // ── Healing / anti-inflammatory ───────────────────────────────────────────
  "epithalon": "epithalon",
  epitalon: "epithalon",
  "dihexa": "dihexa",
  "selank": "selank",
  "semax": "semax",
  "ll-37": "LL-37",
  ll37: "LL-37",
  "ss-31": "SS-31",
  "mots-c": "MOTS-c",
  "motsc": "MOTS-c",
  humanin: "humanin",
  "foxo4-dri": "FOXO4-DRI",
};

const THEME_KEYWORDS: Record<string, string> = {
  // ── GLP-1 / metabolic ─────────────────────────────────────────────────────
  "glp-1": "GLP-1",
  glp1: "GLP-1",
  "glucagon-like peptide": "GLP-1",
  "glucagon like peptide": "GLP-1",
  "weight loss": "weight-management",
  "weight management": "weight-management",
  obesity: "weight-management",
  obese: "weight-management",
  "anti-obesity": "weight-management",
  "visceral fat": "weight-management",
  diabetes: "metabolic",
  insulin: "metabolic",
  "blood sugar": "metabolic",
  "blood glucose": "metabolic",
  "metabolic syndrome": "metabolic",
  "type 2 diabetes": "metabolic",

  // ── Growth hormone ─────────────────────────────────────────────────────────
  "growth hormone": "growth-hormone",
  ghrh: "growth-hormone",
  "growth hormone secretagogue": "growth-hormone",
  "growth hormone releasing": "growth-hormone",
  igf: "growth-hormone",
  "igf-1": "growth-hormone",
  "insulin-like growth factor": "growth-hormone",

  // ── Recovery / musculoskeletal ────────────────────────────────────────────
  "tissue repair": "recovery",
  "wound healing": "recovery",
  "anti-inflammatory": "recovery",
  tendon: "recovery",
  muscle: "recovery",
  ligament: "recovery",
  "soft tissue": "recovery",
  regenerat: "recovery",  // matches regeneration, regenerative

  // ── Cosmetic / skin ────────────────────────────────────────────────────────
  collagen: "cosmetic",
  "skin health": "cosmetic",
  "anti-aging": "cosmetic",
  "anti-ageing": "cosmetic",
  wrinkle: "cosmetic",
  "hair loss": "cosmetic",
  alopecia: "cosmetic",
  skincare: "cosmetic",
  "skin peptide": "cosmetic",

  // ── Cognitive / neuropeptide ──────────────────────────────────────────────
  neuropeptide: "cognitive",
  "cognitive function": "cognitive",
  "brain health": "cognitive",
  nootropic: "cognitive",
  neuroprotect: "cognitive",

  // ── Regulatory / FDA ──────────────────────────────────────────────────────
  fda: "regulatory",
  "food and drug administration": "regulatory",
  "drug approval": "regulatory",
  "fda approval": "regulatory",
  "fda approved": "regulatory",
  "fda warning": "regulatory",
  "fda ban": "regulatory",
  compounding: "regulatory",
  "503b": "regulatory",
  "503a": "regulatory",
  dea: "regulatory",
  "drug scheduling": "regulatory",
  "controlled substance": "regulatory",

  // ── Research / clinical ───────────────────────────────────────────────────
  "clinical trial": "research",
  "clinical study": "research",
  "phase 1": "research",
  "phase 2": "research",
  "phase 3": "research",
  "phase i": "research",
  "phase ii": "research",
  "phase iii": "research",
  "randomized controlled": "research",
  "systematic review": "research",
  "meta-analysis": "research",
  "double-blind": "research",
  placebo: "research",

  // ── Safety ────────────────────────────────────────────────────────────────
  safety: "safety",
  "adverse event": "safety",
  "adverse effect": "safety",
  "side effect": "safety",
  toxicity: "safety",
  toxicol: "safety",
  contraindication: "safety",
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

/** Exported for testing */
export { PEPTIDE_KEYWORDS, THEME_KEYWORDS };
