import { describe, it, expect } from "vitest";
import { calculateDosage } from "@/lib/tools/dosage";

describe("calculateDosage", () => {
  it("calculates correctly for 80kg at 10mcg/kg once daily", () => {
    const result = calculateDosage({
      bodyWeight: 80,
      weightUnit: "kg",
      doseMcgPerKg: 10,
      frequencyPerDay: 1,
    });

    expect(result.bodyWeightKg).toBe(80);
    expect(result.singleDoseMcg).toBe(800);
    expect(result.singleDoseMg).toBe(0.8);
    expect(result.dailyTotalMcg).toBe(800);
    expect(result.weeklyTotalMcg).toBe(5600);
  });

  it("converts lbs to kg correctly", () => {
    const result = calculateDosage({
      bodyWeight: 176,
      weightUnit: "lbs",
      doseMcgPerKg: 10,
      frequencyPerDay: 1,
    });

    expect(result.bodyWeightKg).toBeCloseTo(79.83, 1);
    expect(result.singleDoseMcg).toBeCloseTo(798.33, 0);
  });

  it("handles twice daily frequency", () => {
    const result = calculateDosage({
      bodyWeight: 70,
      weightUnit: "kg",
      doseMcgPerKg: 5,
      frequencyPerDay: 2,
    });

    expect(result.singleDoseMcg).toBe(350);
    expect(result.dailyTotalMcg).toBe(700);
    expect(result.weeklyTotalMcg).toBe(4900);
  });
});
