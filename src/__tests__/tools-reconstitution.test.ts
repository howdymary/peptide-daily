import { describe, it, expect } from "vitest";
import { calculateReconstitution } from "@/lib/tools/reconstitution";

describe("calculateReconstitution", () => {
  it("calculates concentration correctly for 5mg vial with 2mL water", () => {
    const result = calculateReconstitution({
      peptideAmountMg: 5,
      waterVolumeMl: 2,
      desiredDoseMcg: 250,
    });

    expect(result.concentrationMcgPerMl).toBe(2500);
    expect(result.concentrationMgPerMl).toBe(2.5);
    expect(result.injectionVolumeMl).toBe(0.1);
    expect(result.syringeTicks).toBe(10);
    expect(result.totalDoses).toBe(20);
  });

  it("handles 10mg vial with 1mL water and 500mcg dose", () => {
    const result = calculateReconstitution({
      peptideAmountMg: 10,
      waterVolumeMl: 1,
      desiredDoseMcg: 500,
    });

    expect(result.concentrationMcgPerMl).toBe(10000);
    expect(result.injectionVolumeMl).toBe(0.05);
    expect(result.totalDoses).toBe(20);
  });

  it("adjusts for 30-unit syringe", () => {
    const result = calculateReconstitution({
      peptideAmountMg: 5,
      waterVolumeMl: 2,
      desiredDoseMcg: 250,
      syringeUnits: 30,
    });

    expect(result.syringeTicks).toBe(3);
  });

  it("handles small doses correctly", () => {
    const result = calculateReconstitution({
      peptideAmountMg: 2,
      waterVolumeMl: 3,
      desiredDoseMcg: 100,
    });

    expect(result.concentrationMcgPerMl).toBeCloseTo(666.67, 1);
    expect(result.totalDoses).toBe(20);
  });
});
