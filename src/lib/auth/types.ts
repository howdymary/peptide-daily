import type { UserRole } from "@/types";
import type { DefaultSession } from "next-auth";

/**
 * Extend NextAuth's built-in types to include our custom fields.
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
