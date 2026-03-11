/**
 * Hub homepage — Points Guy-style layout combining:
 *   1. Hero with search
 *   2. Editor's Picks (featured news)
 *   3. Main: News feed (tag-filtered) + Sidebar: Guides + Trending Peptides
 *   4. How we source data
 *   5. CTA band
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

// Revalidate at most every 5 minutes
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

  // Serialize news articles
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

  // Build tag list from all fetched articles
  const allTags = [...new Set(featuredNews.flatMap((a) => a.tags))].sort();

  // Build trending peptide snapshots
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
    // DB unavailable at build time (e.g. CI) — return empty data for static shell
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

  // Non-editors-pick articles for the feed (exclude what's in editor's picks)
  const editorIds = new Set(editorsPicks.map((a) => a.id));
  const feedArticles = featuredNews.filter((a) => !editorIds.has(a.id));

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 sm:py-20"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-navy) 0%, #164e63 60%, #0d9488 100%)",
        }}
      >
        {/* Subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        <div className="container-page relative">
          <div className="mx-auto max-w-2xl text-center">
            {/* Eyebrow */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              Research hub · Lab data · Live prices
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Your independent
              <br />
              <span className="text-[#7dd3fc]">peptide research hub</span>
            </h1>
            <p className="mt-4 text-base text-white/75 sm:text-lg">
              Latest peptide research news, Finnrick lab-testing data, and
              live vendor prices — all in one place, with full source attribution.
            </p>

            {/* Search */}
            <form action="/peptides" method="get" className="mt-7 flex gap-2">
              <label htmlFor="hero-search" className="sr-only">
                Search peptides
              </label>
              <input
                id="hero-search"
                name="search"
                type="text"
                placeholder="Search BPC-157, Semaglutide, TB-500…"
                className="flex-1 rounded-xl border border-white/20 bg-white/15 px-5 py-3.5 text-sm text-white placeholder:text-white/50 backdrop-blur-sm transition focus:border-white/50 focus:bg-white/20 focus:outline-none"
                autoComplete="off"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[var(--brand-navy)] transition hover:opacity-90"
              >
                Search
              </button>
            </form>

            {/* Quick links */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {[
                { href: "/peptides", label: "Browse catalog" },
                { href: "/vendors", label: "Vendor rankings" },
                { href: "/about", label: "How it works" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-white/65 transition hover:text-white/90"
                >
                  {l.label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Editor's Picks ───────────────────────────────────────────────── */}
      {editorsPicks.length > 0 && (
        <section className="py-12" style={{ background: "var(--surface-raised)" }}>
          <div className="container-page">
            <div className="mb-6 flex items-baseline justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  Editor&apos;s Picks
                </h2>
                <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
                  Notable research and regulatory updates
                </p>
              </div>
              <Link
                href="/news"
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--accent)" }}
              >
                All news →
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {editorsPicks.map((article) => (
                <ArticleCard key={article.id} article={article} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Main content: News + Sidebar ─────────────────────────────────── */}
      <section className="py-12">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Left: News feed */}
            <div>
              <div className="mb-5 flex items-baseline justify-between">
                <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  Latest Research News
                </h2>
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {feedArticles.length} articles
                </span>
              </div>
              <NewsFeed articles={feedArticles} allTags={allTags} />
            </div>

            {/* Right: Sidebar */}
            <aside className="space-y-8">
              {/* Trending Peptides */}
              {trendingPeptides.length > 0 && (
                <div>
                  <div className="mb-4 flex items-baseline justify-between">
                    <h3
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: "var(--foreground)" }}
                    >
                      Trending Peptides
                    </h3>
                    <Link
                      href="/peptides"
                      className="text-xs font-medium"
                      style={{ color: "var(--accent)" }}
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {trendingPeptides.map((p) => (
                      <PeptideSnapshotCard key={p.id} peptide={p} />
                    ))}
                  </div>
                </div>
              )}

              {/* Guides */}
              {guides.length > 0 && (
                <div>
                  <div className="mb-4 flex items-baseline justify-between">
                    <h3
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: "var(--foreground)" }}
                    >
                      Learn
                    </h3>
                    <Link
                      href="/guides"
                      className="text-xs font-medium"
                      style={{ color: "var(--accent)" }}
                    >
                      All guides →
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {guides.slice(0, 4).map((guide) => (
                      <GuideCard key={guide.id} guide={guide} />
                    ))}
                  </div>
                </div>
              )}

              {/* Category shortcuts */}
              <div>
                <h3
                  className="mb-3 text-sm font-bold uppercase tracking-wide"
                  style={{ color: "var(--foreground)" }}
                >
                  Browse by Category
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "GLP-1", href: "/peptides?search=semaglutide", emoji: "⚡" },
                    { label: "Recovery", href: "/peptides?search=bpc-157", emoji: "🔧" },
                    { label: "Growth Hormone", href: "/peptides?search=ipamorelin", emoji: "📈" },
                    { label: "Cosmetic", href: "/peptides?search=ghk-cu", emoji: "✨" },
                  ].map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-xs font-medium transition hover:bg-[var(--surface-raised)]"
                      style={{ color: "var(--foreground-secondary)" }}
                    >
                      <span>{cat.emoji}</span>
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── How we source data ───────────────────────────────────────────── */}
      <section className="py-12" style={{ background: "var(--surface-raised)" }}>
        <div className="container-page">
          <div className="mb-8 flex items-baseline justify-between">
            <div>
              <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                How we source data
              </h2>
              <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
                Transparent methodology — you should always know where numbers come from
              </p>
            </div>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              Full methodology →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Third-party lab testing",
                body: "Finnrick independently tests vendor peptides and publishes purity, quantity accuracy, and identity results. We import and display this data — never modified.",
                color: "var(--brand-sky)",
              },
              {
                step: "02",
                title: "Live price aggregation",
                body: "We scrape vendor websites automatically every 15 minutes. You see price per package alongside concentration so you can compare apples to apples.",
                color: "var(--brand-teal)",
              },
              {
                step: "03",
                title: "Trust Score",
                body: "Our Trust Score (0–100) combines Finnrick lab quality (50%), community reviews (30%), and pricing signals (20%) into a single number.",
                color: "#7c3aed",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: item.color }}
                >
                  Step {item.step}
                </span>
                <h3
                  className="mt-2 text-sm font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-1.5 text-xs leading-relaxed"
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
        className="border-t border-[var(--border)] py-6"
        style={{ background: "var(--info-bg)" }}
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
        className="py-14"
        style={{ background: "var(--brand-navy)", color: "white" }}
      >
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold text-white">
            Compare vendors with confidence
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Browse all peptides, filter by Finnrick lab grade, and find the
            best price-to-quality ratio across every tracked vendor.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/peptides"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[var(--brand-navy)] transition hover:opacity-90"
            >
              Browse Catalog
            </Link>
            <Link
              href="/vendors"
              className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20"
            >
              View Vendors
            </Link>
            <Link
              href="/about"
              className="rounded-xl px-6 py-3 text-sm font-medium text-white/65 transition hover:text-white/90"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
