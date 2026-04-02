export function VendorTrustBreakdown({
  breakdown,
}: {
  breakdown: {
    lab: number;
    evidence: number;
    freshness: number;
  };
}) {
  const rows = [
    {
      label: "Lab quality",
      value: breakdown.lab,
      note: "Average Finnrick score translated to a 100-point scale.",
    },
    {
      label: "Evidence depth",
      value: breakdown.evidence,
      note: "Rewards broader peptide coverage and repeat testing.",
    },
    {
      label: "Freshness",
      value: breakdown.freshness,
      note: "Prioritizes recently refreshed lab results.",
    },
  ];

  return (
    <div className="surface-card rounded-[1.75rem] p-6">
      <p className="eyebrow">Methodology</p>
      <h2 className="mt-4 font-[var(--font-newsreader)] text-3xl text-[var(--text-primary)]">
        How this vendor score is built
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
        Vendor trust is a Peptide Daily composite based on Finnrick lab quality,
        testing depth, and recency. It&apos;s designed to be auditable, not hype-driven.
      </p>

      <div className="mt-8 space-y-5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-medium text-[var(--text-primary)]">{row.label}</span>
              <span className="font-mono text-[var(--text-secondary)]">{row.value}/100</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
              <div
                className="h-full rounded-full bg-[var(--accent-primary)] transition-[width] duration-500 ease-out"
                style={{ width: `${row.value}%` }}
              />
            </div>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{row.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
