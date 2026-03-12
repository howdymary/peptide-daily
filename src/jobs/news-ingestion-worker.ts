/**
 * News Ingestion Worker
 *
 * Runs the RSS/Atom ingestion pipeline on a configurable schedule.
 * Start this as a separate long-running process:
 *
 *   npx tsx src/jobs/news-ingestion-worker.ts
 *
 * Environment variables:
 *   NEWS_INGESTION_INTERVAL_HOURS   How often to run full ingestion (default: 4)
 *   NEWS_SOURCE_SLUG                If set, only ingest this source on startup
 *
 * Job data shape:
 *   { sourceSlug?: string }         Omit to run all active sources
 */

import { createWorker, newsIngestionQueue, setupQueueEvents } from "./queue";
import { runIngestion, refreshRobotsTxtStatus } from "@/lib/news/ingestion-service";
import { logger } from "@/lib/utils/logger";

setupQueueEvents(newsIngestionQueue);

const worker = createWorker("news-ingestion", async (job) => {
  const sourceSlug = (job.data as Record<string, string>).sourceSlug as
    | string
    | undefined;

  logger.info(`News ingestion job starting`, {
    metadata: { jobName: job.name, sourceSlug: sourceSlug ?? "all" },
  });

  const stats = await runIngestion(sourceSlug);

  logger.info("News ingestion job complete", {
    metadata: {
      sources: stats.sources,
      fetched: stats.fetched,
      inserted: stats.inserted,
      skipped: stats.skipped,
      errors: stats.errors,
      durationMs: stats.durationMs,
    },
  });

  if (stats.errors > 0) {
    const failed = stats.results
      .filter((r) => r.error)
      .map((r) => `${r.sourceName}: ${r.error}`)
      .join("; ");
    logger.warn(`News ingestion: ${stats.errors} source(s) failed`, {
      metadata: { failed },
    });
  }
});

async function scheduleRecurringIngestion() {
  const intervalHours = parseFloat(
    process.env.NEWS_INGESTION_INTERVAL_HOURS ?? "4",
  );

  // Clear old repeatable jobs to prevent duplicates on restart
  const existing = await newsIngestionQueue.getRepeatableJobs();
  for (const job of existing) {
    await newsIngestionQueue.removeRepeatableByKey(job.key);
  }

  await newsIngestionQueue.add(
    "scheduled-ingestion",
    {},
    { repeat: { every: intervalHours * 60 * 60 * 1000 } },
  );

  logger.info(`Scheduled news ingestion every ${intervalHours} hour(s)`);
}

async function start() {
  logger.info("News ingestion worker starting…");

  // Check robots.txt status for all sources (once at startup)
  await refreshRobotsTxtStatus();

  // Immediate run on startup
  const sourceSlug = process.env.NEWS_SOURCE_SLUG;
  await newsIngestionQueue.add("startup-ingestion", sourceSlug ? { sourceSlug } : {});

  await scheduleRecurringIngestion();

  logger.info("News ingestion worker running. Press Ctrl+C to stop.");
}

start().catch((err) => {
  logger.error("Failed to start news ingestion worker", {
    metadata: { error: (err as Error).message },
  });
  process.exit(1);
});

process.on("SIGTERM", async () => {
  logger.info("Shutting down news ingestion worker…");
  await worker.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("Shutting down news ingestion worker…");
  await worker.close();
  process.exit(0);
});
