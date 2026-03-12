/**
 * Hub homepage — editorial "Points Guy"-style layout:
 *   1. Hero with search + sub-nav
 *   2. Top Stories — asymmetric editorial grid (1 large + 2 stacked)
 *   3. Peptide Finder — dark strip with scrollable peptide cards
 *   4. Main: Latest News feed + Sidebar (guides, categories)
 *   5. How we source data
 *   6. CTA band
 */

import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { computeTrustScore, bestFinnrickGrade } from "@/lib/finnrick/trust-score";
import { NewsFeed } from "@/components/home/news-feed";
import { ArticleCard } from "@/components/home/article-card";
import { GuideCard } from "@/components/home/guide-card";
import { PeptideSnapshotCard } from "@/components/home/peptide-snapshot-card";
import type { FinnrickRatingItem, FinnrickGrade } from "@/types";

export const metadata = {
  title: "Peptide Daily — Peptide Research Hub",
  description:
    "The independent peptide research hub. Latest news, vendor price comparisons, third-party lab data from Finnrick, and educational guides — all in one place.",
};

export const revalidate = 300;

async function getHomepageData() {
  try {
    const [featuredNews, editorsPicks, guides, peptides] = await Promise.all([
      prisma.newsArticle.findMany({
        where: { isHidden: false },
        orderBy: { publishedAt: "desc" },
        take: 8,
        include: { source: { select: { name: true, slug: true, siteUrl: true } } },
      }),
      prisma.newsArticle.findMany({
        where: { isHidden: false, isEditorsPick: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
        include: { source: { select: { name: true, slug: true, siteUrl: true } } },
      }),
      prisma.guide.findMany({
        where: { isPublished: true },
        orderBy: [{ category: "asc" }, { order: "asc" }],
        take: 6,
      }),
      prisma.peptide.findMany({
        include: {
          prices: {
            include: { vendor: { select: { name: true, slug: true } } },
            orderBy: { price: "asc" },
          },
          reviews: { select: { rating: true } },
          finnrickRatings: {
            select: {
              grade: true, averageScore: true, testCount: true,
              minScore: true, maxScore: true,
              oldestTestDate: true, newestTestDate: true,
              finnrickUrl: true,
              vendor: { select: { slug: true } },
            },
          },
        },
      }),
    ]);

    const serializeArticle = (a: typeof featuredNews[0]) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      sourceUrl: a.sourceUrl,
      excerpt: a.excerpt ?? null,
      author: a.author ?? null,
      publishedAt: a.publishedAt.toISOString(),
      tags: a.tags,
      isEditorsPick: a.isEditorsPick,
      isPinned: a.isPinned,
      source: a.source,
    });

    const allTags = [...new Set(featuredNews.flatMap((a) => a.tags))].sort();

    const gradeOrder: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };
    const trendingPeptides = peptides
      .map((p) => {
        const avgRating =
          p.reviews.length > 0
            ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
            : 0;
        const bestPrice = p.prices[0] ?? null;
        const topGrade = bestFinnrickGrade(p.finnrickRatings);

        let trustScore = null;
        if (bestPrice) {
          const finnrickForBest = p.finnrickRatings.find(
            (r) => r.vendor.slug === bestPrice.vendor.slug,
          );
          const finnrickItem: FinnrickRatingItem | null = finnrickForBest
            ? {
                grade: finnrickForBest.grade as FinnrickGrade,
                averageScore: Number(finnrickForBest.averageScore),
                testCount: finnrickForBest.testCount,
                minScore: Number(finnrickForBest.minScore),
                maxScore: Number(finnrickForBest.maxScore),
                oldestTestDate: finnrickForBest.oldestTestDate.toISOString(),
                newestTestDate: finnrickForBest.newestTestDate.toISOString(),
                finnrickUrl: finnrickForBest.finnrickUrl,
              }
            : null;

          const prices = p.prices.map((pr) => Number(pr.price)).sort((a, b) => a - b);
          const median = prices[Math.floor(prices.length / 2)] ?? null;

          trustScore = computeTrustScore({
            finnrickRating: finnrickItem,
            averageReviewRating: avgRating,
            reviewCount: p.reviews.length,
            priceRelativeToMedian:
              median && median > 0 ? Number(bestPrice.price) / median : undefined,
          });
        }

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description ?? null,
          category: p.category ?? null,
          bestPrice: bestPrice ? Number(bestPrice.price) : null,
          bestPriceVendor: bestPrice?.vendor.name ?? null,
          priceCount: p.prices.length,
          bestFinnrickGrade: topGrade,
          trustScore,
          topVendors: p.prices.slice(0, 3).map((pr) => ({
            vendorName: pr.vendor.name,
            vendorSlug: pr.vendor.slug,
            price: Number(pr.price),
            currency: pr.currency,
          })),
        };
      })
      .sort(
        (a, b) =>
          (b.trustScore?.overall ?? 0) - (a.trustScore?.overall ?? 0) ||
          (gradeOrder[b.bestFinnrickGrade ?? ""] ?? 0) -
            (gradeOrder[a.bestFinnrickGrade ?? ""] ?? 0),
      )
      .slice(0, 4);

    return {
      featuredNews: featuredNews.map(serializeArticle),
      editorsPicks: editorsPicks.map(serializeArticle),
      guides: guides.map((g) => ({
        id: g.id,
        title: g.title,
        slug: g.slug,
        excerpt: g.excerpt,
        category: g.category,
        readingTime: g.readingTime,
        order: g.order,
      })),
      trendingPeptides,
      allTags,
    };
  } catch (err) {
    console.warn("[Homepage] DB unavailable, rendering empty shell:", (err as Error).message);
    return {
      featuredNews: [] as {
        id: string; title: string; slug: string; sourceUrl: string;
        excerpt: string | null; author: string | null; publishedAt: string;
        tags: string[]; isEditorsPick: boolean; isPinned: boolean;
        source: { name: string; slug: string; siteUrl: string };
      }[],
      editorsPicks: [] as {
        id: string; title: string; slug: string; sourceUrl: string;
        excerpt: string | null; author: string | null; publishedAt: string;
        tags: string[]; isEditorsPick: boolean; isPinned: boolean;
        source: { name: string; slug: string; siteUrl: string };
      }[],
      guides: [] as { id: string; title: string; slug: string; excerpt: string; category: string; readingTime: number; order: number }[],
      trendingPeptides: [] as {
        id: string; name: string; slug: string; description: string | null;
        category: string | null; bestPrice: number | null; bestPriceVendor: string | null;
        priceCount: number; bestFinnrickGrade: string | null;
        trustScore: import("@/types").TrustScore | null;
        topVendors: { vendorName: string; vendorSlug: string; price: number; currency: string }[];
      }[],
      allTags: [] as string[],
    };
  }
}

