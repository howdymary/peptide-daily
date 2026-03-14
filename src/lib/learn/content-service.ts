/**
 * Content Service — single access point for educational guide content.
 *
 * All educational pages, peptide detail pages, news sidebars, and vendor
 * pages should call this module rather than importing peptide-data.ts directly.
 * Keeping consumption behind a service layer lets us swap the backing store
 * (static data → CMS → DB) without touching every call site.
 */

import {
  PEPTIDES,
  getPeptideBySlug,
  getPeptidesByGoal,
  getPeptidesByCategory,
  GOAL_LABELS,
  GOAL_DESCRIPTIONS,
  GOAL_ORDER,
  CATEGORY_LABELS,
  REGULATORY_LABELS,
  REGULATORY_COLORS,
} from "./peptide-data";
import type { PeptideContent, GoalTag } from "./peptide-data";

// ─── Re-exports so callers only need this one import ──────────────────────────
export type { PeptideContent, GoalTag };
export {
  PEPTIDES,
  GOAL_LABELS,
  GOAL_DESCRIPTIONS,
  GOAL_ORDER,
  CATEGORY_LABELS,
  REGULATORY_LABELS,
  REGULATORY_COLORS,
};

// ─── Lookup helpers ───────────────────────────────────────────────────────────

/** Returns the full content object for a peptide, or undefined if not found. */
export function getPeptideGuide(slug: string): PeptideContent | undefined {
  return getPeptideBySlug(slug);
}

/** Returns all peptides tagged with a given user-intent goal. */
export function getGuidesByGoal(goal: GoalTag): PeptideContent[] {
  return getPeptidesByGoal(goal);
}

/** Returns all peptides in a given research category. */
export { getPeptidesByCategory };

// ─── Safety content ───────────────────────────────────────────────────────────

export interface SafetySummary {
  headline: string;
  body: string;
  /** Points the "Learn more" link to the full guide safety section */
  learnMoreHref: string;
}

/**
 * Universal safety summary drawn from the guide's "Safety Information and
 * Risk Framing" section. Displayed on news pages, price comparisons, and
 * peptide detail screens.
 */
export function getSafetySummary(): SafetySummary {
  return {
    headline: "Educational content only — not medical advice.",
    body:
      "Peptide research spans FDA-approved medications with robust clinical data to investigational compounds with limited human evidence. Quality sourcing, medical supervision, and baseline monitoring are essential regardless of compound. Always consult a licensed healthcare provider before making any decisions about peptide use.",
    learnMoreHref: "/learn",
  };
}

// ─── Dosing philosophy content ────────────────────────────────────────────────

export type DosingApproach = "conservative" | "moderate" | "aggressive";

export interface DosingPhilosophyEntry {
  label: string;
  description: string;
  guideQuote: string;
}

/**
 * Returns a conceptual description of a dosing philosophy approach, drawn
 * from the guide. These descriptions are informational only — they never
 * specify quantities, frequencies, or administration details.
 */
export function getDosingPhilosophy(
  approach: DosingApproach,
): DosingPhilosophyEntry {
  const entries: Record<DosingApproach, DosingPhilosophyEntry> = {
    conservative: {
      label: "Conservative",
      description:
        "Starts at the lower end of ranges discussed in research. Prioritizes side-effect minimization and careful observation, with slower titration and longer evaluation periods.",
      guideQuote:
        "A conservative approach accepts potentially slower results in exchange for a lower risk of adverse effects and better tolerability.",
    },
    moderate: {
      label: "Moderate",
      description:
        "Balances efficacy goals with side-effect management. Reflects where many real-world clinical protocols cluster, without pushing toward upper ranges.",
      guideQuote:
        "A moderate approach represents where many real-world clinical protocols tend to cluster — balancing efficacy with tolerability.",
    },
    aggressive: {
      label: "Aggressive",
      description:
        "Characterized by the upper end of commonly referenced ranges and faster titration. Requires more frequent monitoring and carries higher potential for side effects.",
      guideQuote:
        "An aggressive approach is generally reserved for situations where clinical urgency justifies elevated risk, or for individuals who have demonstrated tolerability at lower levels.",
    },
  };
  return entries[approach];
}

// ─── Category risk themes ─────────────────────────────────────────────────────

export interface CategoryRiskTheme {
  category: PeptideContent["category"] | "immune" | "cognitive";
  primaryRisks: string[];
}

/** Returns the primary risk themes for a peptide category, from the guide. */
export function getCategoryRiskThemes(
  category: PeptideContent["category"],
): string[] {
  const themes: Record<PeptideContent["category"], string[]> = {
    metabolic: [
      "Gastrointestinal effects (nausea, vomiting, diarrhea)",
      "Pancreatitis risk — discussed in prescribing information",
      "Gallbladder-related events",
      "Thyroid considerations — GLP-1 agonists carry boxed warnings for medullary thyroid carcinoma",
      "Nutritional considerations with rapid weight loss",
    ],
    "growth-hormone": [
      "Fluid retention and joint discomfort",
      "Effects on glucose metabolism and insulin sensitivity",
      "Theoretical oncologic considerations with growth-promoting mechanisms",
      "Cortisol/prolactin elevation (more common with some older secretagogues)",
      "Long-term safety data is limited for most non-approved compounds",
    ],
    "tissue-repair": [
      "Theoretical concern about growth promotion in cancer contexts",
      "Injection site reactions and immune responses",
      "Poorly characterized long-term effects in humans",
      "Limited randomized controlled trial data",
    ],
    melanocortin: [
      "Nausea, facial flushing, and cardiovascular effects (Melanotan class)",
      "New or changing moles — important for skin cancer monitoring",
      "Blood pressure changes",
      "Multiple regulatory agencies have issued warnings about unregulated tanning peptides",
    ],
  };
  return themes[category] ?? [];
}
