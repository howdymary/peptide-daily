import { cacheGet, cacheSet, cacheDelete } from "@/lib/redis/client";
import type { FinnrickRatingItem } from "@/types";

/** TTL for Finnrick data: 10 minutes (data changes infrequently) */
const FINNRICK_TTL = 600;

function ratingKey(vendorId: string, peptideId: string): string {
  return `finnrick:vendor:${vendorId}:peptide:${peptideId}`;
}

export async function getCachedFinnrickRating(
  vendorId: string,
  peptideId: string,
): Promise<FinnrickRatingItem | null> {
  return cacheGet<FinnrickRatingItem>(ratingKey(vendorId, peptideId));
}

export async function cacheFinnrickRating(
  vendorId: string,
  peptideId: string,
  data: FinnrickRatingItem,
): Promise<void> {
  await cacheSet(ratingKey(vendorId, peptideId), data, FINNRICK_TTL);
}

export async function invalidateFinnrickCache(): Promise<void> {
  await cacheDelete("finnrick:*");
}
