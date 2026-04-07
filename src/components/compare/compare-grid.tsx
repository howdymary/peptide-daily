import Link from "next/link";
import {
  COMPARE_FIELDS,
  type ComparablePeptide,
} from "@/lib/compare/compare-fields";

interface CompareGridProps {
  peptides: ComparablePeptide[];
}

export function CompareGrid({ peptides }: CompareGridProps) {
  if (peptides.length < 2) {
    return null;
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Header row — peptide names */}
        <div
          className="grid gap-4 border-b pb-4"
          style={{
            gridTemplateColumns: `180px repeat(${peptides.length}, 1fr)`,
            borderColor: "var(--border-default)",
          }}
        >
          <div />
          {peptides.map((p) => (
            <div key={p.slug} className="text-center">
              <Link
                href={`/peptides/${p.slug}`}
                className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)]"
              >
                {p.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Field rows */}
        {COMPARE_FIELDS.map((field, i) => {
          const values = peptides.map((p) => field.extract(p));
          // Skip row if all values are null
          if (values.every((v) => v === null)) return null;

          return (
            <div
              key={field.key}
              className="grid items-start gap-4 border-b py-3"
              style={{
                gridTemplateColumns: `180px repeat(${peptides.length}, 1fr)`,
                borderColor: "var(--border-default)",
                background: i % 2 === 0 ? "transparent" : "var(--bg-tertiary)",
              }}
            >
              <div className="px-2 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                {field.label}
              </div>
              {values.map((value, j) => (
                <div
                  key={peptides[j].slug}
                  className="px-2 text-sm text-[var(--text-secondary)]"
                >
                  {value ?? (
                    <span className="text-[var(--text-tertiary)]">--</span>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
