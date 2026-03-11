#!/usr/bin/env npx tsx
/**
 * Lightweight load test for PeptidePal API endpoints.
 *
 * Uses Node.js built-in fetch (Node 18+) — no extra dependencies.
 *
 * Usage:
 *   npx tsx scripts/load-test.ts                       # default: 20 VUs, 15s
 *   BASE_URL=https://myapp.com npx tsx scripts/load-test.ts
 *   CONCURRENCY=50 DURATION_SECS=30 npx tsx scripts/load-test.ts
 *
 * Scenarios (run in parallel, each with its own VU pool):
 *   1. GET /api/health                              — smoke / baseline
 *   2. GET /api/peptides                            — catalog browse
 *   3. GET /api/peptides?search=bpc-157             — filtered search
 *   4. GET /api/peptides?sortBy=trust_score&page=2  — sorted + paged
 *   5. GET /api/vendors                             — vendor listing
 *   6. GET /api/news                                — news feed
 *   7. GET /api/homepage                            — aggregate endpoint
 *
 * Reports per-scenario: req/s, p50, p95, p99 latency, error rate.
 */

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const CONCURRENCY = Number(process.env.CONCURRENCY ?? "20");
const DURATION_SECS = Number(process.env.DURATION_SECS ?? "15");

// ── Scenarios ────────────────────────────────────────────────────────────────

interface Scenario {
  name: string;
  path: string;
}

const SCENARIOS: Scenario[] = [
  { name: "health",           path: "/api/health" },
  { name: "peptides-list",    path: "/api/peptides" },
  { name: "peptides-search",  path: "/api/peptides?search=bpc-157" },
  { name: "peptides-sorted",  path: "/api/peptides?sortBy=trust_score&page=2" },
  { name: "vendors-list",     path: "/api/vendors" },
  { name: "news-feed",        path: "/api/news" },
  { name: "homepage",         path: "/api/homepage" },
];

// ── Stats tracking ───────────────────────────────────────────────────────────

interface Stats {
  name: string;
  latencies: number[];
  errors: number;
  total: number;
  startMs: number;
}

function createStats(name: string): Stats {
  return { name, latencies: [], errors: 0, total: 0, startMs: Date.now() };
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function printReport(stats: Stats) {
  const elapsedSecs = (Date.now() - stats.startMs) / 1000;
  const sorted = [...stats.latencies].sort((a, b) => a - b);
  const rps = stats.total / elapsedSecs;
  const errPct = stats.total > 0 ? ((stats.errors / stats.total) * 100).toFixed(1) : "0.0";

  console.log(`\n  Scenario: ${stats.name}`);
  console.log(`    Requests:   ${stats.total} total, ${stats.errors} errors (${errPct}%)`);
  console.log(`    Throughput: ${rps.toFixed(1)} req/s`);
  console.log(`    Latency:    p50=${percentile(sorted, 50)}ms  p95=${percentile(sorted, 95)}ms  p99=${percentile(sorted, 99)}ms`);
}

// ── Virtual user ─────────────────────────────────────────────────────────────

async function runVu(url: string, stats: Stats, signal: AbortSignal): Promise<void> {
  while (!signal.aborted) {
    const start = Date.now();
    try {
      const res = await fetch(url, { signal });
      const latency = Date.now() - start;
      stats.latencies.push(latency);
      stats.total++;
      if (!res.ok && res.status !== 429) {
        stats.errors++;
      }
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") break;
      stats.errors++;
      stats.total++;
    }
  }
}

// ── Runner ───────────────────────────────────────────────────────────────────

async function runScenario(scenario: Scenario): Promise<Stats> {
  const url = `${BASE_URL}${scenario.path}`;
  const stats = createStats(scenario.name);
  const controller = new AbortController();

  const vus = Array.from({ length: CONCURRENCY }, () =>
    runVu(url, stats, controller.signal),
  );

  setTimeout(() => controller.abort(), DURATION_SECS * 1000);
  await Promise.allSettled(vus);
  return stats;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nPeptidePal Load Test`);
  console.log(`  Base URL:    ${BASE_URL}`);
  console.log(`  Concurrency: ${CONCURRENCY} VUs per scenario`);
  console.log(`  Duration:    ${DURATION_SECS}s per scenario`);
  console.log(`  Scenarios:   ${SCENARIOS.length}`);

  // Warm-up: single GET /api/health to confirm the server is up
  try {
    const warmup = await fetch(`${BASE_URL}/api/health`);
    if (!warmup.ok) {
      console.error(`\nWarm-up check failed: ${warmup.status}. Is the server running?`);
      process.exit(1);
    }
    console.log(`\n✓ Server reachable (${warmup.status})`);
  } catch {
    console.error(`\nCould not reach ${BASE_URL}/api/health. Is the server running?`);
    process.exit(1);
  }

  console.log("\nRunning scenarios sequentially…\n");

  const allStats: Stats[] = [];

  for (const scenario of SCENARIOS) {
    process.stdout.write(`  Running: ${scenario.name.padEnd(20)} `);
    const stats = await runScenario(scenario);
    allStats.push(stats);
    process.stdout.write("done\n");
  }

  console.log("\n══════════════════════════════════════════════════");
  console.log("  RESULTS");
  console.log("══════════════════════════════════════════════════");

  for (const stats of allStats) {
    printReport(stats);
  }

  console.log("\n══════════════════════════════════════════════════");
  console.log("  SUMMARY");
  console.log("══════════════════════════════════════════════════");

  const totalReqs = allStats.reduce((s, x) => s + x.total, 0);
  const totalErrors = allStats.reduce((s, x) => s + x.errors, 0);
  const overallErrPct = totalReqs > 0 ? ((totalErrors / totalReqs) * 100).toFixed(1) : "0.0";

  console.log(`\n  Total requests: ${totalReqs}`);
  console.log(`  Total errors:   ${totalErrors} (${overallErrPct}%)`);

  // Recommendations based on results
  console.log("\n  Recommendations:");
  for (const stats of allStats) {
    const sorted = [...stats.latencies].sort((a, b) => a - b);
    const p95 = percentile(sorted, 95);
    const errPct = stats.total > 0 ? (stats.errors / stats.total) * 100 : 0;
    if (p95 > 500) {
      console.log(`  ⚠  ${stats.name}: p95 latency ${p95}ms — consider additional caching or DB indexes`);
    }
    if (errPct > 5) {
      console.log(`  ⚠  ${stats.name}: error rate ${errPct.toFixed(1)}% — check rate limits or server capacity`);
    }
    if (p95 <= 500 && errPct <= 5) {
      console.log(`  ✓  ${stats.name}: looks healthy (p95=${p95}ms, err=${errPct.toFixed(1)}%)`);
    }
  }

  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
