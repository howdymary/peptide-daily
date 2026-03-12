/**
 * News ingestion pipeline.
 *
 * Fetches all active NewsSource records, calls the RSS fetcher for each,
 * runs entity extraction, and upserts articles into the database.
 *
 * Idempotent: articles are keyed on source_url; re-running is safe.
 * Rate limiting: enforced via configurable rateLimitMs per source.
 *
 * Usage:
 *   import { runIngestion } from "@/lib/news/ingestion-service";
 *   const stats = await runIngestion();           // all active sources
 *   const stats = await runIngestion("pubmed");   // single source by slug
 */

import { prisma } from "@/lib/db/prisma";
import { fetchFeed } from "./rss-fetcher";
import { checkRobotsTxt } from "./robots-checker";
import { logger } from "@/lib/utils/logger";
import type { FetchResult, IngestionStats } from "./types";

/**
 * Run the ingestion pipeline.
 * @param sourceSlug  If provided, only ingest this source.
 */
export async function runIngestion(sourceSlug?: string): Promise<IngestionStats> {
  const start = Date.now();

  const where = sourceSlug
    ? { isActive: true, robotsTxtAllows: true, slug: sourceSlug }
    : { isActive: true, robotsTxtAllows: true };

  const sources = await prisma.newsSource.findMany({ where });

  if (sources.length === 0) {
    logger.warn("News ingestion: no active sources found", {
      metadata: { sourceSlug },
    });
    return {
      sources: 0,
      fetched: 0,
      inserted: 0,
      skipped: 0,
      errors: 0,
      durationMs: 0,
      results: [],
    };
  }

  logger.info(`News ingestion starting for ${sources.length} source(s)`, {
    metadata: { sources: sources.map((s) => s.slug) },
  });

  const results: FetchResult[] = [];
  let totalFetched = 0;
  let totalInserted = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const source of sources) {
    const fetchStart = Date.now();

    // Respect rate limiting between sources
    if (results.length > 0) {
      await sleep(source.rateLimitMs);
    }

    let result: FetchResult;

    try {
      const articles = await fetchFeed(source.feedUrl, 20);
      const fetchDuration = Date.now() - fetchStart;

      let inserted = 0;
      let skipped = 0;

      for (const article of articles) {
        try {
          const existing = await prisma.newsArticle.findUnique({
            where: { sourceUrl: article.sourceUrl },
            select: { id: true },
          });

          if (existing) {
            skipped++;
            continue;
          }

          await prisma.newsArticle.create({
            data: {
              sourceId: source.id,
              title: article.title,
              slug: article.slug,
              sourceUrl: article.sourceUrl,
              excerpt: article.excerpt,
              author: article.author,
              publishedAt: article.publishedAt,
              tags: article.tags,
            },
          });
          inserted++;
        } catch (articleErr) {
          // Unique constraint on slug means same title from different runs —
          // treat as skip
          if ((articleErr as { code?: string }).code === "P2002") {
            skipped++;
          } else {
            logger.warn(`News ingestion: failed to insert article`, {
              metadata: {
                source: source.slug,
                url: article.sourceUrl,
                error: (articleErr as Error).message,
              },
            });
          }
        }
      }

      totalFetched += articles.length;
      totalInserted += inserted;
      totalSkipped += skipped;

      // Update source health
      await prisma.newsSource.update({
        where: { id: source.id },
        data: {
          lastFetchedAt: new Date(),
          lastFetchStatus: "success",
          lastFetchError: null,
          fetchCount: { increment: 1 },
        },
      });

      result = {
        sourceId: source.id,
        sourceName: source.name,
        articles,
        durationMs: fetchDuration,
      };

      logger.info(`News ingestion: ${source.slug} ✓`, {
        metadata: {
          fetched: articles.length,
          inserted,
          skipped,
          durationMs: fetchDuration,
        },
      });
    } catch (err) {
      totalErrors++;
      const message = err instanceof Error ? err.message : String(err);

      await prisma.newsSource.update({
        where: { id: source.id },
        data: {
          lastFetchedAt: new Date(),
          lastFetchStatus: "error",
          lastFetchError: message,
          errorCount: { increment: 1 },
        },
      });

      result = {
        sourceId: source.id,
        sourceName: source.name,
        articles: [],
        durationMs: Date.now() - fetchStart,
        error: message,
      };

      logger.error(`News ingestion: ${source.slug} failed`, {
        metadata: { error: message },
      });
    }

    results.push(result);
  }

  const totalDuration = Date.now() - start;

  logger.info("News ingestion complete", {
    metadata: {
      sources: sources.length,
      fetched: totalFetched,
      inserted: totalInserted,
      skipped: totalSkipped,
      errors: totalErrors,
      durationMs: totalDuration,
    },
  });

  return {
    sources: sources.length,
    fetched: totalFetched,
    inserted: totalInserted,
    skipped: totalSkipped,
    errors: totalErrors,
    durationMs: totalDuration,
    results,
  };
}

/**
 * Run the robots.txt check for all sources (or a single one)
 * and update robotsTxtAllows in the database.
 */
export async function refreshRobotsTxtStatus(sourceSlug?: string): Promise<void> {
  const sources = await prisma.newsSource.findMany({
    where: sourceSlug ? { slug: sourceSlug } : {},
  });

  for (const source of sources) {
    try {
      const feedPath = new URL(source.feedUrl).pathname;
      const allowed = await checkRobotsTxt(source.siteUrl, feedPath);
      await prisma.newsSource.update({
        where: { id: source.id },
        data: { robotsTxtAllows: allowed },
      });
      logger.info(`robots.txt check: ${source.slug} → ${allowed ? "allowed" : "BLOCKED"}`, {
        metadata: { feedUrl: source.feedUrl },
      });
    } catch (err) {
      logger.warn(`robots.txt check failed for ${source.slug}`, {
        metadata: { error: (err as Error).message },
      });
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
