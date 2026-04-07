/**
 * Seed peptide categories from data/categories/categories.json.
 * Idempotent — safe to re-run.
 */

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

interface CategoryEntry {
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
}

export async function seedCategories(prisma: PrismaClient): Promise<void> {
  const filePath = resolve(__dirname, "../../data/categories/categories.json");
  const raw = readFileSync(filePath, "utf-8");
  const categories: CategoryEntry[] = JSON.parse(raw);

  console.log(`  Seeding ${categories.length} peptide categories...`);

  for (const cat of categories) {
    await prisma.peptideCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        displayOrder: cat.displayOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: cat.displayOrder,
      },
    });
  }

  console.log(`  Done: ${categories.length} categories seeded.`);
}
