"use client";

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

const LINK_COLOR = "rgb(255 255 255 / 0.55)";
const LINK_HOVER = "rgb(255 255 255 / 0.90)";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto"
      style={{ background: "var(--brand-navy)" }}
    >
      {/* Main footer grid */}
      <div className="container-page py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="Peptide Daily home"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                style={{
                  background: "rgb(255 255 255 / 0.10)",
                  color: "rgb(255 255 255 / 0.9)",
                  border: "1px solid rgb(255 255 255 / 0.15)",
                }}
                aria-hidden="true"
              >
                PD
              </span>
              <span
                className="text-base leading-none text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Peptide Daily
              </span>
            </Link>

            <p
              className="mt-4 text-sm leading-relaxed"
              style={{ color: "rgb(255 255 255 / 0.55)" }}
            >
              Lab-verified peptide quality data and price comparison for
              evidence-driven consumers.
            </p>

            <p
              className="mt-4 text-xs leading-relaxed"
              style={{ color: "rgb(255 255 255 / 0.35)" }}
            >
              Prices updated every 15 minutes.
              <br />
              Finnrick data refreshed weekly.
            </p>

            {/* Disclaimer */}
            <div
              className="mt-5 rounded-lg p-3.5 text-xs leading-relaxed"
              style={{
                background: "rgb(255 255 255 / 0.05)",
                border: "1px solid rgb(255 255 255 / 0.08)",
                color: "rgb(255 255 255 / 0.45)",
              }}
            >
              <strong style={{ color: "rgb(255 255 255 / 0.65)" }}>
                Medical Disclaimer:
              </strong>{" "}
              Informational use only. Not medical advice. Peptides are research
              chemicals — consult a healthcare professional before use.{" "}
              <Link
                href="/about#disclaimer"
                className="underline transition-opacity hover:opacity-90"
                style={{ color: "rgb(255 255 255 / 0.55)" }}
              >
                Learn more
              </Link>
            </div>
          </div>

          {/* Popular peptides */}
          <div>
            <h3
              className="mb-4 text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold)" }}
            >
              Popular Peptides
            </h3>
            <ul className="space-y-2.5">
              {PEPTIDE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: LINK_COLOR }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = LINK_HOVER)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = LINK_COLOR)
                    }
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
              className="mb-4 text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold)" }}
            >
              Resources
            </h3>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: LINK_COLOR }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = LINK_HOVER)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = LINK_COLOR)
                    }
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
              className="mb-4 text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold)" }}
            >
              Data &amp; Legal
            </h3>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: LINK_COLOR }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = LINK_HOVER)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = LINK_COLOR)
                    }
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
                  className="text-sm transition-colors"
                  style={{ color: LINK_COLOR }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = LINK_HOVER)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = LINK_COLOR)
                  }
                >
                  Finnrick.com ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row"
          style={{
            borderColor: "rgb(255 255 255 / 0.08)",
            color: "rgb(255 255 255 / 0.3)",
          }}
        >
          <p>© {year} Peptide Daily. All rights reserved.</p>
          <p>
            Lab data sourced from{" "}
            <a
              href="https://www.finnrick.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-opacity hover:opacity-80"
              style={{ color: "rgb(255 255 255 / 0.45)" }}
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
