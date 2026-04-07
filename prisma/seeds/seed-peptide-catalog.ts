/**
 * Seed 100+ peptide compounds from data/peptides/catalog.json.
 * Links peptides to their PeptideCategory by matching category slug.
 * Idempotent — safe to re-run.
 */

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

interface CatalogContentJson {
  overview: string[];
  researchContext: string[];
  safetyNotes: string[];
  references: { number: number; title: string; journal: string; url: string }[];
  hubNote: string;
}

interface CatalogEntry {
  name: string;
  slug: string;
  description: string;
  category: string;
  molecularWeight: number | null;
  halfLife: string | null;
  administrationRoute: string | null;
  regulatoryStatus: string;
  goalTags: string[];
  aliases: string[];
  mechanismOfAction: string;
  sequence: string | null;
  contentJson: CatalogContentJson;
}

export async function seedPeptideCatalog(prisma: PrismaClient): Promise<void> {
  const filePath = resolve(__dirname, "../../data/peptides/catalog.json");
  const raw = readFileSync(filePath, "utf-8");
  const peptides: CatalogEntry[] = JSON.parse(raw);

  console.log(`  Seeding ${peptides.length} peptides from catalog...`);

  // Pre-fetch categories for slug → id lookup
  const categories = await prisma.peptideCategory.findMany();
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

  let created = 0;
  let updated = 0;

  for (const p of peptides) {
    const categoryId = categoryMap.get(p.category) ?? null;

    const existing = await prisma.peptide.findUnique({
      where: { slug: p.slug },
    });

    if (existing) {
      await prisma.peptide.update({
        where: { slug: p.slug },
        data: {
          description: p.description,
          category: p.category,
          molecularWeight: p.molecularWeight,
          halfLife: p.halfLife,
          administrationRoute: p.administrationRoute,
          regulatoryStatus: p.regulatoryStatus,
          goalTags: p.goalTags,
          aliases: p.aliases,
          mechanismOfAction: p.mechanismOfAction,
          sequence: p.sequence,
          contentJson: JSON.stringify(p.contentJson),
          categoryId,
        },
      });
      updated++;
    } else {
      await prisma.peptide.create({
        data: {
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
          sequence: p.sequence,
          contentJson: JSON.stringify(p.contentJson),
          categoryId,
        },
      });
      created++;
    }
  }

  console.log(`  Done: ${created} created, ${updated} updated (${peptides.length} total).`);
}
