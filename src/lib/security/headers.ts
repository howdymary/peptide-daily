/**
 * Security headers applied via Next.js middleware.
 *
 * Production vs development differences:
 *  - unsafe-eval is excluded in production (Next.js 13+ no longer needs it).
 *  - In development we keep unsafe-eval only to support HMR/fast-refresh.
 *  - connect-src is expanded to allow ws:// for HMR websockets in dev.
 *
 * CSP notes:
 *  - Google Fonts (fonts.googleapis.com, fonts.gstatic.com) are whitelisted
 *    because globals.css imports them via @import url(...).
 *  - 'unsafe-inline' for style-src is required by Tailwind CSS v4's runtime
 *    style injection; a nonce-based approach can replace this in the future.
 *  - form-action is restricted to 'self' to prevent open-redirect via forms.
 */

const isDev = process.env.NODE_ENV !== "production";

// script-src: remove unsafe-eval in production
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-inline'";

// connect-src: allow ws:// websockets for Next.js HMR in dev only
const connectSrc = isDev
  ? "connect-src 'self' ws: wss:"
  : "connect-src 'self'";

export const securityHeaders: Record<string, string> = {
  // Prevent clickjacking
  "X-Frame-Options": "DENY",

  // Prevent MIME-type sniffing
  "X-Content-Type-Options": "nosniff",

  // Referrer policy — send origin only on cross-origin requests
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Enable HSTS (browsers will only connect via HTTPS for 1 year)
  // Skip in development to avoid breaking localhost
  ...(isDev
    ? {}
    : {
        "Strict-Transport-Security":
          "max-age=31536000; includeSubDomains; preload",
      }),

  // Prefetch control
  "X-DNS-Prefetch-Control": "on",

  // Permissions policy — disable unnecessary browser features
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), browsing-topics=()",

  // Content-Security-Policy
  "Content-Security-Policy": [
    "default-src 'self'",
    scriptSrc,
    // unsafe-inline required for Tailwind v4 runtime styles
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Allow images from vendor sites added to next.config.ts remotePatterns
    "img-src 'self' data: https:",
    // Google Fonts CDN for font files
    "font-src 'self' https://fonts.gstatic.com",
    connectSrc,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    // Restrict form submissions to same origin — prevents open-redirect
    "form-action 'self'",
    // Block all plugins (Flash, etc.)
    "object-src 'none'",
  ].join("; "),
};
