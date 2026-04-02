"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

export function MobileNav({
  open,
  onClose,
  links,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  links: Array<{ href: string; label: string }>;
  pathname: string;
}) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-[rgba(28,25,23,0.2)] backdrop-blur-[2px] transition-opacity duration-200 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-[min(88vw,22rem)] border-l bg-[var(--bg-secondary)] p-6 shadow-[0_18px_48px_-28px_rgba(28,25,23,0.35)] transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        style={{ borderColor: "var(--border-default)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-[var(--font-newsreader)] text-2xl text-[var(--text-primary)]">
              Peptide Daily<span className="text-[var(--accent-primary)]">.</span>
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Clinical authority
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border px-3 py-1.5 text-sm text-[var(--text-secondary)]"
            style={{ borderColor: "var(--border-default)" }}
            aria-label="Close menu"
          >
            Close
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block rounded-2xl px-4 py-3 text-sm font-medium transition-colors"
                style={{
                  background: active ? "var(--bg-tertiary)" : "transparent",
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 space-y-3">
          <Link
            href="/auth/signin"
            onClick={onClose}
            className="block rounded-2xl border px-4 py-3 text-center text-sm font-medium text-[var(--text-secondary)]"
            style={{ borderColor: "var(--border-default)" }}
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            onClick={onClose}
            className="block rounded-2xl px-4 py-3 text-center text-sm font-semibold text-white"
            style={{ background: "var(--accent-primary)" }}
          >
            Join Free
          </Link>
        </div>
      </aside>
    </>
  );
}
