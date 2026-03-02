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
  sortBy?: "name" | "price_asc" | "price_desc" | "rating";
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
}

export interface PeptideDetail extends PeptideListItem {
  prices: PeptidePriceItem[];
  reviews: ReviewItem[];
}

export interface PeptidePriceItem {
  id: string;
  vendorName: string;
  price: number;
  currency: string;
  concentration: string;
  sku: string;
  productUrl: string;
  availabilityStatus: string;
  lastUpdated: Date;
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
