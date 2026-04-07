import type { Metadata } from "next";
import Link from "next/link";
import { PKChart } from "@/components/kinetics/pk-chart";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

export const metadata: Metadata = {
  title: "Kinetics Lab | Peptide Daily",
  description:
    "Interactive pharmacokinetic visualizer. Overlay concentration-time curves for multiple peptides, adjust dose multipliers, and compare half-lives side by side.",
};

export default function KineticsLabPage() {
  return (
    <div className="section-spacing">
      <div className="container-page">
        <nav className="mb-6 text-sm text-[var(--text-tertiary)]" aria-label="Breadcrumb">
          <Link href="/tools" className="hover:text-[var(--accent-primary)]">
            Tools
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--text-secondary)]">Kinetics Lab</span>
        </nav>

        <span className="eyebrow">Kinetics Lab</span>
        <h1 className="section-heading mt-4">Pharmacokinetic visualizer</h1>
        <p className="section-subheading">
          Overlay concentration-time curves for multiple compounds. Adjust dose
          multipliers and compare absorption, peak, and elimination profiles
          side by side. All curves are generated from published clinical PK data
          using a one-compartment model with first-order absorption.
        </p>

        <div className="mt-10">
          <PKChart />
        </div>

        <MedicalDisclaimer variant="callout" className="mt-14" />
      </div>
    </div>
  );
}
