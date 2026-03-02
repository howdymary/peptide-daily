/**
 * Security headers applied via Next.js middleware.
 * These defend against XSS, clickjacking, MIME sniffing, and more.
 */

export const securityHeaders: Record<string, string> = {
  // Prevent clickjacking
  "X-Frame-Options": "DENY",

  // Prevent MIME-type sniffing
  "X-Content-Type-Options": "nosniff",

  // Referrer policy — send origin only on cross-origin requests
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Enable HSTS (browsers will only connect via HTTPS for 1 year)
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

  // Prevent pages from being embedded
  "X-DNS-Prefetch-Control": "on",

  // Permissions policy — disable unnecessary browser features
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), browsing-topics=()",

  // Content-Security-Policy — lock down resource loading
  // Adjust 'script-src' and 'style-src' as your app evolves.
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires these in dev; tighten with nonces in production
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};
