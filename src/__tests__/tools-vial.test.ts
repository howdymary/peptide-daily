import { describe, it, expect } from "vitest";
import { calculateVial } from "@/lib/tools/vial";

describe("calculateVial", () => {
  it("calculates doses for 5mg vial at 250mcg once daily", () => {
    const result = calculateVial({
      peptideAmountMg: 5,
      doseMcg: 250,
      dosesPerDay: 1,
    });

    expect(result.totalDoses).toBe(20);
    expect(result.daysPerVial).toBe(20);
    expect(result.weeksPerVial).toBeCloseTo(2.9, 1);
    expect(result.dailyUsageMg).toBe(0.25);
  });

  it("calculates vials needed for 30 and 90 days", () => {
    const result = calculateVial({
      peptideAmountMg: 10,
      doseMcg: 500,
      dosesPerDay: 1,
    });

    expect(result.totalDoses).toBe(20);
    expect(result.daysPerVial).toBe(20);
    expect(result.vialsFor30Days).toBe(1.5);
    expect(result.vialsFor90Days).toBe(4.5);
  });

  it("handles twice daily dosing", () => {
    const result = calculateVial({
      peptideAmountMg: 5,
      doseMcg: 250,
      dosesPerDay: 2,
    });

    expect(result.totalDoses).toBe(20);
    expect(result.daysPerVial).toBe(10);
    expect(result.dailyUsageMg).toBe(0.5);
  });
});
