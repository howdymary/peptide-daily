/**
 * Seed script for development.
 * Run: npx tsx prisma/seed.ts
 *
 * Creates sample vendors, peptides, prices, Finnrick ratings, and
 * vendor mappings for local development.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding database...");

  // ── Vendors ──────────────────────────────────────────────────────────────

  const vp = await prisma.vendor.upsert({
    where: { name: "Verified Peptides" },
    update: {},
    create: {
      name: "Verified Peptides",
      slug: "verified-peptides",
      website: "https://verifiedpeptides.com",
    },
  });

  const pp = await prisma.vendor.upsert({
    where: { name: "Peptide Partners" },
    update: {},
    create: {
      name: "Peptide Partners",
      slug: "peptide-partners",
      website: "https://peptide.partners",
    },
  });

  const paradigm = await prisma.vendor.upsert({
    where: { name: "Paradigm Peptide" },
    update: {},
    create: {
      name: "Paradigm Peptide",
      slug: "paradigm-peptide",
      website: "https://paradigmpeptide.com",
    },
  });

  const polaris = await prisma.vendor.upsert({
    where: { name: "Polaris Peptides" },
    update: {},
    create: {
      name: "Polaris Peptides",
      slug: "polaris-peptides",
      website: "https://polarispeptides.com",
    },
  });

  const skye = await prisma.vendor.upsert({
    where: { name: "Skye Peptides" },
    update: {},
    create: {
      name: "Skye Peptides",
      slug: "skye-peptides",
      website: "https://skyepeptides.com",
    },
  });

  const vendors = [vp, pp, paradigm, polaris, skye];

  // ── Peptides ──────────────────────────────────────────────────────────────

  const peptideData = [
    { name: "BPC-157", description: "Body Protection Compound-157, a pentadecapeptide derived from human gastric juice." },
    { name: "TB-500", description: "Thymosin Beta-4 fragment, involved in tissue repair and regeneration." },
    { name: "GHK-Cu", description: "Copper peptide with wound healing, anti-aging, and anti-inflammatory properties." },
    { name: "Ipamorelin", description: "Selective growth hormone secretagogue with minimal side effects." },
    { name: "CJC-1295", description: "Growth hormone releasing hormone analog with extended half-life." },
    { name: "Semaglutide", description: "GLP-1 receptor agonist used for metabolic regulation." },
    { name: "PT-141", description: "Melanocortin receptor agonist originally developed for sexual dysfunction." },
    { name: "Melanotan II", description: "Synthetic analog of alpha-melanocyte-stimulating hormone." },
  ];

  const peptides = await Promise.all(
    peptideData.map((p) =>
      prisma.peptide.upsert({
        where: { name: p.name },
        update: {},
        create: {
          name: p.name,
          slug: slugify(p.name),
          description: p.description,
        },
      }),
    ),
  );

  // Helper: find peptide by name
  const getPeptide = (name: string) => {
    const p = peptides.find((x) => x.name === name);
    if (!p) throw new Error(`Peptide not found: ${name}`);
    return p;
  };

  // ── Prices ────────────────────────────────────────────────────────────────

  const priceEntries = [
    // Verified Peptides
    { peptideIdx: 0, vendor: vp, price: 39.99, conc: "5mg", sku: "VP-BPC157-5", status: "in_stock" },
    { peptideIdx: 1, vendor: vp, price: 34.99, conc: "5mg", sku: "VP-TB500-5", status: "in_stock" },
    { peptideIdx: 2, vendor: vp, price: 42.99, conc: "50mg", sku: "VP-GHKCU-50", status: "in_stock" },
    { peptideIdx: 3, vendor: vp, price: 29.99, conc: "5mg", sku: "VP-IPA-5", status: "in_stock" },
    { peptideIdx: 4, vendor: vp, price: 37.99, conc: "5mg", sku: "VP-CJC1295-5", status: "out_of_stock" },
    { peptideIdx: 5, vendor: vp, price: 89.99, conc: "3mg", sku: "VP-SEMA-3", status: "in_stock" },
    { peptideIdx: 6, vendor: vp, price: 28.99, conc: "10mg", sku: "VP-PT141-10", status: "in_stock" },
    { peptideIdx: 7, vendor: vp, price: 24.99, conc: "10mg", sku: "VP-MT2-10", status: "in_stock" },
    // Peptide Partners
    { peptideIdx: 0, vendor: pp, price: 36.50, conc: "5mg", sku: "PP-BPC157-5", status: "in_stock" },
    { peptideIdx: 1, vendor: pp, price: 32.00, conc: "5mg", sku: "PP-TB500-5", status: "in_stock" },
    { peptideIdx: 2, vendor: pp, price: 45.00, conc: "50mg", sku: "PP-GHKCU-50", status: "in_stock" },
    { peptideIdx: 3, vendor: pp, price: 27.50, conc: "5mg", sku: "PP-IPA-5", status: "in_stock" },
    { peptideIdx: 4, vendor: pp, price: 35.00, conc: "5mg", sku: "PP-CJC1295-5", status: "in_stock" },
    { peptideIdx: 5, vendor: pp, price: 94.99, conc: "3mg", sku: "PP-SEMA-3", status: "pre_order" },
    { peptideIdx: 6, vendor: pp, price: 31.50, conc: "10mg", sku: "PP-PT141-10", status: "in_stock" },
    { peptideIdx: 7, vendor: pp, price: 22.99, conc: "10mg", sku: "PP-MT2-10", status: "in_stock" },
    // Paradigm Peptide
    { peptideIdx: 0, vendor: paradigm, price: 38.99, conc: "5mg", sku: "PAR-BPC157-5", status: "in_stock" },
    { peptideIdx: 1, vendor: paradigm, price: 33.99, conc: "5mg", sku: "PAR-TB500-5", status: "in_stock" },
    { peptideIdx: 3, vendor: paradigm, price: 30.99, conc: "5mg", sku: "PAR-IPA-5", status: "in_stock" },
    { peptideIdx: 4, vendor: paradigm, price: 36.99, conc: "5mg", sku: "PAR-CJC1295-5", status: "in_stock" },
    { peptideIdx: 5, vendor: paradigm, price: 87.99, conc: "3mg", sku: "PAR-SEMA-3", status: "in_stock" },
    { peptideIdx: 6, vendor: paradigm, price: 27.99, conc: "10mg", sku: "PAR-PT141-10", status: "in_stock" },
    // Polaris Peptides
    { peptideIdx: 0, vendor: polaris, price: 37.50, conc: "5mg", sku: "POL-BPC157-5", status: "in_stock" },
    { peptideIdx: 1, vendor: polaris, price: 33.50, conc: "5mg", sku: "POL-TB500-5", status: "in_stock" },
    { peptideIdx: 2, vendor: polaris, price: 43.50, conc: "50mg", sku: "POL-GHKCU-50", status: "out_of_stock" },
    { peptideIdx: 3, vendor: polaris, price: 28.50, conc: "5mg", sku: "POL-IPA-5", status: "in_stock" },
    { peptideIdx: 4, vendor: polaris, price: 34.50, conc: "5mg", sku: "POL-CJC1295-5", status: "in_stock" },
    { peptideIdx: 5, vendor: polaris, price: 88.50, conc: "3mg", sku: "POL-SEMA-3", status: "in_stock" },
    // Skye Peptides
    { peptideIdx: 0, vendor: skye, price: 40.00, conc: "5mg", sku: "SKYE-BPC157-5", status: "in_stock" },
    { peptideIdx: 1, vendor: skye, price: 35.00, conc: "5mg", sku: "SKYE-TB500-5", status: "in_stock" },
    { peptideIdx: 5, vendor: skye, price: 92.00, conc: "3mg", sku: "SKYE-SEMA-3", status: "in_stock" },
  ];

  for (const entry of priceEntries) {
    const peptide = peptides[entry.peptideIdx];
    await prisma.peptidePrice.upsert({
      where: {
        peptideId_vendorId_sku: {
          peptideId: peptide.id,
          vendorId: entry.vendor.id,
          sku: entry.sku,
        },
      },
      update: { price: entry.price },
      create: {
        peptideId: peptide.id,
        vendorId: entry.vendor.id,
        price: entry.price,
        currency: "USD",
        concentration: entry.conc,
        sku: entry.sku,
        productUrl: `${entry.vendor.website}/product/${slugify(peptide.name)}`,
        availabilityStatus: entry.status,
      },
    });
  }

  // ── Vendor Mappings ───────────────────────────────────────────────────────

  const mappings = [
    {
      vendor: vp,
      finnrickSlug: "verified-peptides",
      vendorDomain: "verifiedpeptides.com",
      scrapingEnabled: true,
      scrapingAdapter: "VerifiedPeptidesFetcher",
    },
    {
      vendor: pp,
      finnrickSlug: "peptide-partners",
      vendorDomain: "peptide.partners",
      scrapingEnabled: false,
      scrapingAdapter: "PeptidePartnersFetcher",
      notes: "JS-rendered SPA — manual import only",
    },
    {
      vendor: paradigm,
      finnrickSlug: "paradigm-peptide",
      vendorDomain: "paradigmpeptide.com",
      scrapingEnabled: true,
      scrapingAdapter: "ParadigmPeptideFetcher",
    },
    {
      vendor: polaris,
      finnrickSlug: "polaris-peptides",
      vendorDomain: "polarispeptides.com",
      scrapingEnabled: true,
      scrapingAdapter: "PolarisPeptidesFetcher",
    },
    {
      vendor: skye,
      finnrickSlug: "skye-peptides",
      vendorDomain: "skyepeptides.com",
      scrapingEnabled: false,
      scrapingAdapter: "SkyePeptidesFetcher",
      notes: "JS-rendered — manual import only",
    },
  ];

  for (const m of mappings) {
    await prisma.vendorMapping.upsert({
      where: { vendorId: m.vendor.id },
      update: {
        finnrickSlug: m.finnrickSlug,
        vendorDomain: m.vendorDomain,
        scrapingEnabled: m.scrapingEnabled,
        scrapingAdapter: m.scrapingAdapter ?? null,
        notes: m.notes ?? null,
      },
      create: {
        vendorId: m.vendor.id,
        finnrickSlug: m.finnrickSlug,
        vendorDomain: m.vendorDomain,
        scrapingEnabled: m.scrapingEnabled,
        scrapingAdapter: m.scrapingAdapter ?? null,
        rateLimit: 6,
        notes: m.notes ?? null,
      },
    });
  }

  // ── Finnrick Ratings ──────────────────────────────────────────────────────

  const seedBatchId = "seed-batch-001";

  // Create a FinnrickImport audit record for the seed data
  await prisma.finnrickImport.upsert({
    where: { id: seedBatchId },
    update: {},
    create: {
      id: seedBatchId,
      filename: "seed-data",
      format: "json",
      recordCount: 10,
      errorCount: 0,
      status: "completed",
      completedAt: new Date(),
      importedBy: "seed",
    },
  });

  const finnrickRatings = [
    // Peptide Partners — BPC-157: A
    {
      vendor: pp, peptideName: "BPC-157", grade: "A" as const,
      averageScore: 8.1, testCount: 6, minScore: 6.9, maxScore: 10.0,
      oldestTestDate: new Date("2025-10-23"), newestTestDate: new Date("2025-11-06"),
      finnrickUrl: "https://www.finnrick.com/products/bpc-157/peptide-partners",
    },
    // Peptide Partners — Ipamorelin: A
    {
      vendor: pp, peptideName: "Ipamorelin", grade: "A" as const,
      averageScore: 8.9, testCount: 7, minScore: 7.5, maxScore: 10.0,
      oldestTestDate: new Date("2025-09-01"), newestTestDate: new Date("2025-11-10"),
      finnrickUrl: "https://www.finnrick.com/products/ipamorelin/peptide-partners",
    },
    // Peptide Partners — TB-500: A
    {
      vendor: pp, peptideName: "TB-500", grade: "A" as const,
      averageScore: 8.6, testCount: 6, minScore: 7.2, maxScore: 10.0,
      oldestTestDate: new Date("2025-09-15"), newestTestDate: new Date("2025-11-05"),
      finnrickUrl: null,
    },
    // Peptide Partners — CJC-1295: C
    {
      vendor: pp, peptideName: "CJC-1295", grade: "C" as const,
      averageScore: 5.8, testCount: 9, minScore: 4.2, maxScore: 7.5,
      oldestTestDate: new Date("2025-06-01"), newestTestDate: new Date("2025-10-20"),
      finnrickUrl: "https://www.finnrick.com/products/cjc-1295/peptide-partners",
    },
    // Verified Peptides — BPC-157: B
    {
      vendor: vp, peptideName: "BPC-157", grade: "B" as const,
      averageScore: 7.2, testCount: 4, minScore: 6.0, maxScore: 8.8,
      oldestTestDate: new Date("2025-08-01"), newestTestDate: new Date("2025-10-15"),
      finnrickUrl: null,
    },
    // Verified Peptides — TB-500: B
    {
      vendor: vp, peptideName: "TB-500", grade: "B" as const,
      averageScore: 7.5, testCount: 3, minScore: 6.8, maxScore: 8.3,
      oldestTestDate: new Date("2025-07-15"), newestTestDate: new Date("2025-10-01"),
      finnrickUrl: null,
    },
    // Paradigm Peptide — BPC-157: A
    {
      vendor: paradigm, peptideName: "BPC-157", grade: "A" as const,
      averageScore: 8.9, testCount: 5, minScore: 7.8, maxScore: 10.0,
      oldestTestDate: new Date("2025-07-01"), newestTestDate: new Date("2025-11-01"),
      finnrickUrl: "https://www.finnrick.com/products/bpc-157/paradigm-peptide",
    },
    // Paradigm Peptide — Ipamorelin: A
    {
      vendor: paradigm, peptideName: "Ipamorelin", grade: "A" as const,
      averageScore: 9.1, testCount: 4, minScore: 8.2, maxScore: 10.0,
      oldestTestDate: new Date("2025-08-01"), newestTestDate: new Date("2025-11-01"),
      finnrickUrl: null,
    },
    // Polaris Peptides — BPC-157: B
    {
      vendor: polaris, peptideName: "BPC-157", grade: "B" as const,
      averageScore: 7.0, testCount: 12, minScore: 3.9, maxScore: 9.8,
      oldestTestDate: new Date("2024-06-01"), newestTestDate: new Date("2025-10-30"),
      finnrickUrl: "https://www.finnrick.com/products/bpc-157/polaris-peptides",
    },
    // Polaris Peptides — Semaglutide: C (intentionally low)
    {
      vendor: polaris, peptideName: "Semaglutide", grade: "C" as const,
      averageScore: 5.5, testCount: 8, minScore: 4.0, maxScore: 7.2,
      oldestTestDate: new Date("2024-09-01"), newestTestDate: new Date("2025-09-15"),
      finnrickUrl: null,
    },
    // Note: Skye Peptides, GHK-Cu, PT-141, Melanotan II intentionally have
    // NO Finnrick data to exercise the graceful-degradation path in the UI.
  ];

  for (const r of finnrickRatings) {
    const peptide = getPeptide(r.peptideName);
    const existing = await prisma.finnrickVendorRating.findUnique({
      where: { vendorId_peptideId: { vendorId: r.vendor.id, peptideId: peptide.id } },
    });
    if (!existing) {
      await prisma.finnrickVendorRating.create({
        data: {
          vendorId: r.vendor.id,
          peptideId: peptide.id,
          grade: r.grade,
          averageScore: r.averageScore,
          testCount: r.testCount,
          minScore: r.minScore,
          maxScore: r.maxScore,
          oldestTestDate: r.oldestTestDate,
          newestTestDate: r.newestTestDate,
          finnrickUrl: r.finnrickUrl,
          importBatchId: seedBatchId,
        },
      });
    }
  }

  // ── Sample test results for BPC-157 / Peptide Partners ───────────────────

  const ppBpc157Rating = await prisma.finnrickVendorRating.findUnique({
    where: { vendorId_peptideId: { vendorId: pp.id, peptideId: getPeptide("BPC-157").id } },
  });

  if (ppBpc157Rating) {
    const testResults = [
      {
        testDate: new Date("2025-11-06"), testScore: 9.3,
        advertisedQuantity: 10.0, actualQuantity: 10.7, quantityVariance: 7.0,
        purity: 99.95, batchId: "BP20250808",
        containerType: "White Label / Silver Crimp / Yellow Cap",
        labId: "E", source: "Public",
        endotoxinsStatus: "not detected",
        certificateLink: "https://www.finnrick.com/testing-certificate/pp-bpc157-001",
        identityResult: "Pass",
      },
      {
        testDate: new Date("2025-10-23"), testScore: 6.9,
        advertisedQuantity: 10.0, actualQuantity: 9.1, quantityVariance: -9.0,
        purity: 97.20, batchId: "BP20250622",
        containerType: "White Label / Silver Crimp / Yellow Cap",
        labId: "E", source: "Public",
        endotoxinsStatus: "not detected",
        certificateLink: null,
        identityResult: "Pass",
      },
    ];

    for (const t of testResults) {
      const exists = await prisma.finnrickTestResult.findFirst({
        where: { ratingId: ppBpc157Rating.id, batchId: t.batchId },
      });
      if (!exists) {
        await prisma.finnrickTestResult.create({
          data: { ...t, ratingId: ppBpc157Rating.id, importBatchId: seedBatchId },
        });
      }
    }
  }

  // Sample test result for Paradigm BPC-157
  const parBpc157Rating = await prisma.finnrickVendorRating.findUnique({
    where: { vendorId_peptideId: { vendorId: paradigm.id, peptideId: getPeptide("BPC-157").id } },
  });

  if (parBpc157Rating) {
    const exists = await prisma.finnrickTestResult.findFirst({
      where: { ratingId: parBpc157Rating.id, batchId: "PAR20251001" },
    });
    if (!exists) {
      await prisma.finnrickTestResult.create({
        data: {
          ratingId: parBpc157Rating.id,
          testDate: new Date("2025-11-01"), testScore: 10.0,
          advertisedQuantity: 5.0, actualQuantity: 5.1, quantityVariance: 2.0,
          purity: 99.98, batchId: "PAR20251001",
          containerType: "Brown Glass / Gold Crimp",
          labId: "A", source: "Public",
          endotoxinsStatus: "not detected",
          certificateLink: "https://www.finnrick.com/testing-certificate/par-bpc157-001",
          identityResult: "Pass",
          importBatchId: seedBatchId,
        },
      });
    }
  }

  console.log(
    `Seeded ${peptides.length} peptides, ${vendors.length} vendors, ` +
      `${finnrickRatings.length} Finnrick ratings, ${mappings.length} vendor mappings.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
