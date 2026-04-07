import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { DiscoveryFlow } from "@/components/discover/discovery-flow";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

export const metadata: Metadata = {
  title: "Discovery Flow | Peptide Daily",
  description:
    "Answer a few questions about your research goals and experience level to get personalized peptide and provider recommendations.",
};

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const peptides = await prisma.peptide.findMany({
    select: {
      slug: true,
      name: true,
      category: true,
      goalTags: true,
      regulatoryStatus: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="section-spacing">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Discovery</span>
          <h1 className="section-heading mt-4">Find what fits your research</h1>
          <p className="section-subheading">
            Answer four quick questions and we will surface the most relevant
            compounds and sources for your goals.
          </p>
        </div>

        <div className="mt-10">
          <DiscoveryFlow peptides={peptides} />
        </div>

        <MedicalDisclaimer variant="callout" className="mt-14" />
      </div>
    </div>
  );
}
