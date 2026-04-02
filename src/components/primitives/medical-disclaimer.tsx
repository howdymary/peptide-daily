import { cn } from "@/lib/cn";

const variants = {
  inline: "text-xs text-[var(--text-tertiary)]",
  callout:
    "rounded-[1.25rem] border bg-[rgba(217,119,6,0.08)] border-[rgba(217,119,6,0.18)] px-5 py-4 text-sm text-[var(--text-secondary)]",
  footer:
    "rounded-[1.25rem] border bg-[var(--bg-tertiary)] border-[var(--border-default)] px-5 py-4 text-sm text-[var(--text-secondary)]",
} as const;

export function MedicalDisclaimer({
  variant = "inline",
  className,
}: {
  variant?: keyof typeof variants;
  className?: string;
}) {
  const heading =
    variant === "callout" || variant === "footer" ? (
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--warning)]">
        Research information only
      </p>
    ) : null;

  return (
    <div className={cn(variants[variant], className)}>
      {heading}
      <p>
        Peptide Daily is an informational resource only. Peptide research chemicals are not
        approved for human use by the FDA unless otherwise noted. Nothing on this site
        constitutes medical advice. Consult a qualified healthcare provider before using any
        peptide or research chemical.
      </p>
    </div>
  );
}
