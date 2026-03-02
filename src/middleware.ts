import { NextRequest, NextResponse } from "next/server";
import { securityHeaders } from "@/lib/security/headers";

/**
 * Next.js middleware — runs on every request at the edge.
 *
 * Responsibilities:
 *  1. Apply security headers to all responses
 *  2. CORS enforcement for API routes
 *
 * Rate limiting is handled per-route in the API handlers (not here)
 * because edge middleware cannot access Redis on all platforms.
 */

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // Apply security headers
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // CORS for API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const origin = req.headers.get("origin") || "";
    const allowedOrigins = (
      process.env.CORS_ALLOWED_ORIGINS || "http://localhost:3000"
    )
      .split(",")
      .map((s) => s.trim());

    if (allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    response.headers.set("Access-Control-Max-Age", "86400");

    // Handle preflight
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images.
     * This ensures security headers are applied everywhere.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