export default async function HomePage() {
  const { featuredNews, editorsPicks, guides, trendingPeptides, allTags } =
    await getHomepageData();

  const editorIds = new Set(editorsPicks.map((a) => a.id));
  const feedArticles = featuredNews.filter((a) => !editorIds.has(a.id));

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 sm:py-28"
        style={{ background: "var(--brand-navy)" }}
      >
        {/* Subtle diagonal stripe texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgb(255 255 255 / 0.015) 0px, rgb(255 255 255 / 0.015) 1px, transparent 1px, transparent 60px)",
          }}
          aria-hidden="true"
        />

        <div className="container-page relative">
          <div className="mx-auto max-w-2xl">
            {/* Section label */}
            <div className="section-label-light mb-5">
              Independent Research Hub
            </div>

            {/* Headline — DM Serif Display */}
            <h1
              className="display-heading text-4xl text-white sm:text-5xl lg:text-6xl"
            >
              Your peptide research
              <br />
              <em
                className="not-italic"
                style={{ color: "var(--brand-gold)" }}
              >
                starts here.
              </em>
            </h1>

            <p className="mt-5 text-base leading-relaxed sm:text-lg" style={{ color: "rgb(255 255 255 / 0.65)" }}>
              Lab-testing data from Finnrick, live vendor prices, and
              evidence-based news — all in one place, with full source
              attribution.
            </p>

            {/* Search */}
            <form action="/peptides" method="get" className="mt-8">
              <div
                className="flex gap-2 rounded-xl p-1.5"
                style={{ background: "rgb(255 255 255 / 0.08)", border: "1px solid rgb(255 255 255 / 0.12)" }}
              >
                <label htmlFor="hero-search" className="sr-only">
                  Search peptides
                </label>
                <input
                  id="hero-search"
                  name="search"
                  type="text"
                  placeholder="Search BPC-157, Semaglutide, TB-500…"
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: "var(--brand-gold)", color: "#fff" }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick links row */}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                { href: "/peptides", label: "Browse catalog" },
                { href: "/vendors", label: "Vendor rankings" },
                { href: "/about", label: "How it works" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm transition-opacity hover:opacity-90"
                  style={{ color: "rgb(255 255 255 / 0.55)" }}
                >
                  {l.label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Top Stories — asymmetric editorial grid ───────────────────────── */}
      {editorsPicks.length > 0 && (
        <section className="py-12" style={{ background: "var(--surface)" }}>
          <div className="container-page">
            {/* Section label */}
            <div className="section-label mb-7">
              Top Stories
            </div>

            {/* Editorial grid: 1 large + 2 stacked */}
            {editorsPicks.length === 1 ? (
              <ArticleCard article={editorsPicks[0]} variant="featured" />
            ) : (
              <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">
                {/* Large left card */}
                <ArticleCard article={editorsPicks[0]} variant="hero" />

                {/* Stacked right cards */}
                <div className="flex flex-col gap-5">
                  {editorsPicks.slice(1, 3).map((article) => (
                    <ArticleCard key={article.id} article={article} variant="featured" />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Link
                href="/news"
                className="text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: "var(--accent)" }}
              >
                All news →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Peptide Finder strip ──────────────────────────────────────────── */}
      {trendingPeptides.length > 0 && (
        <section className="py-12" style={{ background: "var(--brand-navy)" }}>
          <div className="container-page">
            {/* Header */}
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <div className="section-label-light mb-2">
                  Peptide Finder
                </div>
                <h2
                  className="display-heading text-2xl text-white sm:text-3xl"
                >
                  Top-rated peptides this week
                </h2>
              </div>
              <Link
                href="/peptides"
                className="shrink-0 rounded-lg border px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/40"
                style={{ borderColor: "rgb(255 255 255 / 0.2)", color: "rgb(255 255 255 / 0.75)" }}
              >
                Full catalog →
              </Link>
            </div>

            {/* Horizontal scrollable peptide cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trendingPeptides.map((p) => (
                <PeptideSnapshotCard key={p.id} peptide={p} dark />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest News + Sidebar ─────────────────────────────────────────── */}
      <section className="py-12" style={{ background: "var(--background)" }}>
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            {/* Left: news feed */}
            <div>
              <div className="section-label mb-6">
                Latest Research News
              </div>
              <NewsFeed articles={feedArticles} allTags={allTags} />
            </div>

            {/* Right: sidebar */}
            <aside className="space-y-10">
              {/* Guides */}
              {guides.length > 0 && (
                <div>
                  <div className="section-label mb-5">
                    Learn
                  </div>
                  <div className="space-y-3">
                    {guides.slice(0, 4).map((guide) => (
                      <GuideCard key={guide.id} guide={guide} compact />
                    ))}
                  </div>
                  <Link
                    href="/guides"
                    className="mt-4 block text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ color: "var(--accent)" }}
                  >
                    All guides →
                  </Link>
                </div>
              )}

              {/* Browse by category */}
              <div>
                <div className="section-label mb-5">
                  Browse by Category
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "GLP-1", href: "/peptides?search=semaglutide", icon: "⚡" },
                    { label: "Recovery", href: "/peptides?search=bpc-157", icon: "🔧" },
                    { label: "Growth", href: "/peptides?search=ipamorelin", icon: "📈" },
                    { label: "Cosmetic", href: "/peptides?search=ghk-cu", icon: "✦" },
                  ].map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      className="category-nav-btn flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--surface)",
                        color: "var(--foreground-secondary)",
                      }}
                    >
                      <span className="text-base" aria-hidden="true">{cat.icon}</span>
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Learn — guides grid ───────────────────────────────────────────── */}
      {guides.length > 0 && (
        <section className="py-12" style={{ background: "var(--surface-raised)" }}>
          <div className="container-page">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <div className="section-label mb-2">
                  Guides &amp; Education
                </div>
                <h2
                  className="display-heading text-2xl"
                  style={{ color: "var(--foreground)" }}
                >
                  Everything you need to know
                </h2>
              </div>
              <Link
                href="/guides"
                className="shrink-0 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: "var(--accent)" }}
              >
                All guides →
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {guides.slice(0, 6).map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── How we source data ───────────────────────────────────────────── */}
      <section className="py-12" style={{ background: "var(--surface)" }}>
        <div className="container-page">
          <div className="mb-8">
            <div className="section-label mb-2">
              Our Methodology
            </div>
            <h2
              className="display-heading text-2xl"
              style={{ color: "var(--foreground)" }}
            >
              How we source data
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Transparent methodology — you should always know where numbers come from.{" "}
              <Link href="/about" className="underline transition-opacity hover:opacity-80" style={{ color: "var(--muted)" }}>
                Full methodology →
              </Link>
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "Third-party lab testing",
                body: "Finnrick independently tests vendor peptides and publishes purity, quantity accuracy, and identity results. We import and display this data — never modified.",
                accent: "var(--brand-teal)",
              },
              {
                number: "02",
                title: "Live price aggregation",
                body: "We scrape vendor websites automatically every 15 minutes. You see price per package alongside concentration so you can compare apples to apples.",
                accent: "var(--accent)",
              },
              {
                number: "03",
                title: "Trust Score",
                body: "Our Trust Score (0–100) combines Finnrick lab quality (50%), community reviews (30%), and pricing signals (20%) into a single number.",
                accent: "var(--brand-gold)",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-xl border p-6"
                style={{
                  borderColor: "var(--card-border)",
                  background: "var(--card-bg)",
                  boxShadow: "var(--card-shadow)",
                  borderTopColor: item.accent,
                  borderTopWidth: "3px",
                }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: item.accent }}
                >
                  Step {item.number}
                </span>
                <h3
                  className="mt-2 text-sm font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Medical disclaimer ───────────────────────────────────────────── */}
      <section
        className="border-t py-5"
        style={{ background: "var(--info-bg)", borderColor: "var(--info-border)" }}
      >
        <div className="container-page">
          <p className="text-xs leading-relaxed" style={{ color: "var(--info-text)" }}>
            <strong>Medical disclaimer:</strong> Peptide Daily is an informational
            resource only. Peptide research chemicals are not approved for human
            use by the FDA unless otherwise noted. Nothing on this site
            constitutes medical advice. Consult a qualified healthcare provider
            before using any peptide or research chemical.{" "}
            <Link href="/about" style={{ color: "var(--info-text)" }} className="underline">
              Learn more →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16"
        style={{ background: "var(--brand-navy)" }}
      >
        {/* Decorative rule */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgb(255 255 255 / 0.012) 0px, rgb(255 255 255 / 0.012) 1px, transparent 1px, transparent 60px)",
          }}
          aria-hidden="true"
        />
        <div className="container-page relative">
          <div className="mx-auto max-w-xl text-center">
            <div className="section-label-light mb-5 justify-center">
              Ready to compare?
            </div>
            <h2
              className="display-heading text-3xl text-white sm:text-4xl"
            >
              Find the best peptide vendors with confidence
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgb(255 255 255 / 0.6)" }}>
              Browse all peptides, filter by Finnrick lab grade, and find the
              best price-to-quality ratio across every tracked vendor.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/peptides"
                className="rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: "var(--brand-gold)", color: "#fff" }}
              >
                Browse Catalog
              </Link>
              <Link
                href="/vendors"
                className="cta-ghost-btn rounded-lg border px-6 py-3 text-sm font-medium text-white transition-colors"
                style={{
                  borderColor: "rgb(255 255 255 / 0.25)",
                  color: "rgb(255 255 255 / 0.85)",
                }}
              >
                View Vendors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
