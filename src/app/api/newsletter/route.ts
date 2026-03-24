import { NextRequest } from "next/server";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { withRateLimit } from "@/lib/security/rate-limit";
import { logger } from "@/lib/utils/logger";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");

interface Subscriber {
  email: string;
  subscribedAt: string;
}

async function readSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    // File doesn't exist yet — return empty array
    return [];
  }
}

async function writeSubscribers(subscribers: Subscriber[]): Promise<void> {
  // Ensure data directory exists
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
}

/**
 * POST /api/newsletter
 * Subscribe an email to the newsletter.
 * Rate limited: 3 per minute per IP.
 */
export async function POST(req: NextRequest) {
  // Rate limit — 3 per minute per IP
  const rateLimited = await withRateLimit(req, {
    max: 3,
    windowSeconds: 60,
    keyPrefix: "rl:newsletter",
  });
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues.map((i) => i.message).join(", "),
        422,
      );
    }

    const { email } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Read current subscribers, deduplicate, append
    const subscribers = await readSubscribers();
    const alreadyExists = subscribers.some(
      (s) => s.email.toLowerCase() === normalizedEmail,
    );

    if (!alreadyExists) {
      subscribers.push({
        email: normalizedEmail,
        subscribedAt: new Date().toISOString(),
      });
      await writeSubscribers(subscribers);
      logger.info("Newsletter signup", { metadata: { email: normalizedEmail } });
    }

    // Always return success (don't reveal if email already existed)
    return successResponse({ message: "Subscribed successfully" }, 201);
  } catch (err) {
    logger.error("Newsletter signup error", {
      metadata: { error: err instanceof Error ? err.message : "Unknown" },
    });
    return errorResponse("An unexpected error occurred", 500);
  }
}
