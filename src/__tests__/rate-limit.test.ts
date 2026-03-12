/**
 * Tests for rate limiter — specifically the in-memory fallback and IP extraction.
 *
 * We do not need Redis running for these tests; the fallback path is exercised
 * by mocking the Redis client to throw.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────────────

// Mock the Redis client to simulate outage
vi.mock("@/lib/redis/client", () => ({
  redis: {
    pipeline: () => ({
      incr: vi.fn(),
      ttl: vi.fn(),
      exec: vi.fn().mockRejectedValue(new Error("Redis connection refused")),
    }),
    expire: vi.fn().mockRejectedValue(new Error("Redis connection refused")),
  },
}));

// Import AFTER mocking
import { checkRateLimit } from "@/lib/security/rate-limit";

// ── Tests ────────────────────────────────────────────────────────────────────

describe("checkRateLimit — in-memory fallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows requests under the limit", async () => {
    const config = { max: 5, windowSeconds: 60, keyPrefix: "test-allow" };
    const result = await checkRateLimit("192.0.2.1", config);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });

  it("blocks requests that exceed the limit", async () => {
    const config = { max: 3, windowSeconds: 60, keyPrefix: "test-block" };
    const id = "192.0.2.2";

    // Make 3 allowed requests
    for (let i = 0; i < 3; i++) {
      const r = await checkRateLimit(id, config);
      expect(r.allowed).toBe(true);
    }

    // 4th request should be blocked
    const blocked = await checkRateLimit(id, config);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("separate identifiers have independent buckets", async () => {
    const config = { max: 1, windowSeconds: 60, keyPrefix: "test-sep" };

    const r1 = await checkRateLimit("10.0.0.1", config);
    const r2 = await checkRateLimit("10.0.0.2", config);

    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true); // different IP — own bucket
  });

  it("provides a resetAt timestamp in the future", async () => {
    const config = { max: 10, windowSeconds: 30, keyPrefix: "test-reset" };
    const result = await checkRateLimit("192.0.2.3", config);
    const now = Math.floor(Date.now() / 1000);
    expect(result.resetAt).toBeGreaterThan(now);
    expect(result.resetAt).toBeLessThanOrEqual(now + 30 + 1);
  });
});
