import type { NextConfig } from "next";

/**
 * Next.js configuration.
 *
 * Deployment notes:
 * - On Vercel: this config works as-is. Vercel handles edge caching,
 *   CDN for static assets, and serverless function deployment automatically.
 * - On AWS: use `output: "standalone"` for Docker-based ECS/Fargate deployment.
 *   Static assets should be served via CloudFront CDN.
 */

const nextConfig: NextConfig = {
  // Enable standalone output for Docker/self-hosted deployments
  // Uncomment for AWS ECS/Fargate:
  // output: "standalone",

  // Strict React mode for catching bugs early
  reactStrictMode: true,

  // External packages that should not be bundled by the serverless bundler
  serverExternalPackages: ["bcryptjs", "bullmq"],

  // Image optimization — allow vendor product images
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "verifiedpeptides.com" },
      { protocol: "https", hostname: "peptide.partners" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google OAuth avatars
    ],
  },

  // Security headers are applied via middleware.ts for more control.
  // You can also add them here as a fallback:
  // async headers() { ... }

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
