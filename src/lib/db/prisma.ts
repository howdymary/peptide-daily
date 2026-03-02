import { PrismaClient } from "@prisma/client";

/**
 * Singleton PrismaClient to avoid exhausting database connections
 * during Next.js hot reloads in development.
 *
 * In production on Vercel, each serverless function gets its own instance.
 * Use connection pooling (PgBouncer / Prisma Accelerate) to manage this.
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
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
