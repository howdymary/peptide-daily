/**
 * Reconstitution calculator — pure math, no side effects.
 *
 * Given a lyophilized peptide vial and bacteriostatic water volume,
 * calculates the concentration per unit volume (mcg/tick on an insulin syringe).
 */

export interface ReconstitutionInput {
  /** Peptide amount in the vial (mg) */
  peptideAmountMg: number;
  /** Volume of bacteriostatic water added (mL) */
  waterVolumeMl: number;
  /** Desired dose per injection (mcg) */
  desiredDoseMcg: number;
  /** Syringe capacity in units (default: 100 = 1mL insulin syringe) */
  syringeUnits?: number;
}

export interface ReconstitutionResult {
  /** Concentration in mcg per mL */
  concentrationMcgPerMl: number;
  /** Concentration in mg per mL */
  concentrationMgPerMl: number;
  /** Volume to inject for desired dose (mL) */
  injectionVolumeMl: number;
  /** Syringe ticks (units on insulin syringe) for desired dose */
  syringeTicks: number;
  /** Total number of doses available from the vial */
  totalDoses: number;
}

export function calculateReconstitution(input: ReconstitutionInput): ReconstitutionResult {
  const { peptideAmountMg, waterVolumeMl, desiredDoseMcg, syringeUnits = 100 } = input;

  const peptideAmountMcg = peptideAmountMg * 1000;
  const concentrationMcgPerMl = peptideAmountMcg / waterVolumeMl;
  const concentrationMgPerMl = peptideAmountMg / waterVolumeMl;
  const injectionVolumeMl = desiredDoseMcg / concentrationMcgPerMl;
  const syringeTicks = (injectionVolumeMl / 1) * syringeUnits; // 1mL = syringeUnits ticks
  const totalDoses = peptideAmountMcg / desiredDoseMcg;

  return {
    concentrationMcgPerMl: round(concentrationMcgPerMl, 2),
    concentrationMgPerMl: round(concentrationMgPerMl, 4),
    injectionVolumeMl: round(injectionVolumeMl, 4),
    syringeTicks: round(syringeTicks, 1),
    totalDoses: round(totalDoses, 1),
  };
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
