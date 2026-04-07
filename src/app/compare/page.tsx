import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/db/prisma";
import { bestFinnrickGrade } from "@/lib/finnrick/trust-score";
import { CompareSelector } from "@/components/compare/compare-selector";
import { CompareGrid } from "@/components/compare/compare-grid";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";
import type { ComparablePeptide } from "@/lib/compare/compare-fields";
import type { FinnrickGrade } from "@/types";

export const metadata: Metadata = {
  title: "Compare Peptides Side by Side | Peptide Daily",
  description:
    "Select 2-3 peptides to compare mechanism, half-life, regulatory status, pricing, lab grades, and more in a side-by-side view.",
};

export const revalidate = 300;

async function getAllPeptideOptions() {
  return prisma.peptide.findMany({
    select: { slug: true, name: true, category: true },
    orderBy: { name: "asc" },
  });
}

async function getComparablePeptides(slugs: string[]): Promise<ComparablePeptide[]> {
  if (slugs.length === 0) return [];

  const peptides = await prisma.peptide.findMany({
    where: { slug: { in: slugs } },
    include: {
      prices: {
        select: {
          price: true,
          vendorId: true,
          vendor: { select: { name: true } },
          availabilityStatus: true,
        },
      },
      reviews: { select: { rating: true } },
      finnrickRatings: { select: { grade: true } },
    },
  });

  return peptides.map((p) => {
    const inStockPrices = p.prices.filter((pr) => pr.availabilityStatus === "in_stock");
    const bestPriceEntry = inStockPrices.length > 0
      ? inStockPrices.reduce((min, pr) => (Number(pr.price) < Number(min.price) ? pr : min))
      : null;
    const vendorCount = new Set(p.prices.map((pr) => pr.vendorId)).size;
    const avgRating =
      p.reviews.length > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : null;
    const bestGrade = bestFinnrickGrade(
      p.finnrickRatings.map((r) => ({ grade: r.grade as FinnrickGrade })),
    );

    return {
      name: p.name,
      slug: p.slug,
      description: p.description,
      category: p.category,
      molecularWeight: p.molecularWeight,
      halfLife: p.halfLife,
      administrationRoute: p.administrationRoute,
      regulatoryStatus: p.regulatoryStatus,
      goalTags: p.goalTags,
      aliases: p.aliases,
      mechanismOfAction: p.mechanismOfAction,
      bestPrice: bestPriceEntry ? Number(bestPriceEntry.price) : null,
      bestPriceVendor: bestPriceEntry?.vendor.name ?? null,
      vendorCount,
      bestFinnrickGrade: bestGrade,
      averageRating: avgRating,
      reviewCount: p.reviews.length,
    };
  });
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const slugsParam = typeof params.slugs === "string" ? params.slugs : "";
  const selectedSlugs = slugsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  const [allPeptides, comparablePeptides] = await Promise.all([
    getAllPeptideOptions(),
    getComparablePeptides(selectedSlugs),
  ]);

  return (
    <div className="section-spacing">
      <div className="container-page">
        <span className="eyebrow">Compare</span>
        <h1 className="section-heading mt-4">Side-by-side peptide comparison</h1>
        <p className="section-subheading">
          Select up to three peptides to compare across regulatory status, mechanism,
          pricing, lab grades, and research areas.
        </p>

        <div className="mt-8">
          <Suspense>
            <CompareSelector peptides={allPeptides} selected={selectedSlugs} />
          </Suspense>
        </div>

        <CompareGrid peptides={comparablePeptides} />

        {selectedSlugs.length > 0 && comparablePeptides.length === 0 && (
          <div className="mt-10 rounded-[1.75rem] border border-dashed border-[var(--border-default)] px-6 py-14 text-center">
            <p className="font-[var(--font-newsreader)] text-2xl text-[var(--text-primary)]">
              No matching peptides found
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm text-[var(--text-secondary)]">
              The selected peptides may not be in our database yet. Try searching for others.
            </p>
          </div>
        )}

        <MedicalDisclaimer variant="callout" className="mt-14" />
      </div>
    </div>
  );
}
