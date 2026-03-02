import { redis } from "@/lib/redis/client";
import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  max: number;
  windowSeconds: number;
  keyPrefix?: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Token-bucket style rate limiter backed by Redis.
 * Returns headers-compatible result for the caller to decide what to do.
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const { max, windowSeconds, keyPrefix = "rl" } = config;
  const key = `${keyPrefix}:${identifier}`;
  const now = Math.floor(Date.now() / 1000);

  try {
    const pipe = redis.pipeline();
    pipe.incr(key);
    pipe.ttl(key);
    const results = await pipe.exec();

    const count = (results?.[0]?.[1] as number) || 0;
    const ttl = (results?.[1]?.[1] as number) || -1;

    // First request — set the window TTL
    if (count === 1 || ttl === -1) {
      await redis.expire(key, windowSeconds);
    }

    return {
      allowed: count <= max,
      remaining: Math.max(0, max - count),
      resetAt: now + (ttl > 0 ? ttl : windowSeconds),
    };
  } catch {
    // If Redis is down, allow the request (fail open) but log it
    console.warn("[RateLimit] Redis unavailable, allowing request");
    return { allowed: true, remaining: max, resetAt: now + windowSeconds };
  }
}

/**
 * Higher-order helper for API route handlers.
 * Extracts IP from request and applies rate limiting.
 */
export async function withRateLimit(
  req: NextRequest,
  config?: Partial<RateLimitConfig>,
): Promise<NextResponse | null> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const mergedConfig: RateLimitConfig = {
    max: config?.max ?? 100,
    windowSeconds: config?.windowSeconds ?? 60,
    keyPrefix: config?.keyPrefix ?? "rl",
  };

  const result = await checkRateLimit(ip, mergedConfig);

  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too Many Requests", message: "Rate limit exceeded. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(result.resetAt - Math.floor(Date.now() / 1000)),
          "X-RateLimit-Limit": String(mergedConfig.max),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  return null; // No rate limit hit — proceed
}
