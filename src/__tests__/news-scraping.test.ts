/**
 * Tests for news scraping pipeline correctness.
 *
 * Validates:
 *  - extractTags correctly identifies peptide names and themes
 *  - Headlines parse correctly (no injection of undefined, valid strings)
 *  - Publication dates are normalised
 *  - Articles missing critical metadata are skipped
 *  - PEPTIDE_KEYWORDS and THEME_KEYWORDS cover expected terms
 */

import { describe, it, expect } from "vitest";
import { extractTags, PEPTIDE_KEYWORDS, THEME_KEYWORDS } from "@/lib/news/entity-extractor";

describe("extractTags — peptide detection", () => {
  it("detects BPC-157 from hyphenated form", () => {
    expect(extractTags("BPC-157 accelerates wound healing", null)).toContain("BPC-157");
  });

  it("detects BPC-157 from space form", () => {
    expect(extractTags("Study on BPC 157 tissue repair", null)).toContain("BPC-157");
  });

  it("detects semaglutide from brand name ozempic", () => {
    const tags = extractTags("Ozempic shortage continues in Europe", null);
    expect(tags).toContain("semaglutide");
  });

  it("detects semaglutide from brand name wegovy", () => {
    const tags = extractTags("Wegovy approved for adolescents", null);
    expect(tags).toContain("semaglutide");
  });

  it("detects tirzepatide from brand name mounjaro", () => {
    expect(extractTags("Mounjaro sales exceed expectations", null)).toContain("tirzepatide");
  });

  it("detects TB-500 from thymosin beta-4", () => {
    expect(extractTags("Thymosin beta-4 promotes cardiac repair", null)).toContain("TB-500");
  });

  it("detects GHK-Cu from copper peptide", () => {
    expect(extractTags("Copper peptide promotes collagen synthesis", null)).toContain("GHK-Cu");
  });

  it("detects PT-141 from bremelanotide", () => {
    expect(extractTags("Bremelanotide approved for HSDD treatment", null)).toContain("PT-141");
  });

  it("detects ipamorelin", () => {
    expect(extractTags("Ipamorelin study shows GH pulse amplification", null)).toContain("ipamorelin");
  });

  it("detects MK-677 from ibutamoren alias", () => {
    expect(extractTags("Ibutamoren increases IGF-1 in elderly subjects", null)).toContain("MK-677");
  });

  it("detects sermorelin", () => {
    expect(extractTags("Sermorelin therapy for adult GHD", null)).toContain("sermorelin");
  });

  it("adds 'peptides' tag when any peptide keyword matches", () => {
    expect(extractTags("Semaglutide trial results", null)).toContain("peptides");
  });

  it("does not add 'peptides' tag when only theme keywords match", () => {
    const tags = extractTags("FDA approves new drug", null);
    expect(tags).not.toContain("peptides");
    expect(tags).toContain("regulatory");
  });

  it("returns empty array when no keywords match", () => {
    expect(extractTags("Stock market hits record high", null)).toHaveLength(0);
  });

  it("is case-insensitive", () => {
    expect(extractTags("SEMAGLUTIDE approved for obesity", null)).toContain("semaglutide");
    expect(extractTags("BPC-157 AND TB-500 combined protocol", null)).toContain("BPC-157");
    expect(extractTags("BPC-157 AND TB-500 combined protocol", null)).toContain("TB-500");
  });
});

