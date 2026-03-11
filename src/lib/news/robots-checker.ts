/**
 * Minimal robots.txt compliance checker.
 *
 * We check whether our user-agent string is allowed to access the feed URL.
 * Result is stored on the NewsSource record so we don't re-check on every run.
 *
 * Approach:
 *   1. Fetch /robots.txt from the site origin.
 *   2. Parse Disallow rules for "*" and "PeptidePalBot".
 *   3. Return true if the feed path is not disallowed.
 *
 * Conservative: if robots.txt is unreachable or unparseable we assume ALLOWED
 * (the site likely has no restrictions) but log a warning.
 */

const USER_AGENT = "PeptidePalBot/1.0 (+https://peptidepal.com/about)";

/**
 * Returns true if the given feedUrl is allowed by the site's robots.txt.
 */
export async function checkRobotsTxt(siteUrl: string, feedPath: string): Promise<boolean> {
  try {
    const origin = new URL(siteUrl).origin;
    const robotsUrl = `${origin}/robots.txt`;

    const res = await fetch(robotsUrl, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      // No robots.txt → assume allowed
      return true;
    }

    const text = await res.text();
    return isPathAllowed(text, feedPath);
  } catch {
    // Network error or timeout → assume allowed, log elsewhere
    return true;
  }
}

/**
 * Parse robots.txt text and return whether `path` is allowed.
 * Handles User-agent: * and User-agent: PeptidePalBot sections.
 */
function isPathAllowed(robotsTxt: string, path: string): boolean {
  const lines = robotsTxt.split(/\r?\n/).map((l) => l.trim());

  let inRelevantBlock = false;
  const disallowedPaths: string[] = [];

  for (const line of lines) {
    if (line.startsWith("#") || line === "") {
      continue;
    }

    if (/^user-agent\s*:/i.test(line)) {
      const agent = line.replace(/^user-agent\s*:\s*/i, "").trim().toLowerCase();
      inRelevantBlock = agent === "*" || agent === "peptidepalbot";
      continue;
    }

    if (inRelevantBlock && /^disallow\s*:/i.test(line)) {
      const disallowed = line.replace(/^disallow\s*:\s*/i, "").trim();
      if (disallowed) {
        disallowedPaths.push(disallowed);
      }
    }
  }

  // If any disallow rule matches the path, it's not allowed
  for (const rule of disallowedPaths) {
    if (path.startsWith(rule)) return false;
  }

  return true;
}
