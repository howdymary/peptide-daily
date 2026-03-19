"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/peptides", label: "Compare Prices" },
  { href: "/learn", label: "Learn" },
  { href: "/vendors", label: "Vendor Reviews" },
  { href: "/news", label: "News" },
  { href: "/about", label: "How We Source Data" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Ticker bar */}
      <div
        className="hidden sm:block border-b px-4 py-1.5 text-center text-xs"
        style={{
          background: "var(--brand-navy)",
          borderColor: "rgb(255 255 255 / 0.08)",
          color: "rgb(255 255 255 / 0.65)",
        }}
      >
        <span>Lab data sourced from </span>
        <a
          href="https://www.finnrick.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold transition-opacity hover:opacity-90"
          style={{ color: "var(--brand-accent)" }}
        >
          Finnrick
        </a>
        <span>
          {" "}{"\u00b7"} Prices refresh every 15 min {"\u00b7"} For research
          purposes only
        </span>
      </div>

      {/* Main nav bar */}
      <div
        className="border-b"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="container-page flex h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Peptide Daily home"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold tracking-tight shrink-0"
              style={{ background: "var(--brand-navy)" }}
              aria-hidden="true"
            >
              PD
            </span>
            <span
              className="text-lg leading-none"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--foreground)",
                letterSpacing: "-0.01em",
              }}
            >
              Peptide Daily
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-1 md:flex"
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
                  className="relative rounded-md px-3 py-2 text-sm font-medium transition-colors"
                  style={{
                    color: active
                      ? "var(--foreground)"
                      : "var(--muted)",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--foreground)";
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--muted)";
                  }}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{ background: "var(--brand-accent)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop auth buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/auth/signin"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-all"
              style={{
                color: "var(--foreground-secondary)",
                border: "1px solid var(--border)",
                background: "transparent",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--surface-raised)";
                el.style.borderColor = "var(--border-strong)";
                el.style.color = "var(--foreground)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.borderColor = "var(--border)";
                el.style.color = "var(--foreground-secondary)";
              }}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all"
              style={{
                background: "var(--brand-navy)",
                boxShadow: "0 1px 2px 0 rgb(15 39 68 / 0.15)",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--brand-navy-light)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--brand-navy)";
              }}
            >
              Create Free Account
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-md transition-colors md:hidden"
            style={{ color: "var(--foreground-secondary)" }}
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

        {/* Mobile menu drawer */}
        {mobileOpen && (
          <div
            className="border-t px-4 pb-4 pt-3 md:hidden"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <nav
              className="flex flex-col gap-0.5"
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-3 text-sm font-medium transition-colors"
                    style={{
                      color: active
                        ? "var(--foreground)"
                        : "var(--muted)",
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
                className="my-3"
                style={{ borderColor: "var(--border)" }}
              />
              <Link
                href="/auth/signin"
                className="rounded-md px-3 py-3 text-sm font-medium transition-colors"
                style={{ color: "var(--foreground-secondary)" }}
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="mt-3 block rounded-lg px-3 py-3 text-center text-sm font-semibold text-white"
                style={{
                  background: "var(--brand-navy)",
                  boxShadow: "0 1px 2px 0 rgb(15 39 68 / 0.15)",
                }}
                onClick={() => setMobileOpen(false)}
              >
                Create Free Account
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
