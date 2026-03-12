/**
 * Vitest global setup — sets required environment variables so
 * modules that read env.ts at import time don't throw.
 *
 * These are stubs only; tests that need a real DB or Redis
 * should use proper integration test infrastructure.
 */

process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://test:test@localhost:5432/test";
process.env.REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
process.env.AUTH_SECRET = process.env.AUTH_SECRET ?? "test-auth-secret-for-vitest";
process.env.SCRAPER_USER_AGENT =
  process.env.SCRAPER_USER_AGENT ?? "Peptide Daily-Aggregator/1.0 (test)";
