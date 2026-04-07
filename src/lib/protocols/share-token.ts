/**
 * Generate and validate nanoid-based share tokens for protocols.
 */

import { nanoid } from "nanoid";

/** Generate a URL-safe share token (12 characters). */
export function generateShareToken(): string {
  return nanoid(12);
}

/** Validate that a token looks well-formed (alphanumeric + _-). */
export function isValidShareToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{8,16}$/.test(token);
}
