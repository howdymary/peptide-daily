"use client";

import { useState, useMemo } from "react";
import {
  BUILTIN_PROFILES,
  generateProfileCurve,
  type PeptideKineticsProfile,
} from "@/lib/kinetics/curve-generator";

export function PKChart() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(["semaglutide"]);
  const [doseMultiplier, setDoseMultiplier] = useState(1.0);

  const profiles = BUILTIN_PROFILES;

  const curves = useMemo(() => {
    return selectedSlugs
      .map((slug) => {
        const profile = profiles.find((p) => p.slug === slug);
        if (!profile) return null;
        const data = generateProfileCurve(profile, doseMultiplier);
        return { profile, data };
      })
      .filter((c): c is { profile: PeptideKineticsProfile; data: { time: number; concentration: number }[] } => c !== null);
  }, [selectedSlugs, doseMultiplier, profiles]);

  // Find max time across all curves
  const maxTime = curves.reduce(
    (max, c) => Math.max(max, c.data[c.data.length - 1]?.time ?? 48),
    48,
  );

  function togglePeptide(slug: string) {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Controls */}
      <div className="space-y-5 lg:col-span-1">
        <div className="surface-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Select compounds
          </h2>
          <div className="mt-3 space-y-2">
            {profiles.map((p) => (
              <label key={p.slug} className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedSlugs.includes(p.slug)}
                  onChange={() => togglePeptide(p.slug)}
                  className="accent-[var(--accent-primary)]"
                />
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: p.color }}
                />
                <span className="text-sm text-[var(--text-primary)]">{p.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="surface-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Dose multiplier
          </h2>
          <input
            type="range"
            min={0.25}
            max={3}
            step={0.25}
            value={doseMultiplier}
            onChange={(e) => setDoseMultiplier(parseFloat(e.target.value))}
            className="mt-3 w-full accent-[var(--accent-primary)]"
          />
          <p className="mt-1 text-center text-sm tabular-nums text-[var(--text-primary)]">
            {doseMultiplier}x
          </p>
        </div>
      </div>

      {/* Chart area */}
      <div className="lg:col-span-2">
        <div className="surface-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Concentration over time
          </h2>

          {curves.length === 0 ? (
            <p className="mt-8 text-center text-sm text-[var(--text-tertiary)]">
              Select at least one compound to visualize.
            </p>
          ) : (
            <div className="mt-4">
              {/* SVG chart */}
              <svg
                viewBox={`0 0 800 400`}
                className="w-full"
                style={{ maxHeight: 400 }}
                role="img"
                aria-label="Pharmacokinetic concentration curves"
              >
                {/* Grid lines */}
                {[0.25, 0.5, 0.75, 1.0].map((y) => (
                  <line
                    key={y}
                    x1={60}
                    y1={360 - y * 320}
                    x2={780}
                    y2={360 - y * 320}
                    stroke="var(--border-default)"
                    strokeWidth={0.5}
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Axes */}
                <line x1={60} y1={360} x2={780} y2={360} stroke="var(--text-tertiary)" strokeWidth={1} />
                <line x1={60} y1={40} x2={60} y2={360} stroke="var(--text-tertiary)" strokeWidth={1} />

                {/* Y-axis label */}
                <text x={20} y={200} fill="var(--text-tertiary)" fontSize={11} textAnchor="middle" transform="rotate(-90 20 200)">
                  Relative concentration
                </text>

                {/* X-axis label */}
                <text x={420} y={395} fill="var(--text-tertiary)" fontSize={11} textAnchor="middle">
                  Time (hours)
                </text>

                {/* X-axis ticks */}
                {generateTimeTicks(maxTime).map((t) => (
                  <text
                    key={t}
                    x={60 + (t / maxTime) * 720}
                    y={378}
                    fill="var(--text-tertiary)"
                    fontSize={10}
                    textAnchor="middle"
                  >
                    {t}h
                  </text>
                ))}

                {/* Curves */}
                {curves.map(({ profile, data }) => {
                  const pathData = data
                    .map((point, i) => {
                      const x = 60 + (point.time / maxTime) * 720;
                      const y = 360 - point.concentration * 320;
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ");

                  return (
                    <path
                      key={profile.slug}
                      d={pathData}
                      fill="none"
                      stroke={profile.color}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4">
                {curves.map(({ profile }) => (
                  <div key={profile.slug} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: profile.color }}
                    />
                    <span className="text-[var(--text-primary)]">{profile.name}</span>
                    <span className="text-xs text-[var(--text-tertiary)]">
                      t&frac12; {profile.halfLifeHours}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PK data table */}
        {curves.length > 0 && (
          <div className="surface-card mt-5 p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Parameters
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--border-default)" }}>
                    <th className="py-2 text-left text-xs font-medium text-[var(--text-tertiary)]">Compound</th>
                    <th className="py-2 text-left text-xs font-medium text-[var(--text-tertiary)]">Route</th>
                    <th className="py-2 text-left text-xs font-medium text-[var(--text-tertiary)]">Tmax</th>
                    <th className="py-2 text-left text-xs font-medium text-[var(--text-tertiary)]">Half-life</th>
                    <th className="py-2 text-left text-xs font-medium text-[var(--text-tertiary)]">Bioavail.</th>
                    <th className="py-2 text-left text-xs font-medium text-[var(--text-tertiary)]">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {curves.map(({ profile }) => (
                    <tr key={profile.slug} className="border-b" style={{ borderColor: "var(--border-default)" }}>
                      <td className="py-2 font-medium text-[var(--text-primary)]">
                        <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: profile.color }} />
                        {profile.name}
                      </td>
                      <td className="py-2 text-[var(--text-secondary)]">{profile.route}</td>
                      <td className="py-2 tabular-nums text-[var(--text-secondary)]">{profile.tmaxHours}h</td>
                      <td className="py-2 tabular-nums text-[var(--text-secondary)]">{profile.halfLifeHours}h</td>
                      <td className="py-2 tabular-nums text-[var(--text-secondary)]">{Math.round(profile.bioavailability * 100)}%</td>
                      <td className="max-w-[200px] truncate py-2 text-xs text-[var(--text-tertiary)]">{profile.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function generateTimeTicks(maxTime: number): number[] {
  if (maxTime <= 48) return [0, 6, 12, 24, 36, 48];
  if (maxTime <= 168) return [0, 24, 48, 72, 120, 168];
  return [0, 48, 168, 336, 504, Math.round(maxTime)];
}
