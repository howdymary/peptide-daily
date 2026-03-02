import { auth } from "./config";
import { errorResponse } from "@/lib/utils/api-response";
import type { UserRole } from "@/types";

/**
 * Helper to require authentication in API route handlers.
 * Returns the session or an error response.
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    return { session: null, error: errorResponse("Authentication required", 401) };
  }

  return { session, error: null };
}

/**
 * Helper to require a specific role.
 */
export async function requireRole(role: UserRole) {
  const { session, error } = await requireAuth();

  if (error) return { session: null, error };

  if (session!.user.role !== role) {
    return {
      session: null,
      error: errorResponse("Insufficient permissions", 403),
    };
  }

  return { session, error: null };
}
