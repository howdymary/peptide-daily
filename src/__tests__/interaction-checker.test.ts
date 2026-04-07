import { describe, it, expect } from "vitest";
import { checkInteractions } from "@/lib/protocols/interaction-checker";
import { computeSafetyScore } from "@/lib/protocols/safety-scorer";

describe("checkInteractions", () => {
  const nameMap = new Map([
    ["a", "Peptide A"],
    ["b", "Peptide B"],
    ["c", "Peptide C"],
  ]);

  it("returns safe when no interactions exist", () => {
    const result = checkInteractions(["a", "b"], nameMap, []);

    expect(result.warnings).toHaveLength(0);
    expect(result.hasCritical).toBe(false);
    expect(result.hasCaution).toBe(false);
    expect(result.overallSeverity).toBe("safe");
  });

  it("detects caution interactions", () => {
    const interactions = [
      {
        peptideAId: "a",
        peptideBId: "b",
        severity: "caution" as const,
        description: "May compete for receptors",
        source: null,
      },
    ];

    const result = checkInteractions(["a", "b"], nameMap, interactions);

    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].severity).toBe("caution");
    expect(result.hasCaution).toBe(true);
    expect(result.overallSeverity).toBe("caution");
  });

  it("detects avoid interactions and sorts them first", () => {
    const interactions = [
      {
        peptideAId: "a",
        peptideBId: "b",
        severity: "caution" as const,
        description: "Minor",
        source: null,
      },
      {
        peptideAId: "b",
        peptideBId: "c",
        severity: "avoid" as const,
        description: "Major conflict",
        source: null,
      },
    ];

    const result = checkInteractions(["a", "b", "c"], nameMap, interactions);

    expect(result.warnings).toHaveLength(2);
    expect(result.warnings[0].severity).toBe("avoid");
    expect(result.warnings[1].severity).toBe("caution");
    expect(result.hasCritical).toBe(true);
    expect(result.overallSeverity).toBe("avoid");
  });

  it("handles bidirectional lookup (B-A finds A-B interaction)", () => {
    const interactions = [
      {
        peptideAId: "a",
        peptideBId: "b",
        severity: "caution" as const,
        description: "Test",
        source: null,
      },
    ];

    // Pass IDs in reverse order
    const result = checkInteractions(["b", "a"], nameMap, interactions);
    expect(result.warnings).toHaveLength(1);
  });
});

describe("computeSafetyScore", () => {
  it("returns 100 for no warnings with 2 peptides", () => {
    const checkResult = {
      warnings: [],
      hasCritical: false,
      hasCaution: false,
      overallSeverity: "safe" as const,
    };

    const score = computeSafetyScore(checkResult, 2);
    expect(score.score).toBe(100);
    expect(score.label).toBe("Low Risk");
  });

  it("deducts 30 for each avoid interaction", () => {
    const checkResult = {
      warnings: [
        { peptideAName: "A", peptideBName: "B", severity: "avoid" as const, description: "", source: null },
      ],
      hasCritical: true,
      hasCaution: false,
      overallSeverity: "avoid" as const,
    };

    const score = computeSafetyScore(checkResult, 2);
    expect(score.score).toBe(70);
  });

  it("deducts 10 for each caution interaction", () => {
    const checkResult = {
      warnings: [
        { peptideAName: "A", peptideBName: "B", severity: "caution" as const, description: "", source: null },
        { peptideAName: "B", peptideBName: "C", severity: "caution" as const, description: "", source: null },
      ],
      hasCritical: false,
      hasCaution: true,
      overallSeverity: "caution" as const,
    };

    const score = computeSafetyScore(checkResult, 3);
    expect(score.score).toBe(80);
  });

  it("applies complexity penalty above 4 peptides", () => {
    const checkResult = {
      warnings: [],
      hasCritical: false,
      hasCaution: false,
      overallSeverity: "safe" as const,
    };

    const score = computeSafetyScore(checkResult, 6);
    expect(score.score).toBe(90); // 100 - (6-4)*5 = 90
  });

  it("floors at 0", () => {
    const checkResult = {
      warnings: Array(5).fill({
        peptideAName: "A",
        peptideBName: "B",
        severity: "avoid" as const,
        description: "",
        source: null,
      }),
      hasCritical: true,
      hasCaution: false,
      overallSeverity: "avoid" as const,
    };

    const score = computeSafetyScore(checkResult, 8);
    expect(score.score).toBe(0);
    expect(score.label).toBe("Critical");
  });
});
