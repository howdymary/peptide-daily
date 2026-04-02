import { FinnrickGradeBadge } from "@/components/primitives/finnrick-grade-badge";
import { formatCurrency, formatAbsoluteDate } from "@/lib/presentation";

export interface VendorPriceRowData {
  id: string;
  vendorName: string;
  vendorSlug: string;
  price: number;
  currency: string;
  concentration: string;
  grade: string | null;
  lastUpdated: string | Date;
  productUrl: string;
}

export function VendorPriceRow({ row }: { row: VendorPriceRowData }) {
  return (
    <tr className="table-row-hover">
      <td className="font-medium text-[var(--text-primary)]">{row.vendorName}</td>
      <td className="data-mono font-semibold text-[var(--text-primary)]">{formatCurrency(row.price, row.currency)}</td>
      <td className="text-[var(--text-secondary)]">{row.concentration}</td>
      <td><FinnrickGradeBadge grade={row.grade as never} size="sm" /></td>
      <td className="text-[var(--text-secondary)]">{formatAbsoluteDate(row.lastUpdated)}</td>
      <td>
        <a
          href={row.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[var(--accent-primary)]"
        >
          Vendor ↗
        </a>
      </td>
    </tr>
  );
}
