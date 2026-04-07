import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/tools/calculator-layout";
import { VialCalc } from "@/components/tools/vial-calc";
import { ToolSchema } from "@/components/seo/tool-schema";

export const metadata: Metadata = {
  title: "Doses per Vial Calculator | Peptide Daily",
  description:
    "Calculate how many doses a peptide vial provides, how long it lasts, and how many vials you need for 30 or 90 days. Free, client-side calculator.",
};

export default function DosesPerVialPage() {
  return (
    <>
      <ToolSchema
        name="Doses per Vial Calculator"
        description="Calculate how many doses a peptide vial provides and how many vials you need for 30 or 90 days."
        path="/tools/doses-per-vial"
      />
      <CalculatorLayout
        title="Doses per Vial"
        description="Estimate vial duration and supply needs based on your dosing protocol."
      >
        <VialCalc />
      </CalculatorLayout>
    </>
  );
}
