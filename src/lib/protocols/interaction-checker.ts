/**
 * Checks pairwise interactions between peptides in a protocol.
 * Used by the Protocol Builder to surface safety warnings.
 */

export interface InteractionRecord {
  peptideAId: string;
  peptideBId: string;
  severity: "safe" | "caution" | "avoid";
  description: string;
  source: string | null;
}

export interface InteractionWarning {
  peptideAName: string;
  peptideBName: string;
  severity: "safe" | "caution" | "avoid";
  description: string;
  source: string | null;
}

export interface InteractionCheckResult {
  warnings: InteractionWarning[];
  hasCritical: boolean;
  hasCaution: boolean;
  overallSeverity: "safe" | "caution" | "avoid";
}

/**
 * Check all pairwise interactions for a list of peptide IDs.
 * Returns warnings sorted by severity (avoid first, then caution).
 */
export function checkInteractions(
  peptideIds: string[],
  peptideNames: Map<string, string>,
  interactions: InteractionRecord[],
): InteractionCheckResult {
  const warnings: InteractionWarning[] = [];

  // Build lookup set for O(1) pair checking
  const interactionMap = new Map<string, InteractionRecord>();
  for (const interaction of interactions) {
    const keyAB = `${interaction.peptideAId}:${interaction.peptideBId}`;
    const keyBA = `${interaction.peptideBId}:${interaction.peptideAId}`;
    interactionMap.set(keyAB, interaction);
    interactionMap.set(keyBA, interaction);
  }

  // Check all pairs
  for (let i = 0; i < peptideIds.length; i++) {
    for (let j = i + 1; j < peptideIds.length; j++) {
      const key = `${peptideIds[i]}:${peptideIds[j]}`;
      const interaction = interactionMap.get(key);
      if (interaction && interaction.severity !== "safe") {
        warnings.push({
          peptideAName: peptideNames.get(peptideIds[i]) ?? peptideIds[i],
          peptideBName: peptideNames.get(peptideIds[j]) ?? peptideIds[j],
          severity: interaction.severity as "safe" | "caution" | "avoid",
          description: interaction.description,
          source: interaction.source,
        });
      }
    }
  }

  // Sort: avoid first, then caution
  warnings.sort((a, b) => {
    const order = { avoid: 0, caution: 1, safe: 2 };
    return order[a.severity] - order[b.severity];
  });

  const hasCritical = warnings.some((w) => w.severity === "avoid");
  const hasCaution = warnings.some((w) => w.severity === "caution");

  return {
    warnings,
    hasCritical,
    hasCaution,
    overallSeverity: hasCritical ? "avoid" : hasCaution ? "caution" : "safe",
  };
}
