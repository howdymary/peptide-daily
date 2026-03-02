import type { VendorFetcher, VendorPeptideData } from "@/types";
import { logger } from "@/lib/utils/logger";

/**
 * Abstract base for vendor-specific fetchers.
 * Each vendor implements fetchAll() to pull their catalog.
 *
 * This base class provides:
 *  - Error handling and logging
 *  - Retry logic with exponential backoff
 *  - A standard interface so new vendors can be added trivially
 *
 * To add a new vendor:
 *  1. Create a new file in /lib/vendors/
 *  2. Extend BaseFetcher
 *  3. Implement fetchAll()
 *  4. Register it in the vendor registry
 */

export abstract class BaseFetcher implements VendorFetcher {
  abstract vendorName: string;
  abstract fetchAll(): Promise<VendorPeptideData[]>;

  protected async fetchWithRetry(
    url: string,
    maxRetries = 3,
  ): Promise<Response> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent": "PeptidePal-Aggregator/1.0",
            Accept: "text/html,application/json",
          },
          signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          logger.warn(
            `[${this.vendorName}] Fetch attempt ${attempt + 1} failed, retrying in ${delay}ms`,
            { metadata: { url, error: lastError.message } },
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}
