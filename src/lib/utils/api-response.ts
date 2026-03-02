import { NextResponse } from "next/server";
import type { PaginatedResponse, ApiError } from "@/types";

/**
 * Standardized API response helpers.
 * Never leak stack traces or internal details to clients.
 */

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  totalCount: number,
): NextResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(totalCount / pageSize);

  return NextResponse.json({
    data,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
}

export function errorResponse(
  message: string,
  statusCode: number,
  error?: string,
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: error || httpStatusText(statusCode),
      message,
      statusCode,
    },
    { status: statusCode },
  );
}

function httpStatusText(status: number): string {
  const map: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
  };
  return map[status] || "Error";
}
