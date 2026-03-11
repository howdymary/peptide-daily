# Peptide Daily — Technical Notes

Developer reference for the news ingestion pipeline, vendor scraping configuration, and data management workflows.

---

## News Ingestion Pipeline

### Architecture overview

```
NewsSource (DB) → fetchFeed() → entity extraction → NewsArticle upsert
      ↑                                                       ↓
  robots.txt check                                    Redis cache invalidation
      ↑
  BullMQ worker (scheduled every N hours)
```

All ingestion is **idempotent**: articles are keyed on `sourceUrl`. Re-running a source is always safe — duplicates are silently skipped (Prisma P2002 unique constraint).

### Adding a new news source

1. **Check robots.txt** — Before adding any source, verify the feed URL is allowed:

   ```bash
   npx tsx src/scripts/ingest-news.ts --robots
   ```

   Or check manually: `curl https://example.com/robots.txt`

2. **Add to seed data** — In `prisma/seed.ts`, add a `NewsSource` record:

   ```typescript
   await prisma.newsSource.upsert({
     where: { slug: "my-source-slug" },
     update: {},
     create: {
       name: "My Source Name",
       slug: "my-source-slug",
       feedUrl: "https://example.com/feed.rss",
       siteUrl: "https://example.com",
       feedType: "rss",        // "rss" or "atom"
       isActive: true,
       robotsTxtAllows: true,  // set false if robots.txt blocks scraping
       rateLimitMs: 5000,      // ms to wait between this source and the next
       description: "Optional description",
     },
   });
   ```

3. **Run the seed**: `npx tsx prisma/seed.ts`

4. **Test the source manually**:

   ```bash
   DATABASE_URL="..." npx tsx src/scripts/ingest-news.ts my-source-slug
   ```

5. **Add entity keywords** — If the source covers peptides not yet recognised, add them to `src/lib/news/entity-extractor.ts`:

   ```typescript
   // In PEPTIDE_KEYWORDS:
   "my-peptide": ["my peptide", "mypeptide", "my-pep"],
   ```

### Running ingestion manually

```bash
# All active sources
DATABASE_URL="..." npx tsx src/scripts/ingest-news.ts

# Single source
DATABASE_URL="..." npx tsx src/scripts/ingest-news.ts pubmed-peptides

# Refresh robots.txt status for all sources
DATABASE_URL="..." npx tsx src/scripts/ingest-news.ts --robots

# List all sources with health stats
DATABASE_URL="..." npx tsx src/scripts/ingest-news.ts --list
```

### Background worker

