import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/tools/calculator-layout";
import { DosageCalc } from "@/components/tools/dosage-calc";
import { ToolSchema } from "@/components/seo/tool-schema";

export const metadata: Metadata = {
  title: "Dosage Calculator | Peptide Daily",
  description:
    "Weight-based peptide dosage calculator with mcg/mg/kg conversions and research reference presets. Free, client-side calculator.",
};

export default function DosagePage() {
  return (
    <>
      <ToolSchema
        name="Dosage Calculator"
        description="Weight-based peptide dosage calculator with mcg/mg/kg conversions and research reference presets."
        path="/tools/dosage"
      />
      <CalculatorLayout
        title="Dosage Calculator"
        description="Calculate weight-based dosing with automatic unit conversion. Includes research reference presets for common peptides."
      >
        <DosageCalc />
      </CalculatorLayout>
    </>
  );
}
