import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Peptide Tools & Calculators | Peptide Daily",
  description:
    "Free peptide research calculators: reconstitution, dosage, and doses-per-vial. All calculations run client-side with zero data collection.",
};

const TOOLS = [
  {
    href: "/tools/reconstitution",
    title: "Reconstitution Calculator",
    description:
      "Calculate concentration and syringe volume after reconstituting a lyophilized peptide vial with bacteriostatic water.",
    icon: "R",
  },
  {
    href: "/tools/dosage",
    title: "Dosage Calculator",
    description:
      "Compute weight-based dosing with unit conversion between mcg, mg, kg, and lbs. Includes research reference presets.",
    icon: "D",
  },
  {
    href: "/tools/doses-per-vial",
    title: "Doses per Vial",
    description:
      "Estimate how many doses a vial provides at your protocol, how long it lasts, and how many vials you need for 30 or 90 days.",
    icon: "V",
  },
];

export default function ToolsPage() {
  return (
    <div className="section-spacing">
      <div className="container-page max-w-3xl">
        <span className="eyebrow">Tools</span>
        <h1 className="section-heading mt-4">Research calculators</h1>
        <p className="section-subheading">
          Free, open-source peptide calculators. All math runs in your browser — we
          never collect or transmit your inputs.
        </p>

        <div className="mt-10 grid gap-5">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="surface-card group flex items-start gap-5 p-6 transition-shadow hover:shadow-md"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-[var(--font-newsreader)] text-xl font-bold text-white"
                style={{ background: "var(--accent-primary)" }}
              >
                {tool.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                  {tool.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
