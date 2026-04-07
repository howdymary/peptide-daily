"use client";

import { useState } from "react";
import { calculateReconstitution, type ReconstitutionResult } from "@/lib/tools/reconstitution";

export function ReconstitutionCalc() {
  const [peptideAmountMg, setPeptideAmountMg] = useState(5);
  const [waterVolumeMl, setWaterVolumeMl] = useState(2);
  const [desiredDoseMcg, setDesiredDoseMcg] = useState(250);
  const [syringeUnits, setSyringeUnits] = useState(100);

  const result: ReconstitutionResult | null =
    peptideAmountMg > 0 && waterVolumeMl > 0 && desiredDoseMcg > 0
      ? calculateReconstitution({ peptideAmountMg, waterVolumeMl, desiredDoseMcg, syringeUnits })
      : null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="surface-card space-y-5 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          Inputs
        </h2>

        <div>
          <label htmlFor="peptide-amount" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
            Peptide in vial (mg)
          </label>
          <input
            id="peptide-amount"
            type="number"
            min={0.1}
            step={0.1}
            value={peptideAmountMg}
            onChange={(e) => setPeptideAmountMg(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-lg tabular-nums text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
          />
          <div className="mt-1.5 flex gap-2">
            {[2, 5, 10, 15, 20].map((v) => (
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
          <label htmlFor="water-volume" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
            Bacteriostatic water (mL)
          </label>
          <input
            id="water-volume"
            type="number"
            min={0.1}
            step={0.1}
            value={waterVolumeMl}
            onChange={(e) => setWaterVolumeMl(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-lg tabular-nums text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
          />
          <div className="mt-1.5 flex gap-2">
            {[1, 2, 3, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setWaterVolumeMl(v)}
                className="rounded-lg border border-[var(--border-default)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--accent-border)]"
              >
                {v}mL
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="desired-dose" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
            Desired dose (mcg)
          </label>
          <input
            id="desired-dose"
            type="number"
            min={1}
            step={1}
            value={desiredDoseMcg}
            onChange={(e) => setDesiredDoseMcg(parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-lg tabular-nums text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
          />
          <div className="mt-1.5 flex gap-2">
            {[100, 250, 500, 1000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setDesiredDoseMcg(v)}
                className="rounded-lg border border-[var(--border-default)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--accent-border)]"
              >
                {v}mcg
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="syringe-units" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
            Syringe size (units)
          </label>
          <select
            id="syringe-units"
            value={syringeUnits}
            onChange={(e) => setSyringeUnits(parseInt(e.target.value, 10))}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)]"
          >
            <option value={30}>30 unit (0.3 mL)</option>
            <option value={50}>50 unit (0.5 mL)</option>
            <option value={100}>100 unit (1.0 mL)</option>
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
            <ResultRow label="Concentration" value={`${result.concentrationMcgPerMl} mcg/mL`} subtext={`${result.concentrationMgPerMl} mg/mL`} />
            <ResultRow label="Inject volume" value={`${result.injectionVolumeMl} mL`} highlight />
            <ResultRow label="Syringe ticks" value={`${result.syringeTicks} units`} highlight />
            <ResultRow label="Total doses" value={`${result.totalDoses} doses per vial`} />
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
