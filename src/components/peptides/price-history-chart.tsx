export function PriceHistoryChart() {
  return (
    <div className="surface-card rounded-[1.5rem] p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
        Historical pricing
      </p>
      <h3 className="mt-3 text-2xl text-[var(--text-primary)]">Tracking starts with snapshots</h3>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
        The current schema stores live prices but not historical snapshots yet, so this page
        shows current market comparison rather than pretending time-series data exists. Once
        snapshots are recorded, this module can render 30-, 90-, and 180-day trends honestly.
      </p>
    </div>
  );
}
