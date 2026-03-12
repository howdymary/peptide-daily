import type { VendorFetcher } from "@/types";
import { VerifiedPeptidesFetcher } from "./verified-peptides";
import { PeptidePartnersFetcher } from "./peptide-partners";
import { ParadigmPeptideFetcher } from "./paradigm-peptide";
import { PolarisPeptidesFetcher } from "./polaris-peptides";
import { SkyePeptidesFetcher } from "./skye-peptides";

/**
 * Vendor registry — single source of truth for all vendor fetchers.
 *
 * To add a new vendor:
 *  1. Create a fetcher class extending BaseFetcher in /lib/vendors/
 *  2. Add a ScraperConfig entry in scraper-config.ts
 *  3. Add it to the array below
 *  4. Add a VendorMapping seed entry in prisma/seed.ts
 *  5. Done — the aggregation pipeline picks it up automatically
 */

export const vendorFetchers: VendorFetcher[] = [
  new VerifiedPeptidesFetcher(),
  new PeptidePartnersFetcher(),
  new ParadigmPeptideFetcher(),
  new PolarisPeptidesFetcher(),
  new SkyePeptidesFetcher(),
];

/** Look up a fetcher by vendor name (case-insensitive). */
export function getFetcherByName(name: string): VendorFetcher | undefined {
  return vendorFetchers.find(
    (f) => f.vendorName.toLowerCase() === name.toLowerCase(),
  );
}

/**
 * Look up a fetcher by the scrapingAdapter name stored in VendorMapping.
 * Adapter name convention: the class name of the fetcher.
 * Reuses the existing singleton instances from vendorFetchers.
 */
export function getFetcherByAdapter(adapterName: string): VendorFetcher | undefined {
  return vendorFetchers.find((f) => f.constructor.name === adapterName);
}
