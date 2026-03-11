import Link from "next/link";

export interface GuideData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingTime: number;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "Getting Started": { bg: "#f0f9ff", text: "#0284c7" },
  "Research Basics":  { bg: "#f0fdfa", text: "#0d9488" },
  "Peptide Profiles": { bg: "#fdf4ff", text: "#9333ea" },
  "Lab Testing":      { bg: "#fff7ed", text: "#c2410c" },
  "Safety":           { bg: "#fef2f2", text: "#dc2626" },
};

function defaultColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? { bg: "var(--surface-raised)", text: "var(--accent)" };
}

export function GuideCard({ guide }: { guide: GuideData }) {
  const { bg, text } = defaultColor(guide.category);

  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{ boxShadow: "var(--card-shadow)", textDecoration: "none" }}
    >
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
          className="text-xs font-medium transition-colors group-hover:text-[var(--accent)]"
          style={{ color: "var(--accent)" }}
        >
          Read →
        </span>
      </div>
    </Link>
  );
}