The `news-ingestion-worker.ts` BullMQ worker runs automatically in production. Configure via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEWS_INGESTION_INTERVAL_HOURS` | `4` | How often to run all active sources |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection for BullMQ |

Start the worker:

```bash
DATABASE_URL="..." REDIS_URL="..." npx tsx src/jobs/news-ingestion-worker.ts
```

The worker:
1. Refreshes robots.txt status for all sources on startup
2. Enqueues an initial run immediately
3. Re-enqueues after each completion with the configured interval
4. Handles SIGTERM/SIGINT gracefully

### Rate limiting and ethical scraping

- Each `NewsSource` has a `rateLimitMs` field (default 5000ms) — this delay is enforced **between sources**, not between articles within a source.
- The RSS fetcher sends `User-Agent: PeptideDailyBot/1.0 (+https://peptidedaily.com/about)` on all requests.
- Articles are display as **excerpts with attribution links only** — no full-text republishing.
- `robotsTxtAllows = false` completely prevents ingestion for that source.

### Seed articles (development / offline)

The sandbox environment has no internet access. Use the seed script to populate realistic sample articles:

```bash
DATABASE_URL="..." npx tsx src/scripts/seed-news-articles.ts
```

This inserts 13 pre-written articles covering BPC-157, semaglutide, GLP-1, TB-500, GHK-Cu, ipamorelin, FDA regulatory news, and NIH research updates.

---

## Vendor Scraping Configuration

### Vendor mapping

Finnrick vendor names don't always match our vendor slugs. The `VendorMapping` table links them:

```
Vendor (our DB) <── VendorMapping ──> Finnrick slug
                                 └──> vendor domain (for scraping)
                                 └──> scrapingEnabled flag
                                 └──> scrapingAdapter name
                                 └──> rateLimit (req/min)
```

Manage mappings via the admin API:

```bash
# List all mappings
curl /api/admin/vendor-mappings

# Update a mapping
curl -X PUT /api/admin/vendor-mappings \
  -H "Content-Type: application/json" \
  -d '{"vendorId": "...", "finnrickSlug": "paradigm-peptides", "scrapingEnabled": true, "rateLimit": 10}'
```

### Adding a new vendor fetcher

1. Create `src/lib/vendors/my-vendor.ts` extending `BaseFetcher`:

   ```typescript
   import { BaseFetcher } from "./base-fetcher";
   import type { VendorPeptideData } from "@/types";

   export class MyVendorFetcher extends BaseFetcher {
     readonly vendorSlug = "my-vendor";
     readonly baseUrl = "https://myvendor.com";

     async fetchAll(): Promise<VendorPeptideData[]> {
       const html = await this.fetchWithRetry("/products");
       return this.parseProducts(html);
     }

     private parseProducts(html: string): VendorPeptideData[] {
       // parse product listings...
     }
   }
   ```

2. Register in `src/lib/vendors/registry.ts`:

   ```typescript
   import { MyVendorFetcher } from "./my-vendor";

   export const vendorFetchers: VendorFetcher[] = [
     // ...existing fetchers,
     new MyVendorFetcher(),
   ];
   ```

3. Add HTML fixtures for tests in `src/lib/vendors/__fixtures__/my-vendor-products.html`

4. Add a `VendorMapping` seed entry in `prisma/seed.ts`

### JS-heavy vendor sites

If a vendor site requires JavaScript rendering (React/Vue SPA), set `scrapingEnabled: false` on its `VendorMapping`. The vendor will still appear with any manually-imported Finnrick data, but prices won't be scraped automatically. Document this in the mapping's `notes` field.

---

## Finnrick Data Import

Finnrick publishes lab testing results as downloadable CSV/JSON files (no public API). The import pipeline:

### Manual import via API

```bash
curl -X POST /api/finnrick/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "format": "json",
    "content": "<JSON string of FinnrickImportData>",
    "importedBy": "admin@example.com"
  }'
```

### JSON format

```json
{
  "ratings": [
    {
      "vendorSlug": "paradigm-peptides",
      "peptideSlug": "bpc-157",
      "grade": "A",
      "averageScore": 9.2,
      "testCount": 5,
      "minScore": 8.8,
      "maxScore": 9.6,
      "oldestTestDate": "2023-06-01",
      "newestTestDate": "2024-03-15",
      "finnrickUrl": "https://finnrick.com/vendors/paradigm-peptides"
    }
  ],
  "tests": [
    {
      "vendorSlug": "paradigm-peptides",
      "peptideSlug": "bpc-157",
      "testDate": "2024-03-15",
      "testScore": 9.6,
      "advertisedQuantity": 5.0,
      "actualQuantity": 4.97,
      "purity": 99.1,
      "batchId": "PP-2024-03",
      "labId": "lab-001",
      "source": "finnrick"
    }
  ]
}
```

### Automated sync

The `finnrick-sync-worker.ts` watches `FINNRICK_DATA_DIR` (default: `./data/finnrick`) for new `.json` or `.csv` files and imports them automatically. Configure:

| Variable | Default | Description |
|----------|---------|-------------|
| `FINNRICK_DATA_DIR` | `./data/finnrick` | Directory to watch for import files |
| `FINNRICK_SYNC_INTERVAL_HOURS` | `6` | How often to check for new files |
| `FINNRICK_BASE_URL` | `https://finnrick.com` | Finnrick site URL (for link generation) |

Place import files in `FINNRICK_DATA_DIR` and they'll be picked up on the next sync cycle.

### View import history

```bash
curl /api/finnrick/imports
```

Returns audit records with filename, record counts, error counts, and status for each import run.

---

## Trust Score Calculation

The Trust Score (0–100) is computed on read and cached in Redis (TTL 10 min). It combines three signals:

| Component | Weight | Source |
|-----------|--------|--------|
| Finnrick lab quality | 50% | Grade (A=90 → E=15) adjusted by `averageScore` |
| Community reviews | 30% | `(avgRating / 5) × 100`, confidence-adjusted by review count |
| Pricing signal | 20% | 100 for prices within ±30% of median; tapers at extremes |

If a component has no data, its weight redistributes proportionally to the other components. A peptide with only Finnrick data (no reviews, no price) uses 100% Finnrick weight.

Grade-to-base-score mapping:

| Grade | Base score |
|-------|------------|
| A | 90 |
| B | 75 |
| C | 55 |
| D | 35 |
| E | 15 |

The final Finnrick component score blends the grade base with the numeric `averageScore` (scaled 0–100 from 0–10):

```
finnrickComponent = (gradeBase × 0.6) + (averageScore × 10 × 0.4)
```

---

## Redis Cache Keys

| Key pattern | TTL | Contents |
|-------------|-----|----------|
| `homepage:aggregate` | 5 min | Full homepage API response |
| `news:list:*` | 3 min | Paginated news query results |
| `peptides:list:*` | 5 min | Paginated peptide catalog |
| `peptides:detail:*` | 5 min | Single peptide with prices + Finnrick data |
| `vendors:list` | 10 min | All vendors with aggregate stats |
| `vendors:detail:*` | 5 min | Single vendor detail |
| `finnrick:vendor:*:peptide:*` | 10 min | Per-vendor-peptide Finnrick rating |

To clear all caches (e.g., after a Finnrick import):

```bash
redis-cli KEYS "homepage:*" | xargs redis-cli DEL
redis-cli KEYS "peptides:*" | xargs redis-cli DEL
redis-cli KEYS "finnrick:*" | xargs redis-cli DEL
```

---

## Environment Variables Reference

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/peptidepal?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://peptidedaily.com"

# News ingestion
NEWS_INGESTION_INTERVAL_HOURS=4

# Finnrick sync
FINNRICK_DATA_DIR="./data/finnrick"
FINNRICK_SYNC_INTERVAL_HOURS=6
FINNRICK_BASE_URL="https://finnrick.com"

# Vendor scraping
SCRAPER_USER_AGENT="PeptideDailyBot/1.0 (+https://peptidedaily.com/about)"
SCRAPER_DEFAULT_RATE_LIMIT=10   # requests per minute

# App
NEXT_PUBLIC_BASE_URL="https://peptidedaily.com"
```

---

## Database Migrations

```bash
# Create and apply a new migration
npx prisma migrate dev --name describe-your-change

# Apply migrations in production (non-interactive)
npx prisma migrate deploy

# Reset DB and re-seed (dev only — DESTROYS ALL DATA)
npx prisma migrate reset

# Re-seed without resetting
npx tsx prisma/seed.ts
npx tsx src/scripts/seed-news-articles.ts
```

---

## Common Dev Workflows

### Full local setup

```bash
# 1. Install dependencies
npm install

# 2. Start Postgres + Redis (Docker Compose or local)
docker compose up -d

# 3. Apply migrations and seed
npx prisma migrate dev
npx tsx prisma/seed.ts
npx tsx src/scripts/seed-news-articles.ts

# 4. Start dev server
npm run dev
```

### After adding a new Prisma model

```bash
npx prisma migrate dev --name add-my-model
npx prisma generate
```

The generate step updates the Prisma Client types — required before TypeScript will accept new model fields.

### Type checking

```bash
npx tsc --noEmit
```

### Production build check

```bash
npm run build
```
