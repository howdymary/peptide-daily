"use client";

import { useState } from "react";
import { calculateDosage, DOSAGE_PRESETS, type DosageResult } from "@/lib/tools/dosage";

export function DosageCalc() {
  const [bodyWeight, setBodyWeight] = useState(80);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [doseMcgPerKg, setDoseMcgPerKg] = useState(10);
  const [frequencyPerDay, setFrequencyPerDay] = useState(1);

  const result: DosageResult | null =
    bodyWeight > 0 && doseMcgPerKg > 0 && frequencyPerDay > 0
      ? calculateDosage({ bodyWeight, weightUnit, doseMcgPerKg, frequencyPerDay })
      : null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="surface-card space-y-5 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          Inputs
        </h2>

        <div>
          <label htmlFor="body-weight" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
            Body weight
          </label>
          <div className="flex gap-2">
            <input
              id="body-weight"
              type="number"
              min={1}
              step={0.1}
              value={bodyWeight}
              onChange={(e) => setBodyWeight(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-lg tabular-nums text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
            />
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as "kg" | "lbs")}
              className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-3 text-sm text-[var(--text-primary)]"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="dose-per-kg" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
            Dose (mcg/kg)
          </label>
          <input
            id="dose-per-kg"
            type="number"
            min={0.1}
            step={0.1}
            value={doseMcgPerKg}
            onChange={(e) => setDoseMcgPerKg(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-lg tabular-nums text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
          />
        </div>

        <div>
          <label htmlFor="frequency" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
            Frequency (times per day)
          </label>
          <select
            id="frequency"
            value={frequencyPerDay}
            onChange={(e) => setFrequencyPerDay(parseInt(e.target.value, 10))}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)]"
          >
            <option value={1}>Once daily</option>
            <option value={2}>Twice daily</option>
            <option value={3}>Three times daily</option>
          </select>
        </div>

        {/* Presets */}
        <div>
          <p className="mb-2 text-xs font-medium text-[var(--text-tertiary)]">Quick presets</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(DOSAGE_PRESETS).map(([name, preset]) => (
              <button
                key={name}
                type="button"
                onClick={() => setDoseMcgPerKg(preset.doseMcgPerKg)}
                title={preset.note}
                className="rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--accent-primary)]"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="surface-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          Results
        </h2>

        {result ? (
          <dl className="mt-5 space-y-4">
            <ResultRow
              label="Body weight"
              value={`${result.bodyWeightKg} kg`}
            />
            <ResultRow
              label="Single dose"
              value={`${result.singleDoseMcg} mcg`}
              subtext={`${result.singleDoseMg} mg`}
              highlight
            />
            <ResultRow
              label="Daily total"
              value={`${result.dailyTotalMcg} mcg`}
              subtext={`${result.dailyTotalMg} mg`}
              highlight
            />
            <ResultRow
              label="Weekly total"
              value={`${result.weeklyTotalMcg} mcg`}
              subtext={`${result.weeklyTotalMg} mg`}
            />
          </dl>
        ) : (
          <p className="mt-5 text-sm text-[var(--text-tertiary)]">
            Enter valid values to see results.
          </p>
        )}
      </div>
    </div>
  );
}

function ResultRow({
  label,
  value,
  subtext,
  highlight,
}: {
  label: string;
  value: string;
  subtext?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: highlight ? "var(--accent-subtle)" : "var(--bg-tertiary)",
      }}
    >
      <dt className="text-xs text-[var(--text-tertiary)]">{label}</dt>
      <dd
        className="mt-0.5 tabular-nums text-lg font-semibold"
        style={{
          color: highlight ? "var(--accent-primary)" : "var(--text-primary)",
        }}
      >
        {value}
      </dd>
      {subtext && (
        <dd className="mt-0.5 text-xs text-[var(--text-tertiary)]">{subtext}</dd>
      )}
    </div>
  );
}
