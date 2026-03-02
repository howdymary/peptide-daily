/**
 * Vendor Refresh Worker
 *
 * This file is the entry point for the background worker process.
 * Run separately from Next.js:
 *
 *   npx tsx src/jobs/vendor-refresh-worker.ts
 *
 * On Vercel: deploy this as a separate service (e.g., on Railway or ECS).
 * On AWS: run as an ECS task or in a Lambda triggered by EventBridge.
 */

import { createWorker, vendorRefreshQueue, setupQueueEvents } from "./queue";
import { runAggregation } from "@/lib/vendors/aggregator";
import { logger } from "@/lib/utils/logger";

// Set up event logging
setupQueueEvents(vendorRefreshQueue);

// Create the worker
const worker = createWorker("vendor-refresh", async (job) => {
  logger.info(`Processing vendor refresh job: ${job.name}`, {
    metadata: job.data,
  });

  const result = await runAggregation();

  logger.info("Vendor refresh completed", { metadata: result as unknown as Record<string, unknown> });

  if (result.errors.length > 0) {
    logger.warn(`Vendor refresh had ${result.errors.length} errors`, {
      metadata: { errors: result.errors },
    });
  }
});

// Schedule recurring job
async function scheduleRecurringRefresh() {
  const intervalMinutes = parseInt(
    process.env.VENDOR_REFRESH_INTERVAL_MINUTES || "15",
    10,
  );

  // Remove existing repeatable jobs to avoid duplicates
  const existingJobs = await vendorRefreshQueue.getRepeatableJobs();
  for (const job of existingJobs) {
    await vendorRefreshQueue.removeRepeatableByKey(job.key);
  }

  // Add a new repeatable job
  await vendorRefreshQueue.add(
    "scheduled-refresh",
    { triggeredBy: "scheduler" },
    {
      repeat: {
        every: intervalMinutes * 60 * 1000,
      },
    },
  );

  logger.info(
    `Scheduled vendor refresh every ${intervalMinutes} minutes`,
  );
}

// Run an immediate refresh on startup, then schedule recurring
async function start() {
  logger.info("Vendor refresh worker starting...");

  // Trigger immediate refresh
  await vendorRefreshQueue.add("initial-refresh", {
    triggeredBy: "startup",
  });

  // Schedule recurring
  await scheduleRecurringRefresh();

  logger.info("Vendor refresh worker running. Press Ctrl+C to stop.");
}

start().catch((err) => {
  logger.error("Failed to start vendor refresh worker", {
    metadata: { error: err.message },
  });
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("Shutting down vendor refresh worker...");
  await worker.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("Shutting down vendor refresh worker...");
  await worker.close();
  process.exit(0);
});
