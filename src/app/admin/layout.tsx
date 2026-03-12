import Link from "next/link";

/**
 * Admin section layout — provides a consistent sidebar nav for all /admin/* pages.
 */

const NAV_ITEMS = [
  { href: "/admin", label: "Reviews", description: "Moderate user reviews" },
  { href: "/admin/vendor-health", label: "Vendor Health", description: "Scraping status & metrics" },
  { href: "/admin/debug", label: "Debug View", description: "Ingestion logs & price anomalies" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-10">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Sidebar nav */}
        <nav className="space-y-1">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Admin
          </p>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-[var(--surface-raised)]"
              style={{ color: "var(--foreground-secondary)" }}
            >
              <span className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>
                {item.label}
              </span>
              <span className="block text-xs" style={{ color: "var(--muted)" }}>
                {item.description}
              </span>
            </Link>
          ))}
        </nav>

        {/* Page content */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
