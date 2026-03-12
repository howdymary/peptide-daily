import Link from "next/link";

export interface GuideData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingTime: number;
  order?: number;
}

interface GuideCardProps {
  guide: GuideData;
  /** Compact sidebar style (no excerpt) */
  compact?: boolean;
}

const CATEGORY_STYLES: Record<string, { accent: string; bg: string; text: string }> = {
  "Getting Started": { accent: "#0570b0", bg: "#f0f9ff", text: "#0284c7" },
  "Research Basics":  { accent: "#0d9488", bg: "#f0fdfa", text: "#0d9488" },
  "Peptide Profiles": { accent: "#7c3aed", bg: "#fdf4ff", text: "#9333ea" },
  "Lab Testing":      { accent: "#c2410c", bg: "#fff7ed", text: "#c2410c" },
  "Safety":           { accent: "#dc2626", bg: "#fef2f2", text: "#dc2626" },
};

function getStyle(cat: string) {
  return CATEGORY_STYLES[cat] ?? {
    accent: "var(--brand-gold)",
    bg: "var(--surface-raised)",
    text: "var(--brand-gold)",
  };
}

export function GuideCard({ guide, compact = false }: GuideCardProps) {
  const { accent, bg, text } = getStyle(guide.category);

  if (compact) {
    return (
      <Link
        href={`/guides/${guide.slug}`}
        className="group flex items-start gap-3 rounded-lg border p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface)",
          textDecoration: "none",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background =
            "var(--surface-raised)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "var(--surface)")
        }
      >
        {/* Category pip */}
        <span
          className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
          style={{ background: accent }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-medium leading-snug transition-colors group-hover:text-[var(--accent)] line-clamp-2"
            style={{ color: "var(--foreground)" }}
          >
            {guide.title}
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
            {guide.category} · {guide.readingTime} min
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col rounded-xl border overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        borderColor: "var(--card-border)",
        background: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
        textDecoration: "none",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "var(--card-shadow-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow)";
      }}
    >
      {/* Category accent bar */}
      <div className="h-1 shrink-0" style={{ background: accent }} />

      <div className="flex flex-1 flex-col p-5">
        {/* Category pill */}
        <span
          className="mb-3 inline-block self-start rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ background: bg, color: text }}
        >
          {guide.category}
        </span>

        <h3
          className="flex-1 text-sm font-semibold leading-snug transition-colors group-hover:text-[var(--accent)]"
          style={{ color: "var(--foreground)" }}
        >
          {guide.title}
        </h3>

        <p
          className="mt-2 line-clamp-2 text-xs leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {guide.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--muted-light)" }}>
            {guide.readingTime} min read
          </span>
          <span
            className="text-xs font-semibold transition-colors group-hover:text-[var(--accent)]"
            style={{ color: "var(--accent)" }}
          >
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}
