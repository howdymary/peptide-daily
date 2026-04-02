import Link from "next/link";
import { FinnrickGradeBadge } from "@/components/primitives/finnrick-grade-badge";
import { formatCurrency } from "@/lib/presentation";
import { DataSourceTag } from "@/components/primitives/data-source-tag";

export interface SnapshotRow {
  id: string;
  slug: string;
  name: string;
  category?: string | null;
  grade: string | null;
  lowestPrice: number | null;
  vendor: string | null;
  vendorCount: number;
  lastUpdated?: string | Date | null;
}

export function PriceSnapshot({ rows, lastUpdated }: { rows: SnapshotRow[]; lastUpdated?: string | Date | null }) {
  return (
    <section className="section-spacing">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="eyebrow">Price intelligence</span>
          <h2 className="section-heading mt-4">Price comparison</h2>
          <p className="section-subheading">
            Lowest verified prices across tracked vendors, presented as data first rather than
            merchandised cards.
          </p>
        </div>

        <div className="table-shell mt-8 hidden md:block">
          <table>
            <thead>
              <tr>
                <th>Peptide</th>
                <th>Grade</th>
                <th>Lowest</th>
                <th>Vendor</th>
                <th># Vendors</th>
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
                  <td><FinnrickGradeBadge grade={row.grade as never} size="sm" /></td>
                  <td className="data-mono font-semibold text-[var(--text-primary)]">{formatCurrency(row.lowestPrice)}</td>
                  <td className="text-[var(--text-secondary)]">{row.vendor ?? "—"}</td>
                  <td className="data-mono text-[var(--text-secondary)]">{row.vendorCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 md:hidden">
          {rows.map((row) => (
            <Link key={row.id} href={`/peptides/${row.slug}`} className="surface-card rounded-[1.4rem] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{row.name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{row.vendor ?? "Vendor pending"}</p>
                </div>
                <FinnrickGradeBadge grade={row.grade as never} size="sm" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="data-mono text-lg font-semibold text-[var(--text-primary)]">{formatCurrency(row.lowestPrice)}</span>
                <span className="text-xs uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                  {row.vendorCount} vendors
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Link href="/peptides" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)]">
            Compare all peptides <span aria-hidden="true">→</span>
          </Link>
          <DataSourceTag source="Vendor websites" lastUpdated={lastUpdated} href="/about#data-sources" />
        </div>
      </div>
    </section>
  );
}
