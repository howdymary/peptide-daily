import Link from "next/link";
import { formatMonthYear } from "@/lib/presentation";

export function DataSourceTag({
  source = "Finnrick",
  lastUpdated,
  href = "/about#methodology",
}: {
  source?: string;
  lastUpdated?: string | Date | null;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-xs text-[var(--text-tertiary)] underline-offset-4 transition-colors hover:text-[var(--text-secondary)] hover:underline"
    >
      <span>Source: {source}</span>
      {lastUpdated && <span aria-hidden="true">·</span>}
      {lastUpdated && <span>Last tested {formatMonthYear(lastUpdated)}</span>}
    </Link>
  );
}
