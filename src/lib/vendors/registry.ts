import type { VendorFetcher } from "@/types";
import { VerifiedPeptidesFetcher } from "./verified-peptides";
import { PeptidePartnersFetcher } from "./peptide-partners";

/**
 * Vendor registry — single source of truth for all vendor fetchers.
 *
 * To add a new vendor:
 *  1. Create a fetcher class extending BaseFetcher
 *  2. Add it to this array
 *  3. Done — the aggregation pipeline picks it up automatically
 */

export const vendorFetchers: VendorFetcher[] = [
  new VerifiedPeptidesFetcher(),
  new PeptidePartnersFetcher(),
];

export function getFetcherByName(name: string): VendorFetcher | undefined {
  return vendorFetchers.find(
    (f) => f.vendorName.toLowerCase() === name.toLowerCase(),
  );
}
