/**
 * Shared types for the news ingestion pipeline.
 */

export interface NormalizedArticle {
  title: string;
  sourceUrl: string;
  slug: string;
  excerpt: string | null;
  author: string | null;
  publishedAt: Date;
  tags: string[];
}

export interface FetchResult {
  sourceId: string;
  sourceName: string;
  articles: NormalizedArticle[];
  durationMs: number;
  error?: string;
}

export interface IngestionStats {
  sources: number;
  fetched: number;
  inserted: number;
  skipped: number;  // already existed (dedup)
  errors: number;
  durationMs: number;
  results: FetchResult[];
}
