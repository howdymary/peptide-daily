import Link from "next/link";
import { NewsletterSignup } from "@/components/marketing/newsletter-signup";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

const PEPTIDES = [
  { href: "/peptides?search=semaglutide", label: "Semaglutide" },
  { href: "/peptides?search=bpc-157", label: "BPC-157" },
  { href: "/peptides?search=tb-500", label: "TB-500" },
  { href: "/peptides?search=ghk-cu", label: "GHK-Cu" },
];

const RESOURCES = [
  { href: "/learn", label: "Research Guides" },
  { href: "/news", label: "Research News" },
  { href: "/vendors", label: "Vendor Directory" },
  { href: "/about", label: "Methodology" },
];

const LEGAL = [
  { href: "/disclosure", label: "How We Make Money" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-[var(--bg-secondary)]" style={{ borderColor: "var(--border-default)" }}>
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.45fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <p className="font-[var(--font-newsreader)] text-[2rem] leading-none text-[var(--text-primary)]">
              Peptide Daily<span className="text-[var(--accent-primary)]">.</span>
            </p>
            <p className="mt-4 max-w-[32rem] text-sm leading-7 text-[var(--text-secondary)]">
              Independent peptide price comparison backed by third-party lab data from
              Finnrick. We surface the numbers, show our methodology, and avoid making claims
              the evidence does not support.
            </p>

            <div className="mt-6 max-w-xl">
              <NewsletterSignup variant="inline" />
            </div>

            <MedicalDisclaimer variant="footer" className="mt-6 max-w-2xl" />
          </div>

          <div>
            <p className="footer-heading">Popular Peptides</p>
            <div className="mt-4 space-y-3">
              {PEPTIDES.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="footer-heading">Resources</p>
            <div className="mt-4 space-y-3">
              {RESOURCES.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="footer-heading">Data & Legal</p>
            <div className="mt-4 space-y-3">
              {LEGAL.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
              <a
                href="https://www.finnrick.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Finnrick ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t pt-6 text-sm text-[var(--text-tertiary)] md:flex-row md:items-center md:justify-between" style={{ borderColor: "var(--border-default)" }}>
          <p>© {year} Peptide Daily. All rights reserved.</p>
          <p>Peptide Daily is not affiliated with Finnrick. All lab data is attributed to its original source.</p>
        </div>
      </div>
    </footer>
  );
}
