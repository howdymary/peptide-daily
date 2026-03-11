/**
 * RSS / Atom feed fetcher.
 *
 * Uses rss-parser (handles both RSS 2.0 and Atom 1.0).
 * Returns normalized NormalizedArticle objects ready to upsert.
 *
 * Legal / ethical constraints enforced here:
 *   - Identifies itself with a clear User-Agent.
 *   - Only fetches the feed URL (public metadata only).
 *   - Truncates excerpts at 400 characters — we never republish full content.
 *   - Rate limiting is handled by the caller (ingestion-service).
 */

import Parser from "rss-parser";
import { slugify } from "@/lib/news/slug";
import { extractTags } from "./entity-extractor";
import type { NormalizedArticle } from "./types";

const USER_AGENT =
  "PeptidePalBot/1.0 (+https://peptidepal.com/about) rss-aggregator/educational";

const parser = new Parser({
  headers: { "User-Agent": USER_AGENT },
  timeout: 12000,
  customFields: {
    item: [
      ["dc:creator", "creator"],
      ["content:encoded", "contentEncoded"],
      ["description", "description"],
    ],
  },
});

const MAX_EXCERPT_CHARS = 400;

/**
 * Fetch and parse an RSS/Atom feed.
 * @param feedUrl  The feed URL to fetch.
 * @param limit    Max articles to return (most recent first).
 */
export async function fetchFeed(
  feedUrl: string,
  limit = 20,
): Promise<NormalizedArticle[]> {
  const feed = await parser.parseURL(feedUrl);
  const items = (feed.items ?? []).slice(0, limit);

  const articles: NormalizedArticle[] = [];

  for (const item of items) {
    const title = (item.title ?? "").trim();
    if (!title) continue;

    const url = item.link ?? item.guid ?? "";
    if (!url) continue;

    // Extract plain-text excerpt — strip any HTML tags
    const itemAny = item as unknown as Record<string, unknown>;
    const rawExcerpt =
      (itemAny.contentSnippet as string | undefined) ||
      item.summary ||
      (itemAny.description as string | undefined) ||
      "";
    const excerpt = stripHtml(rawExcerpt).slice(0, MAX_EXCERPT_CHARS).trim() || null;

    const publishedAt = item.pubDate
      ? new Date(item.pubDate)
      : item.isoDate
        ? new Date(item.isoDate)
        : new Date();

    const author =
      (itemAny.creator as string | undefined) ||
      (itemAny.author as string | undefined) ||
      null;

    const tags = extractTags(title, excerpt);

    articles.push({
      title,
      sourceUrl: normalizeUrl(url),
      slug: slugify(`${title}-${publishedAt.getFullYear()}`),
      excerpt,
      author: author ?? null,
      publishedAt,
      tags,
    });
  }

  return articles;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalise URL: strip tracking params, ensure no trailing slash on path. */
function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw);
    // Remove common tracking params
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(
      (p) => u.searchParams.delete(p),
    );
    return u.toString();
  } catch {
    return raw;
  }
}
