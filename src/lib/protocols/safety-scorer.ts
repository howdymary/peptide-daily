/**
 * Computes an aggregate safety score (0–100) for a protocol
 * based on interaction severity and the number of peptides.
 */

import type { InteractionCheckResult } from "./interaction-checker";

export interface SafetyScoreResult {
  score: number;
  label: string;
  color: string;
}

/**
 * Score a protocol's safety based on interaction check results.
 *
 * Scoring logic:
 * - Start at 100
 * - Each "avoid" interaction: -30
 * - Each "caution" interaction: -10
 * - More than 4 peptides: -5 per additional (complexity penalty)
 * - Floor at 0
 */
export function computeSafetyScore(
  checkResult: InteractionCheckResult,
  peptideCount: number,
): SafetyScoreResult {
  let score = 100;

  for (const warning of checkResult.warnings) {
    if (warning.severity === "avoid") {
      score -= 30;
    } else if (warning.severity === "caution") {
      score -= 10;
    }
  }

  // Complexity penalty for large stacks
  if (peptideCount > 4) {
    score -= (peptideCount - 4) * 5;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    label: getSafetyLabel(score),
    color: getSafetyColor(score),
  };
}

function getSafetyLabel(score: number): string {
  if (score >= 80) return "Low Risk";
  if (score >= 60) return "Moderate";
  if (score >= 40) return "Elevated";
  if (score >= 20) return "High Risk";
  return "Critical";
}

function getSafetyColor(score: number): string {
  if (score >= 80) return "var(--grade-a, oklch(55% 0.18 145))";
  if (score >= 60) return "var(--grade-b, oklch(55% 0.12 240))";
  if (score >= 40) return "var(--grade-c, oklch(60% 0.14 80))";
  if (score >= 20) return "var(--grade-d, oklch(55% 0.16 25))";
  return "var(--grade-e, oklch(50% 0.2 15))";
}
