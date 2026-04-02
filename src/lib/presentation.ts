export type SiteCategory =
  | "glp-1"
  | "recovery"
  | "cosmetic"
  | "growth"
  | "regulatory"
  | "research"
  | "basics"
  | "ratings"
  | "vendors"
  | "safety"
  | "other";

export function normalizeCategory(input?: string | null): SiteCategory {
  const value = (input ?? "").trim().toLowerCase();

  if (!value) return "other";
  if (value.includes("glp") || value.includes("metabolic")) return "glp-1";
  if (value.includes("recover") || value.includes("repair") || value.includes("tissue")) {
    return "recovery";
  }
  if (value.includes("cosmetic") || value.includes("skin") || value.includes("beauty")) {
    return "cosmetic";
  }
  if (value.includes("growth")) return "growth";
  if (value.includes("regulat") || value.includes("fda")) return "regulatory";
  if (value.includes("research")) return "research";
  if (value.includes("basic")) return "basics";
  if (value.includes("rating")) return "ratings";
  if (value.includes("vendor")) return "vendors";
  if (value.includes("safety")) return "safety";

  return "other";
}

export function getCategoryMeta(category?: string | null) {
  const normalized = normalizeCategory(category);

  const map: Record<SiteCategory, { label: string; token: string }> = {
    "glp-1": { label: "GLP-1", token: "var(--cat-glp1)" },
    recovery: { label: "Recovery", token: "var(--cat-recovery)" },
    cosmetic: { label: "Cosmetic", token: "var(--cat-cosmetic)" },
    growth: { label: "Growth", token: "var(--cat-growth)" },
    regulatory: { label: "Regulatory", token: "var(--cat-regulatory)" },
    research: { label: "Research", token: "var(--text-secondary)" },
    basics: { label: "Basics", token: "var(--text-secondary)" },
    ratings: { label: "Ratings", token: "var(--info)" },
    vendors: { label: "Vendors", token: "var(--accent-primary)" },
    safety: { label: "Safety", token: "var(--warning)" },
    other: { label: "Research", token: "var(--text-secondary)" },
  };

  return map[normalized];
}

export function getSourceMeta(source?: string | null) {
  const value = (source ?? "").toLowerCase();

  if (value.includes("pubmed")) {
    return {
      label: "PubMed",
      color: "var(--info)",
      background: "rgba(37, 99, 235, 0.08)",
      border: "rgba(37, 99, 235, 0.18)",
    };
  }

  if (value.includes("fda")) {
    return {
      label: "FDA",
      color: "var(--warning)",
      background: "rgba(217, 119, 6, 0.08)",
      border: "rgba(217, 119, 6, 0.18)",
    };
  }

  if (value.includes("nih")) {
    return {
      label: "NIH",
      color: "var(--accent-primary)",
      background: "rgba(22, 163, 74, 0.08)",
      border: "rgba(22, 163, 74, 0.18)",
    };
  }

  if (value.includes("science")) {
    return {
      label: "Science Daily",
      color: "var(--text-secondary)",
      background: "rgba(87, 83, 78, 0.06)",
      border: "rgba(87, 83, 78, 0.16)",
    };
  }

  if (value.includes("eurekalert")) {
    return {
      label: "EurekAlert",
      color: "var(--text-secondary)",
      background: "rgba(87, 83, 78, 0.06)",
      border: "rgba(87, 83, 78, 0.16)",
    };
  }

  return {
    label: source ?? "Source",
    color: "var(--text-secondary)",
    background: "rgba(87, 83, 78, 0.06)",
    border: "rgba(87, 83, 78, 0.16)",
  };
}

export function formatCurrency(amount?: number | null, currency = "USD") {
  if (amount == null || Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatAbsoluteDate(
  date?: string | Date | null,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" },
) {
  if (!date) return "Unknown";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", options).format(value);
}

export function formatRelativeTime(date?: string | Date | null, now = Date.now()) {
  if (!date) return "Unknown";

  const value = typeof date === "string" ? new Date(date).getTime() : date.getTime();
  const diffMs = now - value;
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return formatAbsoluteDate(new Date(value));
}

export function formatMonthYear(date?: string | Date | null) {
  return formatAbsoluteDate(date, { month: "short", year: "numeric" });
}
