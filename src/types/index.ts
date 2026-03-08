/**
 * Shared type definitions used across the application.
 */

// ── Vendor fetcher types ────────────────────────────────────────────────────

export interface VendorPeptideData {
  vendorName: string;
  peptideName: string;
  concentration: string;
  price: number;
  currency: string;
  sku: string;
  productUrl: string;
  availabilityStatus: "in_stock" | "out_of_stock" | "pre_order";
  lastUpdated: Date;
}

export interface VendorFetcher {
  vendorName: string;
  fetchAll(): Promise<VendorPeptideData[]>;
}

// ── API response types ──────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// ── Filter / query types ────────────────────────────────────────────────────

export interface PeptideFilters {
  search?: string;
  vendor?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: "in_stock" | "out_of_stock" | "pre_order";
  finnrickGrade?: FinnrickGrade;
  minFinnrickScore?: number;
  sortBy?:
    | "name"
    | "price_asc"
    | "price_desc"
    | "rating"
    | "finnrick_rating"
    | "trust_score";
  page?: number;
  pageSize?: number;
}

// ── Review types ────────────────────────────────────────────────────────────

export interface ReviewInput {
  peptideId: string;
  rating: number;
  title: string;
  body: string;
}

// ── Auth types ──────────────────────────────────────────────────────────────

export type UserRole = "USER" | "ADMIN";

// ── Finnrick types ──────────────────────────────────────────────────────────

/** Letter grade assigned by Finnrick per vendor+peptide pair. */
export type FinnrickGrade = "A" | "B" | "C" | "D" | "E";

/** Aggregate Finnrick rating for a vendor+peptide pair. Raw Finnrick values. */
export interface FinnrickRatingItem {
  grade: FinnrickGrade;
  averageScore: number;
  testCount: number;
  minScore: number;
  maxScore: number;
  oldestTestDate: string;
  newestTestDate: string;
  finnrickUrl: string | null;
}

/** Individual Finnrick lab test result. */
export interface FinnrickTestItem {
  id: string;
  testDate: string;
  testScore: number;
  advertisedQuantity: number;
  actualQuantity: number;
  quantityVariance: number;
  purity: number;
  batchId: string;
  containerType: string;
  labId: string;
  source: string;
  endotoxinsStatus: string | null;
  certificateLink: string | null;
  identityResult: string;
}

/**
 * Combined trust score derived from Finnrick + reviews + pricing signals.
 * This is OUR derived metric — never presented as Finnrick's own rating.
 */
export interface TrustScore {
  /** 0–100 overall weighted score */
  overall: number;
  /** Finnrick-derived component (null when no Finnrick data) */
  finnrickScore: number | null;
  /** Review-derived component (null when no reviews) */
  reviewScore: number | null;
  /** Pricing signal component */
  pricingScore: number | null;
  breakdown: {
    finnrickWeight: number;
    reviewWeight: number;
    pricingWeight: number;
  };
}

/** Admin-facing vendor mapping configuration. */
export interface VendorMappingConfig {
  id: string;
  vendorId: string;
  vendorName: string;
  finnrickSlug: string;
  vendorDomain: string | null;
  scrapingEnabled: boolean;
  scrapingAdapter: string | null;
  rateLimit: number;
  notes: string | null;
}

// ── Peptide display types ───────────────────────────────────────────────────

export interface PeptideListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  averageRating: number;
  reviewCount: number;
  bestPrice: number | null;
  bestPriceVendor: string | null;
  priceCount: number;
  /** Best Finnrick grade across all vendors offering this peptide (null if none) */
  bestFinnrickGrade: FinnrickGrade | null;
  /** Trust score for the best-priced vendor (null if insufficient data) */
  trustScore: TrustScore | null;
}

export interface PeptideDetail extends PeptideListItem {
  prices: PeptidePriceItem[];
  reviews: ReviewItem[];
  /** Finnrick ratings keyed by vendor slug */
  finnrickRatings: Record<string, FinnrickRatingItem>;
}

export interface PeptidePriceItem {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  price: number;
  currency: string;
  concentration: string;
  sku: string;
  productUrl: string;
  availabilityStatus: string;
  lastUpdated: Date;
  /** Finnrick rating for this vendor+peptide (null if not available) */
  finnrickRating: FinnrickRatingItem | null;
  /** PeptidePal-derived trust score (null if insufficient data) */
  trustScore: TrustScore | null;
}

export interface ReviewItem {
  id: string;
  rating: number;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}
