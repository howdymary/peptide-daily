-- Migration: add_vendor_health_metrics
-- Adds source registry fields (vendorType, statusFlag) and per-vendor health
-- tracking metrics (lastScrapedAt, activeProducts, scraperErrorCount, lastScraperError)
-- to the vendor_mappings table.

-- New source registry columns
ALTER TABLE "vendor_mappings"
  ADD COLUMN "vendor_type"  TEXT NOT NULL DEFAULT 'research',
  ADD COLUMN "status_flag"  TEXT NOT NULL DEFAULT 'active';

-- Health metric columns (updated by aggregator after each run)
ALTER TABLE "vendor_mappings"
  ADD COLUMN "last_scraped_at"     TIMESTAMP(3),
  ADD COLUMN "active_products"     INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "scraper_error_count" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "last_scraper_error"  TEXT;

-- Indexes for admin dashboard queries
CREATE INDEX "vendor_mappings_status_flag_idx"   ON "vendor_mappings"("status_flag");
CREATE INDEX "vendor_mappings_last_scraped_at_idx" ON "vendor_mappings"("last_scraped_at");
