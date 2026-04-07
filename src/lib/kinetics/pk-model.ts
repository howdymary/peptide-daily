/**
 * One-compartment pharmacokinetic model with first-order absorption.
 *
 * Generates time-concentration curves for the Kinetics Lab visualizer.
 * All calculations are pure math — no side effects.
 */

export interface PKParams {
  /** Dose in mcg */
  dose: number;
  /** Volume of distribution in liters */
  vd: number;
  /** Absorption rate constant (1/h) */
  ka: number;
  /** Elimination rate constant (1/h) */
  ke: number;
  /** Bioavailability fraction (0–1) */
  bioavailability: number;
}

export interface PKDataPoint {
  /** Time in hours */
  time: number;
  /** Plasma concentration (arbitrary units, normalized) */
  concentration: number;
}

/**
 * Generate a time-concentration curve using one-compartment model
 * with first-order absorption (Bateman equation).
 *
 * C(t) = (F * D * ka) / (Vd * (ka - ke)) * (e^(-ke*t) - e^(-ka*t))
 */
export function generatePKCurve(
  params: PKParams,
  durationHours: number,
  points = 200,
): PKDataPoint[] {
  const { dose, vd, ka, ke, bioavailability } = params;
  const F = bioavailability;
  const coefficient = (F * dose * ka) / (vd * (ka - ke));

  const curve: PKDataPoint[] = [];
  const dt = durationHours / points;

  for (let i = 0; i <= points; i++) {
    const t = i * dt;
    const concentration = coefficient * (Math.exp(-ke * t) - Math.exp(-ka * t));
    curve.push({
      time: Math.round(t * 100) / 100,
      concentration: Math.max(0, Math.round(concentration * 1000) / 1000),
    });
  }

  return curve;
}

/**
 * Derive PK rate constants from published clinical parameters.
 * Most peptide literature reports Tmax and half-life, not ka/ke directly.
 */
export function deriveRateConstants(
  tmaxHours: number,
  halfLifeHours: number,
): { ka: number; ke: number } {
  const ke = Math.LN2 / halfLifeHours;
  // Approximate ka from Tmax: tmax = ln(ka/ke) / (ka - ke)
  // Iterative solution — start with ka ≈ 2-5x ke and refine
  let ka = ke * 3;
  for (let iter = 0; iter < 50; iter++) {
    const predictedTmax = Math.log(ka / ke) / (ka - ke);
    const error = predictedTmax - tmaxHours;
    ka -= error * 0.3; // damped Newton step
    if (Math.abs(error) < 0.01) break;
    if (ka <= ke) ka = ke * 1.1; // prevent invalid state
  }

  return {
    ka: Math.round(ka * 10000) / 10000,
    ke: Math.round(ke * 10000) / 10000,
  };
}

/**
 * Normalize a curve so the peak = 1.0.
 * Useful for overlaying multiple peptides on the same chart.
 */
export function normalizeCurve(curve: PKDataPoint[]): PKDataPoint[] {
  const peak = Math.max(...curve.map((p) => p.concentration));
  if (peak === 0) return curve;
  return curve.map((p) => ({
    time: p.time,
    concentration: Math.round((p.concentration / peak) * 1000) / 1000,
  }));
}
