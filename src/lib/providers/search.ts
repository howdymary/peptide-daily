/**
 * Provider search and filtering utilities.
 * Builds Prisma where clauses from query parameters.
 */

import { z } from "zod";

export const providerQuerySchema = z.object({
  search: z.string().optional(),
  type: z
    .enum(["clinic", "pharmacy_503a", "pharmacy_503b", "telehealth", "online_vendor"])
    .optional(),
  state: z.string().max(2).optional(),
  telehealth: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  fdaRegistered: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ProviderQuery = z.infer<typeof providerQuerySchema>;

export interface ProviderWhereClause {
  isActive: boolean;
  type?: string;
  state?: string;
  offersTelehealth?: boolean;
  fdaRegistered?: boolean;
  OR?: Array<Record<string, { contains: string; mode: "insensitive" }>>;
}

export function buildProviderWhere(query: ProviderQuery): ProviderWhereClause {
  const where: ProviderWhereClause = { isActive: true };

  if (query.type) {
    where.type = query.type;
  }

  if (query.state) {
    where.state = query.state.toUpperCase();
  }

  if (query.telehealth) {
    where.offersTelehealth = true;
  }

  if (query.fdaRegistered) {
    where.fdaRegistered = true;
  }

  if (query.search) {
    const term = query.search.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { city: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
    ];
  }

  return where;
}

/** Human-readable labels for provider types. */
export const PROVIDER_TYPE_LABELS: Record<string, string> = {
  clinic: "Clinic",
  pharmacy_503a: "503A Pharmacy",
  pharmacy_503b: "503B Outsourcing Facility",
  telehealth: "Telehealth",
  online_vendor: "Online Vendor",
};

/** US state abbreviation list for filter dropdowns. */
export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
] as const;
