"use client";

import { useState } from "react";
import { calculateVial, type VialResult } from "@/lib/tools/vial";

export function VialCalc() {
  const [peptideAmountMg, setPeptideAmountMg] = useState(5);
  const [doseMcg, setDoseMcg] = useState(250);
  const [dosesPerDay, setDosesPerDay] = useState(1);

  const result: VialResult | null =
    peptideAmountMg > 0 && doseMcg > 0 && dosesPerDay > 0
      ? calculateVial({ peptideAmountMg, doseMcg, dosesPerDay })
      : null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="surface-card space-y-5 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          Inputs
        </h2>

        <div>
          <label htmlFor="vial-amount" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
            Peptide per vial (mg)
          </label>
          <input
            id="vial-amount"
            type="number"
            min={0.1}
            step={0.1}
            value={peptideAmountMg}
            onChange={(e) => setPeptideAmountMg(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-lg tabular-nums text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
          />
          <div className="mt-1.5 flex gap-2">
            {[2, 5, 10, 15, 20, 30].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setPeptideAmountMg(v)}
                className="rounded-lg border border-[var(--border-default)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--accent-border)]"
              >
                {v}mg
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="dose-amount" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
            Dose per injection (mcg)
          </label>
          <input
            id="dose-amount"
            type="number"
            min={1}
            step={1}
            value={doseMcg}
            onChange={(e) => setDoseMcg(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-lg tabular-nums text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
          />
          <div className="mt-1.5 flex gap-2">
            {[100, 250, 500, 750, 1000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setDoseMcg(v)}
                className="rounded-lg border border-[var(--border-default)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--accent-border)]"
              >
                {v}mcg
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="doses-per-day" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
            Doses per day
          </label>
          <select
            id="doses-per-day"
            value={dosesPerDay}
            onChange={(e) => setDosesPerDay(parseInt(e.target.value, 10))}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)]"
          >
            <option value={1}>1x daily</option>
            <option value={2}>2x daily</option>
            <option value={3}>3x daily</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="surface-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          Results
        </h2>

        {result ? (
          <dl className="mt-5 space-y-4">
            <ResultRow label="Doses per vial" value={`${result.totalDoses}`} highlight />
            <ResultRow label="Days per vial" value={`${result.daysPerVial} days`} subtext={`${result.weeksPerVial} weeks`} highlight />
            <ResultRow label="Daily usage" value={`${result.dailyUsageMg} mg/day`} />
            <ResultRow label="Vials for 30 days" value={`${result.vialsFor30Days}`} />
            <ResultRow label="Vials for 90 days" value={`${result.vialsFor90Days}`} />
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
