import { TimestampLive } from "@/components/primitives/timestamp-live";
import { formatMonthYear } from "@/lib/presentation";

export function LiveDataBar({
  priceUpdatedAt,
  articleCount,
  labUpdatedAt,
  compoundCount,
}: {
  priceUpdatedAt?: string | Date | null;
  articleCount: number;
  labUpdatedAt?: string | Date | null;
  compoundCount: number;
}) {
  return (
    <section className="border-y bg-[var(--bg-tertiary)] py-3" style={{ borderColor: "var(--border-default)" }}>
      <div className="container-page flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-secondary)]">
        <TimestampLive updatedAt={priceUpdatedAt} prefix="Prices updated" />
        <span aria-hidden="true" className="text-[var(--text-tertiary)]">·</span>
        <span className="data-mono">{articleCount} articles this week</span>
        <span aria-hidden="true" className="text-[var(--text-tertiary)]">·</span>
        <span>Lab data refreshed {labUpdatedAt ? formatMonthYear(labUpdatedAt) : "recently"}</span>
        <span aria-hidden="true" className="text-[var(--text-tertiary)]">·</span>
        <span>Tracking {compoundCount}+ compounds</span>
      </div>
    </section>
  );
}
