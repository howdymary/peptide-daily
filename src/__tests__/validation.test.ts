/**
 * Tests for input validation schemas — focusing on security-relevant boundaries.
 *
 * Verifies:
 *  - HTML injection is stripped by sanitize-html
 *  - Password complexity is enforced
 *  - Page size caps are respected
 *  - Edge cases return proper error messages
 */

import { describe, it, expect } from "vitest";
import {
  createReviewSchema,
  signUpSchema,
  signInSchema,
  peptideQuerySchema,
  finnrickImportSchema,
} from "@/lib/validation/schemas";

// ── Review schema ─────────────────────────────────────────────────────────────

describe("createReviewSchema", () => {
  it("accepts a valid review", () => {
    const result = createReviewSchema.safeParse({
      peptideId: "cjld2cjxh0000qzrmn831i7rn", // valid cuid
      rating: 4,
      title: "Great product",
      body: "I have been using this for 3 months and noticed positive effects.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects rating out of range", () => {
    const result = createReviewSchema.safeParse({
      peptideId: "cjld2cjxh0000qzrmn831i7rn",
      rating: 6,
      title: "Nice",
      body: "Very good peptide with excellent results over time.",
    });
    expect(result.success).toBe(false);
  });

  it("strips HTML tags from title", () => {
    const result = createReviewSchema.safeParse({
      peptideId: "cjld2cjxh0000qzrmn831i7rn",
      rating: 3,
      title: "<script>alert('xss')</script>Good product",
      body: "Body text that is at least twenty characters long.",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).not.toContain("<script>");
      expect(result.data.title).toContain("Good product");
    }
  });

  it("strips HTML tags from body", () => {
    const result = createReviewSchema.safeParse({
      peptideId: "cjld2cjxh0000qzrmn831i7rn",
      rating: 3,
      title: "Clean title",
      body: '<img src=x onerror=alert(1)>This is a long enough body for the review to pass validation checks.',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body).not.toContain("<img");
      expect(result.data.body).not.toContain("onerror");
    }
  });

  it("rejects body that is too short", () => {
    const result = createReviewSchema.safeParse({
      peptideId: "cjld2cjxh0000qzrmn831i7rn",
      rating: 3,
      title: "Short review",
      body: "Too short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid CUID for peptideId", () => {
    const result = createReviewSchema.safeParse({
      peptideId: "not-a-cuid",
      rating: 3,
      title: "Valid title",
      body: "This is a body that is definitely long enough to pass validation checks.",
    });
    expect(result.success).toBe(false);
  });
});

// ── Sign-up schema ────────────────────────────────────────────────────────────

describe("signUpSchema", () => {
  it("accepts a valid signup", () => {
    const result = signUpSchema.safeParse({
      name: "Alice Smith",
      email: "alice@example.com",
      password: "Passw0rd123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects password without uppercase", () => {
    const result = signUpSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without digit", () => {
    const result = signUpSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "PasswordOnly",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password that is too short", () => {
    const result = signUpSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "Ab1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = signUpSchema.safeParse({
      name: "Alice",
      email: "not-an-email",
      password: "Passw0rd123",
    });
    expect(result.success).toBe(false);
  });

  it("strips HTML from name", () => {
    const result = signUpSchema.safeParse({
      name: "<b>Alice</b>",
      email: "alice@example.com",
      password: "Passw0rd123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Alice");
    }
  });

  it("rejects name that is too short", () => {
    const result = signUpSchema.safeParse({
      name: "A",
      email: "alice@example.com",
      password: "Passw0rd123",
    });
    expect(result.success).toBe(false);
  });
});

// ── Peptide query schema ──────────────────────────────────────────────────────

describe("peptideQuerySchema", () => {
  it("accepts valid query params", () => {
    const result = peptideQuerySchema.safeParse({
      search: "bpc-157",
      sortBy: "trust_score",
      page: "2",
      pageSize: "20",
    });
    expect(result.success).toBe(true);
  });

  it("enforces pageSize maximum of 50", () => {
    const result = peptideQuerySchema.safeParse({ pageSize: "200" });
    expect(result.success).toBe(false);
  });

  it("defaults page to 1 and pageSize to 20", () => {
    const result = peptideQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.pageSize).toBe(20);
    }
  });

  it("rejects negative page", () => {
    const result = peptideQuerySchema.safeParse({ page: "-1" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid sortBy value", () => {
    const result = peptideQuerySchema.safeParse({ sortBy: "malicious_order_by" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid finnrickGrade", () => {
    const result = peptideQuerySchema.safeParse({ finnrickGrade: "Z" });
    expect(result.success).toBe(false);
  });

  it("caps search string length at 200", () => {
    const longSearch = "a".repeat(201);
    const result = peptideQuerySchema.safeParse({ search: longSearch });
    expect(result.success).toBe(false);
  });
});

// ── Finnrick import schema ────────────────────────────────────────────────────

describe("finnrickImportSchema", () => {
  it("accepts valid JSON import", () => {
    const result = finnrickImportSchema.safeParse({
      format: "json",
      content: '{"ratings":[],"tests":[]}',
      filename: "test.json",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty content", () => {
    const result = finnrickImportSchema.safeParse({
      format: "json",
      content: "",
      filename: "test.json",
    });
    expect(result.success).toBe(false);
  });

  it("rejects content exceeding 5 MB", () => {
    const bigContent = "x".repeat(5 * 1024 * 1024 + 1);
    const result = finnrickImportSchema.safeParse({
      format: "json",
      content: bigContent,
      filename: "big.json",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid format enum", () => {
    const result = finnrickImportSchema.safeParse({
      format: "xlsx",
      content: "some content",
      filename: "data.xlsx",
    });
    expect(result.success).toBe(false);
  });
});
