import { Queue, Worker, QueueEvents } from "bullmq";
import { logger } from "@/lib/utils/logger";

/**
 * BullMQ queue configuration.
 *
 * Uses Redis as the backing store.
 * Queues are named so they can be monitored via Bull Board or similar.
 *
 * On Vercel: BullMQ workers can't run inside serverless functions.
 * Deploy workers as a separate long-running process on:
 *   - AWS ECS / Fargate
 *   - Railway, Render, or Fly.io
 *   - A dedicated EC2 instance
 *
 * The Next.js app enqueues jobs; workers process them separately.
 */

const REDIS_CONNECTION = {
  host: process.env.REDIS_URL
    ? new URL(process.env.REDIS_URL).hostname
    : "localhost",
  port: process.env.REDIS_URL
    ? parseInt(new URL(process.env.REDIS_URL).port || "6379")
    : 6379,
  password: process.env.REDIS_URL
    ? new URL(process.env.REDIS_URL).password || undefined
    : undefined,
};

// ── Queues ──────────────────────────────────────────────────────────────────

export const vendorRefreshQueue = new Queue("vendor-refresh", {
  connection: REDIS_CONNECTION,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

export const statsRecalcQueue = new Queue("stats-recalc", {
  connection: REDIS_CONNECTION,
  defaultJobOptions: {
    attempts: 2,
    removeOnComplete: { count: 50 },
  },
});

export const finnrickSyncQueue = new Queue("finnrick-sync", {
  connection: REDIS_CONNECTION,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "exponential", delay: 10000 },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 25 },
  },
});

// ── Queue event logging ─────────────────────────────────────────────────────

export function setupQueueEvents(queue: Queue): QueueEvents {
  const events = new QueueEvents(queue.name, {
    connection: REDIS_CONNECTION,
  });

  events.on("completed", ({ jobId }) => {
    logger.info(`Job completed: ${queue.name}/${jobId}`);
  });

  events.on("failed", ({ jobId, failedReason }) => {
    logger.error(`Job failed: ${queue.name}/${jobId}`, {
      metadata: { reason: failedReason },
    });
  });

  return events;
}

// ── Helper to create workers ────────────────────────────────────────────────

export function createWorker(
  queueName: string,
  processor: (job: { name: string; data: Record<string, unknown> }) => Promise<void>,
) {
  const worker = new Worker(queueName, processor, {
    connection: REDIS_CONNECTION,
    concurrency: 2,
    limiter: {
      max: 5,
      duration: 60000, // max 5 jobs per minute
    },
  });

  worker.on("error", (err) => {
    logger.error(`Worker error [${queueName}]:`, {
      metadata: { error: err.message },
    });
  });

  return worker;
}
