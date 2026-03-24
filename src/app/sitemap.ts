import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://peptidedaily.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [peptides, vendors, guides] = await Promise.all([
    prisma.peptide.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.vendor.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.guide.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/peptides`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/vendors`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  const peptidePages: MetadataRoute.Sitemap = peptides.map((p) => ({
    url: `${SITE_URL}/peptides/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const vendorPages: MetadataRoute.Sitemap = vendors.map((v) => ({
    url: `${SITE_URL}/vendors/${v.slug}`,
    lastModified: v.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE_URL}/learn/${g.slug}`,
    lastModified: g.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...peptidePages, ...vendorPages, ...guidePages];
}
