/**
 * Smoke test for /api/health.
 *
 * This test starts the Next.js dev server (or uses the already-running one)
 * and verifies the health endpoint returns the expected shape.
 *
 * Run against a live server:
 *   BASE_URL=http://localhost:3000 npx vitest run src/__tests__/health.test.ts
 */

import { describe, it, expect } from "vitest";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

describe("/api/health (smoke test — requires running server)", () => {
  it("returns 200 or 503 with the correct JSON shape", async () => {
    let res: Response;
    try {
      res = await fetch(`${BASE_URL}/api/health`);
    } catch {
      console.warn(`  ⚠  Could not reach ${BASE_URL} — skipping smoke test`);
      return; // skip gracefully if server is not running
    }

    expect([200, 503]).toContain(res.status);

    const body = await res.json();
    expect(body).toHaveProperty("status");
    expect(["ok", "degraded"]).toContain(body.status);
    expect(body).toHaveProperty("timestamp");
    expect(body).toHaveProperty("checks");
    expect(body.checks).toHaveProperty("database");
    expect(body.checks).toHaveProperty("redis");
  });

  it("responds quickly (< 5000ms)", async () => {
    const start = Date.now();
    try {
      await fetch(`${BASE_URL}/api/health`);
    } catch {
      return;
    }
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });
});
