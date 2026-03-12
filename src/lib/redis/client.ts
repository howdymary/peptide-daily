import Redis from "ioredis";

/**
 * Singleton Redis client.
 * On Vercel, use Upstash Redis (REST-based, serverless-safe).
 * On AWS, point to ElastiCache Redis.
 */

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const url = process.env.REDIS_URL || "redis://localhost:6379";

  const client = new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
    enableReadyCheck: true,
    lazyConnect: true,
    // Command timeout: abort if Redis doesn't respond within 5s
    commandTimeout: 5000,
  });

  client.on("error", (err) => {
    console.error("[Redis] Connection error:", err.message);
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

// ── Cache helpers ───────────────────────────────────────────────────────────

const DEFAULT_TTL = 300; // 5 minutes

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds = DEFAULT_TTL,
): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (err) {
    console.error("[Redis] Cache set error:", err);
  }
}

/**
 * Delete cache keys matching a glob pattern using SCAN.
 *
 * Uses SCAN (not KEYS) so the operation is non-blocking and safe for
 * large production keyspaces.  SCAN iterates in batches of 100 and
 * never blocks Redis for more than a few microseconds per call.
 */
export async function cacheDelete(pattern: string): Promise<void> {
  try {
    let cursor = "0";
    const batchSize = 100;
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        batchSize,
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch (err) {
    console.error("[Redis] Cache delete error:", err);
  }
}
