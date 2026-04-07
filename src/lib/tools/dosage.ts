/**
 * Dosage calculator — pure math, no side effects.
 *
 * Calculates weight-based dosing and unit conversions for peptide research.
 */

export interface DosageInput {
  /** Body weight */
  bodyWeight: number;
  /** Weight unit */
  weightUnit: "kg" | "lbs";
  /** Dose per kg (mcg/kg) */
  doseMcgPerKg: number;
  /** Frequency per day */
  frequencyPerDay: number;
}

export interface DosageResult {
  /** Body weight in kg */
  bodyWeightKg: number;
  /** Single dose in mcg */
  singleDoseMcg: number;
  /** Single dose in mg */
  singleDoseMg: number;
  /** Daily total in mcg */
  dailyTotalMcg: number;
  /** Daily total in mg */
  dailyTotalMg: number;
  /** Weekly total in mcg */
  weeklyTotalMcg: number;
  /** Weekly total in mg */
  weeklyTotalMg: number;
}

const LBS_TO_KG = 0.453592;

export function calculateDosage(input: DosageInput): DosageResult {
  const bodyWeightKg =
    input.weightUnit === "lbs" ? input.bodyWeight * LBS_TO_KG : input.bodyWeight;

  const singleDoseMcg = bodyWeightKg * input.doseMcgPerKg;
  const dailyTotalMcg = singleDoseMcg * input.frequencyPerDay;
  const weeklyTotalMcg = dailyTotalMcg * 7;

  return {
    bodyWeightKg: round(bodyWeightKg, 2),
    singleDoseMcg: round(singleDoseMcg, 2),
    singleDoseMg: round(singleDoseMcg / 1000, 4),
    dailyTotalMcg: round(dailyTotalMcg, 2),
    dailyTotalMg: round(dailyTotalMcg / 1000, 4),
    weeklyTotalMcg: round(weeklyTotalMcg, 2),
    weeklyTotalMg: round(weeklyTotalMcg / 1000, 4),
  };
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/** Common dosage presets for research reference. */
export const DOSAGE_PRESETS: Record<string, { doseMcgPerKg: number; note: string }> = {
  "BPC-157": { doseMcgPerKg: 10, note: "Typical research range: 5-15 mcg/kg" },
  "TB-500": { doseMcgPerKg: 25, note: "Typical research range: 15-50 mcg/kg" },
  "Ipamorelin": { doseMcgPerKg: 3, note: "Typical research range: 1-5 mcg/kg" },
  "CJC-1295": { doseMcgPerKg: 2, note: "Typical research range: 1-3 mcg/kg" },
  "GHK-Cu": { doseMcgPerKg: 5, note: "Typical research range: 2-10 mcg/kg" },
};
