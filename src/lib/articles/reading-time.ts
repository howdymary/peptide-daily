/**
 * Calculate estimated reading time from text content.
 * Average reading speed: 238 words per minute (Brysbaert, 2019).
 */

const WORDS_PER_MINUTE = 238;

export function estimateReadingTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return Math.max(1, minutes);
}
