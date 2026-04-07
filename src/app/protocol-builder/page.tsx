import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { BuilderCanvas } from "@/components/protocol/builder-canvas";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

export const metadata: Metadata = {
  title: "Protocol Builder | Peptide Daily",
  description:
    "Build a peptide protocol with interaction checking and safety scoring. Search compounds, check for known interactions, and share your protocol via a unique link.",
};

export const revalidate = 300;

export default async function ProtocolBuilderPage() {
  const peptides = await prisma.peptide.findMany({
    select: { id: true, slug: true, name: true, category: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="section-spacing">
      <div className="container-page">
        <span className="eyebrow">Protocol Builder</span>
        <h1 className="section-heading mt-4">Design your research protocol</h1>
        <p className="section-subheading">
          Add compounds, check for known interactions, and generate a shareable
          link. Safety scoring is based on published interaction data — always
          consult a qualified professional before acting on any protocol.
        </p>

        <div className="mt-10">
          <BuilderCanvas peptides={peptides} />
        </div>

        <MedicalDisclaimer variant="callout" className="mt-14" />
      </div>
    </div>
  );
}
