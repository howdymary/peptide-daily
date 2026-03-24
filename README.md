# Peptide Daily

Independent peptide price comparison with third-party lab data, vendor reviews, and research news.

**Live at [peptidedaily.com](https://peptidedaily.com)**

## Overview

Peptide Daily aggregates pricing, lab testing data, and community reviews across peptide vendors into a single, trustworthy resource. Think "The Points Guy" for the peptide market — comparison-driven, editorially independent, and data-rich.

## Features

- **Price Comparison** — Real-time pricing across 10+ vendors, filterable by peptide, concentration, and availability
- **Lab Data Integration** — Third-party testing grades from Finnrick with per-vendor, per-peptide quality scores
- **Trust Score** — Composite quality metric (50% lab data, 30% community reviews, 20% pricing)
- **Research News** — Curated feed from PubMed, FDA, NIH, and Science Daily via RSS ingestion
- **Peptide Guides** — Evidence-based educational content with regulatory status and citation-backed research summaries
- **Community Reviews** — Authenticated user reviews with moderation
- **Vendor Profiles** — Detailed vendor pages with Finnrick test results, pricing, and health metrics

## Tech Stack

- **Framework** — Next.js 16 (App Router, Server Components)
- **Language** — TypeScript
- **Database** — PostgreSQL via Prisma ORM
- **Caching** — Redis (Upstash)
- **Auth** — NextAuth v5 with credentials and Google OAuth
- **Styling** — Tailwind CSS v4
- **Hosting** — Vercel
- **Data** — Finnrick lab testing API, RSS news ingestion

## Getting Started

```bash
# Prerequisites: Docker (for Postgres + Redis)
docker compose up -d

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your database credentials

# Run migrations and seed
npx prisma migrate dev
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/           # Next.js App Router pages and API routes
  components/    # React components (home, layout, finnrick, reviews, seo)
  lib/           # Business logic (auth, db, finnrick, news, security, redis)
  config/        # SEO and app configuration
prisma/          # Schema, migrations, and seed data
```

## License

MIT
