import Link from "next/link";
import { CategoryPill } from "@/components/primitives/category-pill";
import { FinnrickGradeBadge } from "@/components/primitives/finnrick-grade-badge";
import { TrustScore } from "@/components/primitives/trust-score";
import { formatCurrency } from "@/lib/presentation";
import { DataSourceTag } from "@/components/primitives/data-source-tag";

export interface ComparisonRow {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  grade: string | null;
  lowestPrice: number | null;
  vendorCount: number;
  trustScore: number | null;
}

export function ComparisonTable({
  rows,
  lastUpdated,
}: {
  rows: ComparisonRow[];
  lastUpdated?: string | Date | null;
}) {
  if (rows.length === 0) {
    return (
      <div className="surface-card rounded-[1.5rem] px-6 py-14 text-center">
        <p className="font-[var(--font-newsreader)] text-3xl text-[var(--text-primary)]">
          No peptides match those filters.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-secondary)]">
          Try a broader search or include untested compounds to see the full catalog.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="table-shell hidden md:block">
        <table>
          <thead>
            <tr>
              <th>Peptide</th>
              <th>Category</th>
              <th>Grade</th>
              <th>Lowest</th>
              <th>Vendors</th>
              <th>Trust score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="table-row-hover">
                <td>
                  <Link href={`/peptides/${row.slug}`} className="font-medium text-[var(--text-primary)] hover:text-[var(--accent-primary)]">
                    {row.name}
                  </Link>
                </td>
                <td><CategoryPill category={row.category} /></td>
                <td><FinnrickGradeBadge grade={row.grade as never} size="sm" /></td>
                <td className="data-mono text-[var(--text-primary)]">{formatCurrency(row.lowestPrice)}</td>
                <td className="data-mono text-[var(--text-secondary)]">{row.vendorCount}</td>
                <td><TrustScore score={row.trustScore} size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {rows.map((row) => (
          <Link key={row.id} href={`/peptides/${row.slug}`} className="surface-card rounded-[1.5rem] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-[var(--text-primary)]">{row.name}</p>
                <div className="mt-2">
                  <CategoryPill category={row.category} />
                </div>
              </div>
              <FinnrickGradeBadge grade={row.grade as never} size="sm" />
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="data-mono text-lg font-semibold text-[var(--text-primary)]">
                  {formatCurrency(row.lowestPrice)}
                </p>
                <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                  {row.vendorCount} vendors
                </p>
              </div>
              <TrustScore score={row.trustScore} size="sm" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5">
        <DataSourceTag source="Vendor websites" lastUpdated={lastUpdated} href="/about#data-sources" />
      </div>
    </div>
  );
}
