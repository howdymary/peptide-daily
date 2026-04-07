import Link from "next/link";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const TOOLS = [
  { href: "/tools/reconstitution", label: "Reconstitution" },
  { href: "/tools/dosage", label: "Dosage" },
  { href: "/tools/doses-per-vial", label: "Doses per Vial" },
];

export function CalculatorLayout({ title, description, children }: CalculatorLayoutProps) {
  return (
    <div className="section-spacing">
      <div className="container-page max-w-3xl">
        <nav className="mb-6 text-sm text-[var(--text-tertiary)]" aria-label="Breadcrumb">
          <Link href="/tools" className="hover:text-[var(--accent-primary)]">
            Tools
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--text-secondary)]">{title}</span>
        </nav>

        <div className="mb-6 flex flex-wrap gap-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-full border px-4 py-2 text-sm transition-colors hover:border-[var(--accent-border)] hover:text-[var(--accent-primary)]"
              style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
            >
              {tool.label}
            </Link>
          ))}
        </div>

        <span className="eyebrow">Calculator</span>
        <h1 className="section-heading mt-3">{title}</h1>
        <p className="section-subheading mb-8">{description}</p>

        {children}

        <MedicalDisclaimer variant="callout" className="mt-10" />
      </div>
    </div>
  );
}
