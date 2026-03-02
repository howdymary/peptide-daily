/**
 * Centralized, validated environment configuration.
 * Fails fast at startup if required variables are missing.
 */

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

export const env = {
  // Database
  DATABASE_URL: required("DATABASE_URL"),

  // Redis
  REDIS_URL: optional("REDIS_URL", "redis://localhost:6379"),

  // Auth
  AUTH_SECRET: required("AUTH_SECRET"),
  AUTH_URL: optional("AUTH_URL", "http://localhost:3000"),
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID || "",
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET || "",

  // App
  NEXT_PUBLIC_APP_URL: optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  NODE_ENV: optional("NODE_ENV", "development"),
  IS_PRODUCTION: process.env.NODE_ENV === "production",

  // Vendor
  VENDOR_REFRESH_INTERVAL_MINUTES: parseInt(
    optional("VENDOR_REFRESH_INTERVAL_MINUTES", "15"),
    10,
  ),

  // Rate limiting
  RATE_LIMIT_MAX: parseInt(optional("RATE_LIMIT_MAX", "100"), 10),
  RATE_LIMIT_WINDOW_SECONDS: parseInt(
    optional("RATE_LIMIT_WINDOW_SECONDS", "60"),
    10,
  ),

  // CORS
  CORS_ALLOWED_ORIGINS: optional("CORS_ALLOWED_ORIGINS", "http://localhost:3000")
    .split(",")
    .map((s) => s.trim()),
} as const;
