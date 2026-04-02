import Link from "next/link";
import { CategoryPill } from "@/components/primitives/category-pill";
import { PriceTag } from "@/components/primitives/price-tag";
import { FinnrickGradeBadge } from "@/components/primitives/finnrick-grade-badge";
import { formatAbsoluteDate } from "@/lib/presentation";

interface VendorProductRow {
  id: string;
  peptideName: string;
  peptideSlug: string;
  peptideCategory?: string | null;
  price: number;
  currency: string;
  concentration: string;
  productUrl: string;
  availabilityStatus: string;
  lastUpdated: string | Date;
  grade?: "A" | "B" | "C" | "D" | "E" | null;
}

export function VendorProductTable({ rows }: { rows: VendorProductRow[] }) {
  return (
    <div className="table-shell overflow-hidden rounded-[1.5rem]">
      <div className="hidden grid-cols-[1.7fr_1fr_1fr_0.9fr_1fr] gap-4 border-b border-[var(--border-default)] bg-[var(--bg-tertiary)] px-5 py-3 text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] md:grid">
        <span>Peptide</span>
        <span>Category</span>
        <span>Price</span>
        <span>Grade</span>
        <span>Updated</span>
      </div>

      <div className="divide-y divide-[var(--border-default)]">
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="table-row-hover grid gap-4 px-5 py-5 md:grid-cols-[1.7fr_1fr_1fr_0.9fr_1fr]"
          >
            <div>
              <Link
                href={`/peptides/${row.peptideSlug}`}
                className="font-medium text-[var(--text-primary)] underline-offset-4 hover:text-[var(--accent-primary)] hover:underline"
              >
                {row.peptideName}
              </Link>
              <div className="mt-3 flex items-center gap-3 md:hidden">
                <CategoryPill category={row.peptideCategory} />
                <FinnrickGradeBadge grade={row.grade ?? null} size="sm" />
              </div>
              <div className="mt-3 md:hidden">
                <PriceTag amount={row.price} currency={row.currency} lowest={index === 0} />
              </div>
              <a
                href={row.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-xs text-[var(--info)] underline-offset-4 hover:underline"
              >
                Product page ↗
              </a>
            </div>

            <div className="hidden md:block">
              <CategoryPill category={row.peptideCategory} />
              <p className="mt-3 text-xs text-[var(--text-secondary)]">{row.concentration}</p>
            </div>

            <div className="hidden md:block">
              <PriceTag amount={row.price} currency={row.currency} lowest={index === 0} />
            </div>

            <div className="hidden md:flex md:items-center">
              <FinnrickGradeBadge grade={row.grade ?? null} size="md" />
            </div>

            <div className="text-sm text-[var(--text-secondary)]">
              <p>{formatAbsoluteDate(row.lastUpdated)}</p>
              <p className="mt-2 text-xs text-[var(--text-tertiary)] capitalize">
                {row.availabilityStatus.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
