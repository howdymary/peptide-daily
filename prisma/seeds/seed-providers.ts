/**
 * Seed providers (clinics, pharmacies, telehealth) from data/providers/seed.json.
 * Idempotent — safe to re-run.
 */

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

interface ProviderEntry {
  name: string;
  slug: string;
  type: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  services: string[];
  acceptsInsurance: boolean;
  offersTelehealth: boolean;
  fdaRegistered: boolean;
  cpsVerified: boolean;
}

export async function seedProviders(prisma: PrismaClient): Promise<void> {
  const filePath = resolve(__dirname, "../../data/providers/seed.json");
  const raw = readFileSync(filePath, "utf-8");
  const providers: ProviderEntry[] = JSON.parse(raw);

  console.log(`  Seeding ${providers.length} providers...`);

  for (const p of providers) {
    await prisma.provider.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        type: p.type,
        website: p.website ?? null,
        phone: p.phone ?? null,
        email: p.email ?? null,
        address: p.address ?? null,
        city: p.city ?? null,
        state: p.state ?? null,
        zipCode: p.zipCode ?? null,
        country: p.country ?? "US",
        latitude: p.latitude ?? null,
        longitude: p.longitude ?? null,
        description: p.description ?? null,
        services: p.services,
        acceptsInsurance: p.acceptsInsurance,
        offersTelehealth: p.offersTelehealth,
        fdaRegistered: p.fdaRegistered,
        cpsVerified: p.cpsVerified,
      },
      create: {
        name: p.name,
        slug: p.slug,
        type: p.type,
        website: p.website ?? null,
        phone: p.phone ?? null,
        email: p.email ?? null,
        address: p.address ?? null,
        city: p.city ?? null,
        state: p.state ?? null,
        zipCode: p.zipCode ?? null,
        country: p.country ?? "US",
        latitude: p.latitude ?? null,
        longitude: p.longitude ?? null,
        description: p.description ?? null,
        services: p.services,
        acceptsInsurance: p.acceptsInsurance,
        offersTelehealth: p.offersTelehealth,
        fdaRegistered: p.fdaRegistered,
        cpsVerified: p.cpsVerified,
      },
    });
  }

  console.log(`  Done: ${providers.length} providers seeded.`);
}
