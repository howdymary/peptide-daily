import Link from "next/link";

export function EmptyVendorState({
  vendorName,
  vendorSlug,
  website,
}: {
  vendorName: string;
  vendorSlug: string;
  website?: string | null;
}) {
  return (
    <div
      className="flex h-full flex-col rounded-[1.5rem] border border-dashed p-6"
      style={{
        borderColor: "var(--border-hover)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.72), rgba(245,245,244,0.72))",
      }}
    >
      <div>
        <h3 className="font-[var(--font-newsreader)] text-2xl text-[var(--text-primary)]">
          {vendorName}
        </h3>
        {website && <p className="mt-1 text-sm text-[var(--text-secondary)]">{website}</p>}
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          Pending Finnrick review
        </p>
        <p className="text-sm leading-7 text-[var(--text-secondary)]">
          This vendor has been identified but has not yet been independently tested by
          Finnrick. We keep it visible so the directory feels current without pretending data
          exists where it does not.
        </p>
      </div>

      <div className="mt-auto pt-6">
        <Link
          href={`/vendors/${vendorSlug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)]"
        >
          View vendor profile <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
