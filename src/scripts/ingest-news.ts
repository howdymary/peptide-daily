#!/usr/bin/env npx tsx
/**
 * CLI helper for running news ingestion manually.
 *
 *   # Run all active sources:
 *   npx tsx src/scripts/ingest-news.ts
 *
 *   # Run a single source by slug:
 *   npx tsx src/scripts/ingest-news.ts pubmed-peptides
 *
 *   # Refresh robots.txt status for all sources:
 *   npx tsx src/scripts/ingest-news.ts --robots
 *
 *   # List all configured sources:
 *   npx tsx src/scripts/ingest-news.ts --list
 */

import { runIngestion, refreshRobotsTxtStatus } from "@/lib/news/ingestion-service";
import { prisma } from "@/lib/db/prisma";

async function main() {
  const arg = process.argv[2];

  if (arg === "--list") {
    const sources = await prisma.newsSource.findMany({
      orderBy: { name: "asc" },
    });
    console.log("\nConfigured news sources:");
    console.log("─".repeat(70));
    for (const s of sources) {
      const status = s.isActive
        ? s.robotsTxtAllows
          ? "✓ active"
          : "⚠ blocked (robots.txt)"
        : "✗ disabled";
      console.log(
        `${s.slug.padEnd(30)} ${status.padEnd(25)} fetches:${s.fetchCount} errors:${s.errorCount}`,
      );
      if (s.lastFetchedAt) {
        const elapsed = Math.round((Date.now() - s.lastFetchedAt.getTime()) / 60000);
        console.log(`${"".padEnd(30)} last run ${elapsed}m ago — ${s.lastFetchStatus ?? "unknown"}`);
      }
    }
    console.log("─".repeat(70));
    return;
  }

  if (arg === "--robots") {
    console.log("\nRefreshing robots.txt status for all sources…");
    await refreshRobotsTxtStatus();
    console.log("Done.");
    return;
  }

  const sourceSlug = arg && !arg.startsWith("--") ? arg : undefined;
  console.log(`\nRunning news ingestion${sourceSlug ? ` for source: ${sourceSlug}` : " for all sources"}…\n`);

  const stats = await runIngestion(sourceSlug);

  console.log("─".repeat(50));
  console.log(`Sources processed : ${stats.sources}`);
  console.log(`Articles fetched  : ${stats.fetched}`);
  console.log(`New articles saved: ${stats.inserted}`);
  console.log(`Skipped (existed) : ${stats.skipped}`);
  console.log(`Errors            : ${stats.errors}`);
  console.log(`Duration          : ${(stats.durationMs / 1000).toFixed(1)}s`);
  console.log("─".repeat(50));

  if (stats.errors > 0) {
    console.log("\nFailed sources:");
    for (const r of stats.results.filter((r) => r.error)) {
      console.log(`  ${r.sourceName}: ${r.error}`);
    }
  }
}

main()
  .catch((err) => {
    console.error("Ingestion failed:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
