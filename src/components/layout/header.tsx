"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/peptides", label: "Browse Peptides" },
  { href: "/vendors", label: "Vendors" },
  { href: "/about", label: "How It Works" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]"
      style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
          aria-label="PeptidePal home"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold"
            style={{ background: "var(--brand-navy)" }}
            aria-hidden="true"
          >
            PP
          </span>
          <span style={{ color: "var(--brand-navy)" }}>PeptidePal</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "bg-[var(--surface-raised)] text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth/signin"
            className="rounded-md px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
            style={{ background: "var(--brand-navy)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--brand-navy-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--brand-navy)")
            }
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)] md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-[var(--surface-raised)] text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]",
                ].join(" ")}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-[var(--border)]" />
            <Link
              href="/auth/signin"
              className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors"
              style={{ background: "var(--brand-navy)" }}
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
