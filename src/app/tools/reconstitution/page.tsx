import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/tools/calculator-layout";
import { ReconstitutionCalc } from "@/components/tools/reconstitution-calc";
import { ToolSchema } from "@/components/seo/tool-schema";

export const metadata: Metadata = {
  title: "Reconstitution Calculator | Peptide Daily",
  description:
    "Calculate peptide concentration and injection volume after reconstituting a lyophilized vial with bacteriostatic water. Free, client-side calculator.",
};

export default function ReconstitutionPage() {
  return (
    <>
      <ToolSchema
        name="Reconstitution Calculator"
        description="Calculate peptide concentration and injection volume after reconstituting a lyophilized vial with bacteriostatic water."
        path="/tools/reconstitution"
      />
      <CalculatorLayout
        title="Reconstitution Calculator"
        description="Enter vial size, water volume, and desired dose to calculate concentration and syringe units."
      >
        <ReconstitutionCalc />
      </CalculatorLayout>
    </>
  );
}
