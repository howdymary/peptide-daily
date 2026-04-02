import { getSourceMeta } from "@/lib/presentation";

export function SourceBadge({ source }: { source?: string | null }) {
  const meta = getSourceMeta(source);

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium"
      style={{
        color: meta.color,
        background: meta.background,
        borderColor: meta.border,
      }}
    >
      <span>{meta.label}</span>
      <span aria-hidden="true">↗</span>
    </span>
  );
}
