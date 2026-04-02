import { formatCurrency } from "@/lib/presentation";

export function PriceTag({
  amount,
  vendor,
  lowest = false,
  currency = "USD",
}: {
  amount?: number | null;
  vendor?: string | null;
  lowest?: boolean;
  currency?: string;
}) {
  if (amount == null) {
    return (
      <div className="inline-flex flex-col">
        <span className="font-mono text-sm text-[var(--text-tertiary)]">—</span>
      </div>
    );
  }

  const [symbol, ...rest] = formatCurrency(amount, currency);

  return (
    <div
      className="inline-flex flex-col rounded-xl border px-3 py-2"
      style={{
        borderColor: lowest ? "var(--accent-border)" : "var(--border-default)",
        background: lowest ? "var(--accent-subtle)" : "var(--bg-secondary)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[var(--text-tertiary)]">{symbol}</span>
        <span className="font-mono text-lg font-semibold tabular-nums text-[var(--text-primary)]">
          {rest.join("")}
        </span>
        {lowest && (
          <span className="rounded-full bg-[var(--bg-secondary)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--accent-primary)]">
            Lowest
          </span>
        )}
      </div>
      {vendor && <span className="text-xs text-[var(--text-secondary)]">{vendor}</span>}
    </div>
  );
}
