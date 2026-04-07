import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://peptidedaily.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Wrap each query in a try/catch so the sitemap still builds
  // even if some tables haven't been migrated yet.
  async function safeQuery<T>(fn: () => Promise<T[]>): Promise<T[]> {
    try {
      return await fn();
    } catch {
      return [];
    }
  }

  const [peptides, vendors, guides, providers, articles, cdmos, combinations] =
    await Promise.all([
      safeQuery(() => prisma.peptide.findMany({ select: { slug: true, updatedAt: true } })),
      safeQuery(() => prisma.vendor.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      })),
      safeQuery(() => prisma.guide.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      })),
      safeQuery(() => prisma.provider.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      })),
      safeQuery(() => prisma.article.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      })),
      safeQuery(() => prisma.cdmo.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      })),
      safeQuery(() => prisma.combinationProtocol.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      })),
    ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/peptides`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/vendors`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/directory`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tools/reconstitution`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/tools/dosage`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/tools/doses-per-vial`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/tools/kinetics`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/protocol-builder`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/combinations`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/discover`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/articles`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/manufacturing`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/verified-source`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
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

  const providerPages: MetadataRoute.Sitemap = providers.map((p) => ({
    url: `${SITE_URL}/directory/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const cdmoPages: MetadataRoute.Sitemap = cdmos.map((c) => ({
    url: `${SITE_URL}/manufacturing/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const comboPages: MetadataRoute.Sitemap = combinations.map((c) => ({
    url: `${SITE_URL}/combinations/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...peptidePages,
    ...vendorPages,
    ...guidePages,
    ...providerPages,
    ...articlePages,
    ...cdmoPages,
    ...comboPages,
  ];
}
