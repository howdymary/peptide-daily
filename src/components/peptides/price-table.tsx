import { AvailabilityBadge } from "@/components/ui/badge";
import type { PeptidePriceItem } from "@/types";

interface PriceTableProps {
  prices: PeptidePriceItem[];
}

export function PriceTable({ prices }: PriceTableProps) {
  if (prices.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)]">
        No vendor prices available yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="pb-3 font-medium text-[var(--muted)]">Vendor</th>
            <th className="pb-3 font-medium text-[var(--muted)]">Price</th>
            <th className="pb-3 font-medium text-[var(--muted)]">Concentration</th>
            <th className="pb-3 font-medium text-[var(--muted)]">Status</th>
            <th className="pb-3 font-medium text-[var(--muted)]">Updated</th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {prices.map((price, index) => (
            <tr key={price.id}>
              <td className="py-3 font-medium">
                {price.vendorName}
                {index === 0 && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Best Price
                  </span>
                )}
              </td>
              <td className="py-3 font-semibold">
                {price.currency === "USD" ? "$" : price.currency}
                {price.price.toFixed(2)}
              </td>
              <td className="py-3">{price.concentration}</td>
              <td className="py-3">
                <AvailabilityBadge status={price.availabilityStatus} />
              </td>
              <td className="py-3 text-[var(--muted)]">
                {new Date(price.lastUpdated).toLocaleDateString()}
              </td>
              <td className="py-3">
                <a
                  href={price.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
