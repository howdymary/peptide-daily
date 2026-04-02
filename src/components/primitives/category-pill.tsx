import { cn } from "@/lib/cn";
import { getCategoryMeta } from "@/lib/presentation";

export function CategoryPill({
  category,
  className,
}: {
  category?: string | null;
  className?: string;
}) {
  const meta = getCategoryMeta(category);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em]",
        className,
      )}
      style={{
        color: meta.token,
        background: "color-mix(in srgb, white 88%, " + meta.token + " 12%)",
        borderColor: "color-mix(in srgb, white 75%, " + meta.token + " 25%)",
      }}
    >
      {meta.label}
    </span>
  );
}
