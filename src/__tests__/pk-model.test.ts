import { describe, it, expect } from "vitest";
import {
  generatePKCurve,
  deriveRateConstants,
  normalizeCurve,
} from "@/lib/kinetics/pk-model";

describe("deriveRateConstants", () => {
  it("derives ka and ke from tmax and half-life", () => {
    const { ka, ke } = deriveRateConstants(1.0, 4.0);

    expect(ke).toBeCloseTo(0.1733, 2);
    expect(ka).toBeGreaterThan(ke);
  });

  it("handles long half-life compounds", () => {
    const { ka, ke } = deriveRateConstants(36, 168);

    expect(ke).toBeCloseTo(0.0041, 3);
    expect(ka).toBeGreaterThan(ke);
  });
});

describe("generatePKCurve", () => {
  it("returns correct number of data points", () => {
    const curve = generatePKCurve(
      { dose: 1000, vd: 10, ka: 1.0, ke: 0.2, bioavailability: 0.8 },
      48,
      100,
    );

    expect(curve.length).toBe(101); // 0 to 100 inclusive
  });

  it("starts at zero concentration", () => {
    const curve = generatePKCurve(
      { dose: 1000, vd: 10, ka: 1.0, ke: 0.2, bioavailability: 0.8 },
      48,
    );

    expect(curve[0].time).toBe(0);
    expect(curve[0].concentration).toBe(0);
  });

  it("reaches a peak then declines", () => {
    const curve = generatePKCurve(
      { dose: 1000, vd: 10, ka: 1.0, ke: 0.2, bioavailability: 0.8 },
      48,
    );

    const peakIdx = curve.reduce(
      (maxIdx, p, i) => (p.concentration > curve[maxIdx].concentration ? i : maxIdx),
      0,
    );

    // Peak should not be at the start or end
    expect(peakIdx).toBeGreaterThan(0);
    expect(peakIdx).toBeLessThan(curve.length - 1);

    // After peak, concentration should generally decline
    expect(curve[curve.length - 1].concentration).toBeLessThan(
      curve[peakIdx].concentration,
    );
  });

  it("returns non-negative concentrations", () => {
    const curve = generatePKCurve(
      { dose: 1000, vd: 10, ka: 1.0, ke: 0.2, bioavailability: 0.8 },
      48,
    );

    for (const point of curve) {
      expect(point.concentration).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("normalizeCurve", () => {
  it("normalizes peak to 1.0", () => {
    const curve = generatePKCurve(
      { dose: 1000, vd: 10, ka: 1.0, ke: 0.2, bioavailability: 0.8 },
      48,
    );
    const normalized = normalizeCurve(curve);

    const peak = Math.max(...normalized.map((p) => p.concentration));
    expect(peak).toBe(1);
  });

  it("preserves time values", () => {
    const curve = generatePKCurve(
      { dose: 1000, vd: 10, ka: 1.0, ke: 0.2, bioavailability: 0.8 },
      48,
      10,
    );
    const normalized = normalizeCurve(curve);

    for (let i = 0; i < curve.length; i++) {
      expect(normalized[i].time).toBe(curve[i].time);
    }
  });
});
