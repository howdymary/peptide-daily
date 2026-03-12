/**
 * GET /api/health
 *
 * Lightweight health check for load balancers, uptime monitors, and
 * post-deployment smoke tests.
 *
 * Returns HTTP 200 with { status: "ok" } when all subsystems are healthy.
 * Returns HTTP 503 with details when any subsystem is degraded.
 *
 * Does NOT require authentication — probes should be able to call this
 * without credentials.  Do NOT expose sensitive internal details.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { redis } from "@/lib/redis/client";

// Health check should not be rate-limited (it's a tiny no-data read).
// We skip the normal withRateLimit() call here intentionally.

const TIMEOUT_MS = 3000; // 3 s max per subsystem check

async function checkDatabase(): Promise<{ ok: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS),
      ),
    ]);
    return { ok: true, latencyMs: Date.now() - start };
  } catch {
    return { ok: false, latencyMs: Date.now() - start };
  }
}

async function checkRedis(): Promise<{ ok: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    const pong = await Promise.race([
      redis.ping(),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS),
      ),
    ]);
    return { ok: pong === "PONG", latencyMs: Date.now() - start };
  } catch {
    return { ok: false, latencyMs: Date.now() - start };
  }
}

// No-cache — health check must always reflect current state
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const [db, cache] = await Promise.all([checkDatabase(), checkRedis()]);

  const allOk = db.ok && cache.ok;

  const body = {
    status: allOk ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "unknown",
    checks: {
      database: { status: db.ok ? "ok" : "error", latencyMs: db.latencyMs },
      redis: { status: cache.ok ? "ok" : "error", latencyMs: cache.latencyMs },
    },
  };

  return Response.json(body, { status: allOk ? 200 : 503 });
}
