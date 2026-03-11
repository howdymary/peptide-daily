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

// ── In-memory fallback ───────────────────────────────────────────────────────
// Used when Redis is unavailable.  Keyed by `${prefix}:${identifier}`.
// Intentionally simple — entries expire after windowSeconds.

interface FallbackBucket {
  count: number;
  resetAt: number; // unix seconds
}

const fallbackStore = new Map<string, FallbackBucket>();

/** Prune expired entries every 60 s to avoid unbounded growth */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Math.floor(Date.now() / 1000);
    for (const [k, bucket] of fallbackStore) {
      if (bucket.resetAt <= now) fallbackStore.delete(k);
    }
  }, 60_000).unref?.();
}

function fallbackRateLimit(
  key: string,
  max: number,
  windowSeconds: number,
): RateLimitResult {
  const now = Math.floor(Date.now() / 1000);
  const existing = fallbackStore.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowSeconds;
    fallbackStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: max - 1, resetAt };
  }

  existing.count += 1;
  return {
    allowed: existing.count <= max,
    remaining: Math.max(0, max - existing.count),
    resetAt: existing.resetAt,
  };
}

// ── IP extraction helpers ────────────────────────────────────────────────────

const IPV4_RE = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6_RE = /^[\da-f:]+$/i;

/**
 * Extract the true client IP from request headers.
 *
 * We validate the extracted value against IPv4/IPv6 patterns so a
 * malicious X-Forwarded-For header cannot bypass rate limiting by
 * injecting arbitrary strings.
 *
 * If the header value is invalid we fall back to "unknown", which puts
 * all such requests into a single shared bucket — conservative but safe.
 */
function extractClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    // Take the first (leftmost) IP — the originating client when the
    // proxy appends IPs left-to-right.
    const candidate = xff.split(",")[0]?.trim() ?? "";
    if (IPV4_RE.test(candidate) || IPV6_RE.test(candidate)) {
      return candidate;
    }
  }

  const xri = req.headers.get("x-real-ip")?.trim();
  if (xri && (IPV4_RE.test(xri) || IPV6_RE.test(xri))) {
    return xri;
  }

  return "unknown";
}

// ── Core rate limit logic ────────────────────────────────────────────────────

/**
 * Token-bucket style rate limiter backed by Redis with in-memory fallback.
 *
 * Fail-safe behaviour:
 *  - Redis healthy: uses Redis INCR + EXPIRE pipeline.
 *  - Redis unavailable: falls back to the in-process store.
 *    Each server instance enforces limits independently rather than
 *    silently allowing unlimited requests.
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

    // First request in window — set expiry
    if (count === 1 || ttl === -1) {
      await redis.expire(key, windowSeconds);
    }

    return {
      allowed: count <= max,
      remaining: Math.max(0, max - count),
      resetAt: now + (ttl > 0 ? ttl : windowSeconds),
    };
  } catch {
    // Redis unavailable — use in-process fallback (per-instance limiting)
    console.warn("[RateLimit] Redis unavailable, using in-memory fallback");
    return fallbackRateLimit(key, max, windowSeconds);
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
  const ip = extractClientIp(req);

  const mergedConfig: RateLimitConfig = {
    max: config?.max ?? (Number(process.env.RATE_LIMIT_MAX) || 100),
    windowSeconds:
      config?.windowSeconds ??
      (Number(process.env.RATE_LIMIT_WINDOW_SECONDS) || 60),
    keyPrefix: config?.keyPrefix ?? "rl",
  };

  const result = await checkRateLimit(ip, mergedConfig);

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please try again later.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(result.resetAt - Math.floor(Date.now() / 1000)),
          "X-RateLimit-Limit": String(mergedConfig.max),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(result.resetAt),
        },
      },
    );
  }

  return null; // No rate limit hit — proceed
}
