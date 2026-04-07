/**
 * Maps Discovery Flow answers to peptide and provider recommendations.
 * All logic is deterministic — no AI model required.
 */

import { extractTags, type FlowAnswers } from "./flow-config";

export interface PeptideRecommendation {
  slug: string;
  name: string;
  category: string | null;
  relevanceScore: number;
  reason: string;
}

export interface ProviderRecommendation {
  slug: string;
  name: string;
  type: string;
  reason: string;
}

export interface DiscoveryResult {
  peptides: PeptideRecommendation[];
  providerTypes: string[];
  experienceLevel: string;
  tags: string[];
}

interface PeptideRecord {
  slug: string;
  name: string;
  category: string | null;
  goalTags: string[];
  regulatoryStatus: string | null;
}

/**
 * Generate recommendations from flow answers and available peptide data.
 */
export function generateRecommendations(
  answers: FlowAnswers,
  peptides: PeptideRecord[],
): DiscoveryResult {
  const tags = extractTags(answers);
  const experienceLevel = answers.experience ?? "beginner";

  // Score each peptide by tag overlap
  const scored: PeptideRecommendation[] = peptides
    .map((p) => {
      const overlap = p.goalTags.filter((t) => tags.includes(t)).length;
      if (overlap === 0) return null;

      // Bonus for FDA-approved compounds for beginners
      const regulatoryBonus =
        experienceLevel === "beginner" && p.regulatoryStatus === "fda-approved" ? 2 : 0;

      const relevanceScore = overlap + regulatoryBonus;
      const matchedTags = p.goalTags.filter((t) => tags.includes(t));
      const reason = `Matches your interest in ${matchedTags.join(", ")}`;

      return {
        slug: p.slug,
        name: p.name,
        category: p.category,
        relevanceScore,
        reason,
      };
    })
    .filter((r): r is PeptideRecommendation => r !== null)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 8);

  // Determine recommended provider types
  const providerTypes = deriveProviderTypes(answers);

  return {
    peptides: scored,
    providerTypes,
    experienceLevel,
    tags,
  };
}

function deriveProviderTypes(answers: FlowAnswers): string[] {
  switch (answers.sourcePreference) {
    case "clinical":
      return ["telehealth", "clinic"];
    case "pharmacy":
      return ["pharmacy_503a", "pharmacy_503b"];
    case "research":
      return ["online_vendor"];
    default:
      return ["telehealth", "clinic", "pharmacy_503a", "pharmacy_503b", "online_vendor"];
  }
}
