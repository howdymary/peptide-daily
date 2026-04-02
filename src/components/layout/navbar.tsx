"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { MobileNav } from "@/components/layout/mobile-nav";

const NAV_LINKS = [
  { href: "/peptides", label: "Peptides" },
  { href: "/vendors", label: "Vendors" },
  { href: "/news", label: "News" },
  { href: "/learn", label: "Learn" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-200"
        style={{
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          background: scrolled ? "rgba(250,249,245,0.92)" : "rgba(250,249,245,0.84)",
          borderBottom: `1px solid ${scrolled ? "var(--border-default)" : "transparent"}`,
        }}
      >
        <div className="container-page flex h-16 items-center justify-between gap-6">
          <Link href="/" className="flex items-end gap-1">
            <span className="font-[var(--font-newsreader)] text-[1.65rem] leading-none text-[var(--text-primary)]">
              Peptide Daily
            </span>
            <span className="pb-1 text-2xl leading-none text-[var(--accent-primary)]">.</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-sm transition-colors",
                    active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-[var(--accent-primary)] transition-opacity duration-200",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/auth/signin"
              className="rounded-full border px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
              style={{ borderColor: "var(--border-default)" }}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-primary-hover)]"
              style={{ background: "var(--accent-primary)" }}
            >
              Join Free
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex rounded-full border px-3 py-2 text-sm text-[var(--text-secondary)] md:hidden"
            style={{ borderColor: "var(--border-default)" }}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </header>

      <MobileNav open={open} onClose={() => setOpen(false)} links={NAV_LINKS} pathname={pathname} />
    </>
  );
}
