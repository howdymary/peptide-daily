import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { signUpSchema } from "@/lib/validation/schemas";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { withRateLimit } from "@/lib/security/rate-limit";
import { logger } from "@/lib/utils/logger";

/**
 * POST /api/auth/signup
 * Register a new user with email/password.
 * Rate limited: 5 attempts per minute per IP.
 */
export async function POST(req: NextRequest) {
  // Rate limit — strict for signup
  const rateLimited = await withRateLimit(req, {
    max: 5,
    windowSeconds: 60,
    keyPrefix: "rl:signup",
  });
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues.map((i) => i.message).join(", "),
        422,
      );
    }

    const { name, email, password } = parsed.data;

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return errorResponse("An account with this email already exists", 409);
    }

    // Hash password with bcrypt (cost factor 12)
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    logger.audit("user_signup", user.id, { method: "credentials" });

    return successResponse(
      { message: "Account created successfully", user },
      201,
    );
  } catch (err) {
    logger.error("Signup error", {
      metadata: { error: err instanceof Error ? err.message : "Unknown" },
    });
    return errorResponse("An unexpected error occurred", 500);
  }
}
