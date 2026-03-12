/**
 * Lightweight slug generator for news articles.
 * Must be collision-safe (articles from different sources may have same title).
 */

import { createHash } from "crypto";

export function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

  // Append 6-char hash to guarantee uniqueness across sources
  const hash = createHash("sha1").update(text).digest("hex").slice(0, 6);
  return `${base}-${hash}`;
}