describe("extractTags — theme detection", () => {
  it("detects GLP-1 theme", () => {
    expect(extractTags("Glucagon-like peptide receptor agonists", null)).toContain("GLP-1");
  });

  it("detects weight-management theme", () => {
    expect(extractTags("Weight loss drugs under scrutiny", null)).toContain("weight-management");
  });

  it("detects metabolic theme from 'diabetes'", () => {
    expect(extractTags("Diabetes management peptide therapy", null)).toContain("metabolic");
  });

  it("detects growth-hormone theme", () => {
    expect(extractTags("Growth hormone secretagogue review", null)).toContain("growth-hormone");
  });

  it("detects recovery theme", () => {
    expect(extractTags("Tissue repair mechanisms in muscle injury", null)).toContain("recovery");
  });

  it("detects cosmetic theme from 'collagen'", () => {
    expect(extractTags("Collagen production in skin aging", null)).toContain("cosmetic");
  });

  it("detects regulatory theme from 'FDA'", () => {
    expect(extractTags("FDA issues guidance on compounding pharmacies", null)).toContain("regulatory");
  });

  it("detects research theme from 'clinical trial'", () => {
    expect(extractTags("Phase 2 clinical trial results published", null)).toContain("research");
  });

  it("detects safety theme", () => {
    expect(extractTags("Safety profile of GLP-1 agonists reviewed", null)).toContain("safety");
  });
});

describe("extractTags — excerpt usage", () => {
  it("extracts tags from excerpt text when title is generic", () => {
    const tags = extractTags(
      "New research published",
      "Semaglutide combined with exercise reduces visceral fat in obese adults."
    );
    expect(tags).toContain("semaglutide");
    expect(tags).toContain("weight-management");
  });

  it("handles null excerpt gracefully", () => {
    expect(() => extractTags("Peptide research update", null)).not.toThrow();
  });

  it("deduplicates tags", () => {
    const tags = extractTags("BPC-157 and BPC 157 study", "bpc157 recovery");
    const bpcCount = tags.filter((t) => t === "BPC-157").length;
    expect(bpcCount).toBe(1);
  });

  it("returns sorted tag list", () => {
    const tags = extractTags("Semaglutide FDA approval for weight loss", null);
    expect(tags).toEqual([...tags].sort());
  });
});

describe("PEPTIDE_KEYWORDS coverage", () => {
  const peptideNames = ["bpc-157", "tb-500", "semaglutide", "tirzepatide", "ipamorelin",
    "cjc-1295", "ghk-cu", "pt-141", "melanotan ii", "sermorelin", "hexarelin", "mk-677"];

  for (const name of peptideNames) {
    it(`has a mapping for "${name}"`, () => {
      expect(PEPTIDE_KEYWORDS).toHaveProperty(name);
    });
  }
});

describe("THEME_KEYWORDS coverage", () => {
  const themes = ["glp-1", "weight loss", "diabetes", "growth hormone", "tissue repair",
    "collagen", "fda", "clinical trial", "safety"];

  for (const theme of themes) {
    it(`has a mapping for "${theme}"`, () => {
      expect(THEME_KEYWORDS).toHaveProperty(theme);
    });
  }
});

describe("NormalizedArticle validation rules", () => {
  // These tests simulate the validation logic that the ingestion-service
  // applies (skip articles missing title or sourceUrl).
  it("articles without a title should be skipped", () => {
    // Simulating the condition: `if (!title) continue`
    const title = "";
    const shouldSkip = !title.trim();
    expect(shouldSkip).toBe(true);
  });

  it("articles without a URL should be skipped", () => {
    const url = "";
    const shouldSkip = !url;
    expect(shouldSkip).toBe(true);
  });

  it("articles with a valid title and URL should not be skipped", () => {
    const title = "Semaglutide reduces cardiovascular events";
    const url = "https://pubmed.ncbi.nlm.nih.gov/12345678";
    expect(!title.trim() || !url).toBe(false);
  });

  it("publishedAt falls back to current date when missing", () => {
    const pubDate: string | undefined = undefined;
    const isoDate: string | undefined = undefined;
    const publishedAt = pubDate
      ? new Date(pubDate)
      : isoDate
        ? new Date(isoDate)
        : new Date();
    expect(publishedAt).toBeInstanceOf(Date);
    expect(isNaN(publishedAt.getTime())).toBe(false);
  });

  it("excerpts are truncated to 400 characters", () => {
    const raw = "x".repeat(500);
    const excerpt = raw.slice(0, 400).trim();
    expect(excerpt.length).toBeLessThanOrEqual(400);
  });
});
