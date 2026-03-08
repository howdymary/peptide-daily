import Link from "next/link";

const PEPTIDE_LINKS = [
  { href: "/peptides?search=bpc-157", label: "BPC-157" },
  { href: "/peptides?search=semaglutide", label: "Semaglutide" },
  { href: "/peptides?search=tb-500", label: "TB-500" },
  { href: "/peptides?search=ipamorelin", label: "Ipamorelin" },
  { href: "/peptides?search=ghk-cu", label: "GHK-Cu" },
];

const RESOURCE_LINKS = [
  { href: "/about", label: "How It Works" },
  { href: "/about#finnrick", label: "About Finnrick Ratings" },
  { href: "/about#trust-score", label: "Trust Score Explained" },
  { href: "/vendors", label: "All Vendors" },
];

const LEGAL_LINKS = [
  { href: "/about#disclaimer", label: "Disclaimer" },
  { href: "/about#data-sources", label: "Data Sources" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto border-t border-[var(--border)]"
      style={{ background: "var(--surface)" }}
    >
      {/* Disclaimer banner */}
      <div
        className="border-b border-[var(--border)] px-4 py-4"
        style={{ background: "var(--info-bg)" }}
      >
        <div className="container-page">
          <p
            className="text-center text-xs leading-relaxed"
            style={{ color: "var(--info)" }}
          >
            <strong>Medical Disclaimer:</strong> PeptidePal provides price and
            lab-testing data for informational purposes only. This is not medical
            advice. Peptides are research chemicals; consult a qualified
            healthcare professional before use. Finnrick ratings are
            independent third-party data published at{" "}
            <a
              href="https://www.finnrick.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              finnrick.com
            </a>{" "}
            and are not endorsed or modified by PeptidePal.
          </p>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-page py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-base font-bold"
              aria-label="PeptidePal home"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-md text-white text-xs font-bold"
                style={{ background: "var(--brand-navy)" }}
              >
                PP
              </span>
              <span style={{ color: "var(--brand-navy)" }}>PeptidePal</span>
            </Link>
            <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
              Lab-verified peptide quality data and price comparison for
              evidence-driven consumers.
            </p>
            <p className="mt-3 text-xs" style={{ color: "var(--muted-light)" }}>
              Prices updated every 15 minutes.
              <br />
              Finnrick data refreshed weekly.
            </p>
          </div>

          {/* Popular peptides */}
          <div>
            <h3
              className="mb-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Popular Peptides
            </h3>
            <ul className="space-y-2">
              {PEPTIDE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[var(--accent)]"
                    style={{ color: "var(--foreground-secondary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3
              className="mb-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Resources
            </h3>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[var(--accent)]"
                    style={{ color: "var(--foreground-secondary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data & Legal */}
          <div>
            <h3
              className="mb-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Data &amp; Legal
            </h3>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[var(--accent)]"
                    style={{ color: "var(--foreground-secondary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://www.finnrick.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-[var(--accent)]"
                  style={{ color: "var(--foreground-secondary)" }}
                >
                  Finnrick.com ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-6 text-xs sm:flex-row"
          style={{ color: "var(--muted-light)" }}
        >
          <p>© {year} PeptidePal. All rights reserved.</p>
          <p>
            Lab data sourced from{" "}
            <a
              href="https://www.finnrick.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              Finnrick
            </a>
            . Not affiliated with Finnrick.
          </p>
        </div>
      </div>
    </footer>
  );
}
