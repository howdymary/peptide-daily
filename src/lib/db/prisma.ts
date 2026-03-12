import { PrismaClient } from "@prisma/client";

/**
 * Singleton PrismaClient to avoid exhausting database connections
 * during Next.js hot reloads in development.
 *
 * In production on Vercel, each serverless function gets its own instance.
 * Use connection pooling (PgBouncer / Prisma Accelerate) to manage this.
 *
 * Performance notes:
 *  - connection_limit=10 caps connections per process (tune for your DB tier).
 *  - connect_timeout / socket_timeout prevent hung queries from blocking
 *    a serverless slot indefinitely.
 *  - pool_timeout=10 gives 10 s to acquire a pooled connection before failing.
 *
 * Append these query-string params to DATABASE_URL:
 *   ?connection_limit=10&connect_timeout=10&pool_timeout=10&socket_timeout=20
 * Or set PRISMA_CONNECTION_LIMIT / PRISMA_QUERY_TIMEOUT env vars below.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    // Datasource URL can be overridden per-process (useful for read replicas)
    datasources: process.env.DATABASE_URL_OVERRIDE
      ? { db: { url: process.env.DATABASE_URL_OVERRIDE } }
      : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown helper — call in worker entrypoints or test teardown.
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}
