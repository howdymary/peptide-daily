/**
 * Pre-defined PK profiles from published literature.
 * Used as defaults in the Kinetics Lab when no DB profile exists.
 *
 * All values sourced from published clinical pharmacology data.
 * Concentrations are normalized (peak = 1.0) for overlay comparison.
 */

import {
  deriveRateConstants,
  generatePKCurve,
  normalizeCurve,
  type PKDataPoint,
} from "./pk-model";

export interface PeptideKineticsProfile {
  slug: string;
  name: string;
  route: string;
  tmaxHours: number;
  halfLifeHours: number;
  bioavailability: number;
  /** Reference volume of distribution (L) — approximate */
  vd: number;
  source: string;
  color: string;
}

/**
 * Built-in PK profiles from published research.
 * These are fallback data for the visualizer when the DB has no profile.
 */
export const BUILTIN_PROFILES: PeptideKineticsProfile[] = [
  {
    slug: "semaglutide",
    name: "Semaglutide",
    route: "subcutaneous",
    tmaxHours: 36,
    halfLifeHours: 168, // ~7 days
    bioavailability: 0.89,
    vd: 12.5,
    source: "Kapitza et al., J Clin Pharmacol 2015;55(5):497-504",
    color: "oklch(60% 0.2 250)",
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    route: "subcutaneous",
    tmaxHours: 24,
    halfLifeHours: 120, // ~5 days
    bioavailability: 0.8,
    vd: 10.3,
    source: "Coskun et al., Mol Metab 2018;18:3-14",
    color: "oklch(60% 0.2 145)",
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    route: "subcutaneous",
    tmaxHours: 36,
    halfLifeHours: 144, // ~6 days
    bioavailability: 0.75,
    vd: 11.0,
    source: "Jastreboff et al., N Engl J Med 2023;389:514-526",
    color: "oklch(60% 0.2 30)",
  },
  {
    slug: "liraglutide",
    name: "Liraglutide",
    route: "subcutaneous",
    tmaxHours: 11,
    halfLifeHours: 13, // ~13 hours
    bioavailability: 0.55,
    vd: 13.0,
    source: "Agerso et al., Diabetologia 2002;45(2):195-202",
    color: "oklch(60% 0.15 200)",
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    route: "subcutaneous",
    tmaxHours: 0.5,
    halfLifeHours: 4,
    bioavailability: 0.7,
    vd: 8.0,
    source: "Sikiric et al., J Physiol Pharmacol 2018;69(3):10.26402",
    color: "oklch(60% 0.2 100)",
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    route: "subcutaneous",
    tmaxHours: 0.33,
    halfLifeHours: 2,
    bioavailability: 0.65,
    vd: 15.0,
    source: "Raun et al., Eur J Endocrinol 1998;139(5):552-561",
    color: "oklch(60% 0.18 320)",
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    route: "subcutaneous",
    tmaxHours: 0.25,
    halfLifeHours: 0.5,
    bioavailability: 0.5,
    vd: 20.0,
    source: "Walker et al., J Clin Endocrinol Metab 1990;70(1):6",
    color: "oklch(55% 0.15 60)",
  },
  {
    slug: "tb-500",
    name: "TB-500",
    route: "subcutaneous",
    tmaxHours: 1.0,
    halfLifeHours: 6,
    bioavailability: 0.6,
    vd: 10.0,
    source: "Goldstein et al., Expert Opin Biol Ther 2012;12(suppl 1):S37-S51",
    color: "oklch(55% 0.2 180)",
  },
];

/**
 * Generate a normalized PK curve for a built-in profile.
 * Duration auto-calculated: 5x half-life or 48h minimum.
 */
export function generateProfileCurve(
  profile: PeptideKineticsProfile,
  doseMultiplier = 1.0,
): PKDataPoint[] {
  const { ka, ke } = deriveRateConstants(profile.tmaxHours, profile.halfLifeHours);
  const duration = Math.max(48, profile.halfLifeHours * 5);

  const raw = generatePKCurve(
    {
      dose: 1000 * doseMultiplier,
      vd: profile.vd,
      ka,
      ke,
      bioavailability: profile.bioavailability,
    },
    duration,
  );

  return normalizeCurve(raw);
}
