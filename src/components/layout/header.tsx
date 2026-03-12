"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/peptides", label: "Browse Peptides" },
  { href: "/vendors", label: "Vendors" },
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "How It Works" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* ── Ticker bar ─────────────────────────────────────────────────── */}
      <div
        className="hidden sm:block border-b px-4 py-1.5 text-center text-xs"
        style={{
          background: "var(--brand-navy)",
          borderColor: "rgb(255 255 255 / 0.08)",
          color: "rgb(255 255 255 / 0.65)",
        }}
      >
        <span>Lab data from </span>
        <a
          href="https://www.finnrick.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold transition-opacity hover:opacity-90"
          style={{ color: "var(--brand-gold)" }}
        >
          Finnrick
        </a>
        <span> · Prices updated every 15 min · For informational use only</span>
      </div>

      {/* ── Main nav bar ───────────────────────────────────────────────── */}
      <div
        className="border-b"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="container-page flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Peptide Daily home"
          >
            {/* Brand mark */}
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold tracking-tight shrink-0"
              style={{ background: "var(--brand-navy)" }}
              aria-hidden="true"
            >
              PD
            </span>
            {/* Wordmark — DM Serif Display */}
            <span
              className="text-lg leading-none"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--brand-navy)",
                letterSpacing: "-0.01em",
              }}
            >
              Peptide Daily
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-0.5 md:flex"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors"
                  style={{
                    color: active
                      ? "var(--brand-navy)"
                      : "var(--muted)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--foreground)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--muted)";
                  }}
                >
                  {link.label}
                  {/* Active underline */}
                  {active && (
                    <span
                      className="absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full"
                      style={{ background: "var(--brand-gold)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/auth/signin"
              className="rounded-md px-3.5 py-2 text-sm font-medium transition-colors"
              style={{ color: "var(--muted)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "var(--foreground)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--muted)")
              }
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--brand-navy)" }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md transition-colors md:hidden"
            style={{ color: "var(--muted)" }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="border-t px-4 py-3 md:hidden"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <nav className="flex flex-col gap-0.5" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                    style={{
                      color: active ? "var(--brand-navy)" : "var(--muted)",
                      background: active
                        ? "var(--surface-raised)"
                        : "transparent",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <hr
                className="my-2"
                style={{ borderColor: "var(--border)" }}
              />
              <Link
                href="/auth/signin"
                className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                style={{ color: "var(--muted)" }}
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="mt-1 rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-white"
                style={{ background: "var(--brand-navy)" }}
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
