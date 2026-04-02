import { formatAbsoluteDate } from "@/lib/presentation";

interface PurityEntry {
  id: string;
  testDate: string;
  purity: number;
  vendorName?: string;
}

export function PurityDistribution({ entries }: { entries: PurityEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="surface-card rounded-[1.5rem] p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          Purity distribution
        </p>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          No Finnrick test results are attached to this peptide yet.
        </p>
      </div>
    );
  }

  const top = Math.max(...entries.map((entry) => entry.purity), 100);

  return (
    <div className="surface-card rounded-[1.5rem] p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
        Purity distribution
      </p>
      <div className="mt-5 space-y-4">
        {entries.slice(0, 8).map((entry) => (
          <div key={entry.id}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="text-[var(--text-primary)]">
                {entry.vendorName ?? "Finnrick sample"} · {formatAbsoluteDate(entry.testDate)}
              </span>
              <span className="font-mono text-[var(--text-secondary)]">{entry.purity.toFixed(2)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[rgba(168,162,158,0.18)]">
              <div
                className="h-full rounded-full bg-[var(--accent-primary)]"
                style={{ width: `${Math.min(100, (entry.purity / top) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
