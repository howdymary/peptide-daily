/**
 * Seed script for development.
 * Run: npx tsx prisma/seed.ts
 *
 * Creates sample vendors, peptides, and prices for local development.
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

  // Create vendors
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

  // Create peptides
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

  // Create prices for each peptide from both vendors
  const priceEntries = [
    // Verified Peptides prices
    { peptideIdx: 0, vendor: vp, price: 39.99, conc: "5mg", sku: "VP-BPC157-5", status: "in_stock" },
    { peptideIdx: 1, vendor: vp, price: 34.99, conc: "5mg", sku: "VP-TB500-5", status: "in_stock" },
    { peptideIdx: 2, vendor: vp, price: 42.99, conc: "50mg", sku: "VP-GHKCU-50", status: "in_stock" },
    { peptideIdx: 3, vendor: vp, price: 29.99, conc: "5mg", sku: "VP-IPA-5", status: "in_stock" },
    { peptideIdx: 4, vendor: vp, price: 37.99, conc: "5mg", sku: "VP-CJC1295-5", status: "out_of_stock" },
    { peptideIdx: 5, vendor: vp, price: 89.99, conc: "3mg", sku: "VP-SEMA-3", status: "in_stock" },
    { peptideIdx: 6, vendor: vp, price: 28.99, conc: "10mg", sku: "VP-PT141-10", status: "in_stock" },
    { peptideIdx: 7, vendor: vp, price: 24.99, conc: "10mg", sku: "VP-MT2-10", status: "in_stock" },
    // Peptide Partners prices
    { peptideIdx: 0, vendor: pp, price: 36.50, conc: "5mg", sku: "PP-BPC157-5", status: "in_stock" },
    { peptideIdx: 1, vendor: pp, price: 32.00, conc: "5mg", sku: "PP-TB500-5", status: "in_stock" },
    { peptideIdx: 2, vendor: pp, price: 45.00, conc: "50mg", sku: "PP-GHKCU-50", status: "in_stock" },
    { peptideIdx: 3, vendor: pp, price: 27.50, conc: "5mg", sku: "PP-IPA-5", status: "in_stock" },
    { peptideIdx: 4, vendor: pp, price: 35.00, conc: "5mg", sku: "PP-CJC1295-5", status: "in_stock" },
    { peptideIdx: 5, vendor: pp, price: 94.99, conc: "3mg", sku: "PP-SEMA-3", status: "pre_order" },
    { peptideIdx: 6, vendor: pp, price: 31.50, conc: "10mg", sku: "PP-PT141-10", status: "in_stock" },
    { peptideIdx: 7, vendor: pp, price: 22.99, conc: "10mg", sku: "PP-MT2-10", status: "in_stock" },
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

  console.log(`Seeded ${peptides.length} peptides with prices from 2 vendors.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
