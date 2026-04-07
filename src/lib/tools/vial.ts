/**
 * Doses-per-vial calculator — pure math, no side effects.
 *
 * Calculates how many doses a single vial provides at a given protocol.
 */

export interface VialInput {
  /** Peptide amount in vial (mg) */
  peptideAmountMg: number;
  /** Single dose (mcg) */
  doseMcg: number;
  /** Doses per day */
  dosesPerDay: number;
}

export interface VialResult {
  /** Total doses from one vial */
  totalDoses: number;
  /** Days one vial lasts */
  daysPerVial: number;
  /** Weeks one vial lasts */
  weeksPerVial: number;
  /** Vials needed for 30 days */
  vialsFor30Days: number;
  /** Vials needed for 90 days */
  vialsFor90Days: number;
  /** Daily usage in mg */
  dailyUsageMg: number;
}

export function calculateVial(input: VialInput): VialResult {
  const { peptideAmountMg, doseMcg, dosesPerDay } = input;

  const peptideAmountMcg = peptideAmountMg * 1000;
  const totalDoses = peptideAmountMcg / doseMcg;
  const daysPerVial = totalDoses / dosesPerDay;
  const weeksPerVial = daysPerVial / 7;
  const dailyUsageMcg = doseMcg * dosesPerDay;
  const dailyUsageMg = dailyUsageMcg / 1000;
  const vialsFor30Days = 30 / daysPerVial;
  const vialsFor90Days = 90 / daysPerVial;

  return {
    totalDoses: round(totalDoses, 1),
    daysPerVial: round(daysPerVial, 1),
    weeksPerVial: round(weeksPerVial, 1),
    vialsFor30Days: Math.ceil(vialsFor30Days * 10) / 10,
    vialsFor90Days: Math.ceil(vialsFor90Days * 10) / 10,
    dailyUsageMg: round(dailyUsageMg, 4),
  };
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
