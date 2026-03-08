/**
 * Finnrick Sync Worker
 *
 * Watches FINNRICK_DATA_DIR for JSON/CSV files and imports them via
 * importFinnrickData().  Runs every FINNRICK_SYNC_INTERVAL_HOURS hours.
 *
 * Run separately from Next.js:
 *   npx tsx src/jobs/finnrick-sync-worker.ts
 *
 * Place Finnrick export files in the configured data directory:
 *   ./data/finnrick/ratings-2025-11-01.json
 *   ./data/finnrick/tests-2025-11-01.csv
 *
 * Processed files are moved to ./data/finnrick/processed/ to avoid
 * re-importing on the next run.
 */

import * as fs from "fs";
import * as path from "path";
import { createWorker, finnrickSyncQueue, setupQueueEvents } from "./queue";
import { importFinnrickData } from "@/lib/finnrick/importer";
import { logger } from "@/lib/utils/logger";

const DATA_DIR = process.env.FINNRICK_DATA_DIR ?? "./data/finnrick";
const SYNC_INTERVAL_HOURS = parseInt(
  process.env.FINNRICK_SYNC_INTERVAL_HOURS ?? "6",
  10,
);

setupQueueEvents(finnrickSyncQueue);

const worker = createWorker("finnrick-sync", async (job) => {
  logger.info(`Processing Finnrick sync job: ${job.name}`, {
    metadata: job.data,
  });

  await syncDataDirectory();
});

async function syncDataDirectory(): Promise<void> {
  if (!fs.existsSync(DATA_DIR)) {
    logger.info(`[Finnrick Sync] Data directory not found: ${DATA_DIR} — skipping`);
    return;
  }

  const processedDir = path.join(DATA_DIR, "processed");
  if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir, { recursive: true });
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json") || f.endsWith(".csv"));

  if (files.length === 0) {
    logger.info("[Finnrick Sync] No new files to process");
    return;
  }

  logger.info(`[Finnrick Sync] Found ${files.length} file(s) to process`);

  for (const filename of files) {
    const filepath = path.join(DATA_DIR, filename);
    const format = filename.endsWith(".json") ? "json" : "csv";

    try {
      const content = fs.readFileSync(filepath, "utf-8");
      const result = await importFinnrickData(content, format, filename);

      logger.info(
        `[Finnrick Sync] ${filename}: ${result.ratingsUpserted} ratings, ${result.testsCreated} tests, ${result.skipped} skipped, ${result.errors.length} errors`,
      );

      // Move to processed directory
      const dest = path.join(processedDir, filename);
      fs.renameSync(filepath, dest);
    } catch (err) {
      logger.error(`[Finnrick Sync] Failed to process ${filename}`, {
        metadata: { error: err instanceof Error ? err.message : String(err) },
      });
    }
  }
}

async function scheduleRecurringSync() {
  const existingJobs = await finnrickSyncQueue.getRepeatableJobs();
  for (const job of existingJobs) {
    await finnrickSyncQueue.removeRepeatableByKey(job.key);
  }

  await finnrickSyncQueue.add(
    "scheduled-sync",
    { triggeredBy: "scheduler" },
    {
      repeat: {
        every: SYNC_INTERVAL_HOURS * 60 * 60 * 1000,
      },
    },
  );

  logger.info(`[Finnrick Sync] Scheduled every ${SYNC_INTERVAL_HOURS} hours`);
}

async function start() {
  logger.info("Finnrick sync worker starting...");

  await finnrickSyncQueue.add("initial-sync", { triggeredBy: "startup" });
  await scheduleRecurringSync();

  logger.info("Finnrick sync worker running. Press Ctrl+C to stop.");
}

start().catch((err) => {
  logger.error("Failed to start Finnrick sync worker", {
    metadata: { error: err.message },
  });
  process.exit(1);
});

process.on("SIGTERM", async () => {
  logger.info("Shutting down Finnrick sync worker...");
  await worker.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("Shutting down Finnrick sync worker...");
  await worker.close();
  process.exit(0);
});
