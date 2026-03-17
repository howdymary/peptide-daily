/**
 * LearnInlineBlock — small contextual "Learn" callout rendered on news pages,
 * peptide comparison pages, and vendor detail pages.
 *
 * Shows a 1–2 line shortSummary from the educational guide and links to the
 * full explainer. Works in both sidebar and inline layouts.
 */

import Link from "next/link";
import { getPeptideGuide } from "@/lib/learn/content-service";

interface LearnInlineBlockProps {
  /** Peptide slug matching the guide (e.g. "semaglutide") */
  peptideSlug: string;
  /** Layout variant */
  variant?: "sidebar" | "inline" | "compact";
  className?: string;
}

export function LearnInlineBlock({
  peptideSlug,
  variant = "inline",
  className = "",
}: LearnInlineBlockProps) {
  const guide = getPeptideGuide(peptideSlug);
  if (!guide) return null;

  if (variant === "compact") {
    return (
      <Link
        href={`/learn/${guide.slug}`}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--surface-raised)] ${className}`}
        style={{
          borderColor: "var(--border)",
          color: "var(--accent)",
          background: "var(--surface)",
        }}
      >
        <BookIcon />
        Learn about {guide.name}
      </Link>
    );
  }

  if (variant === "sidebar") {
    return (
      <aside
        className={`rounded-xl border p-4 ${className}`}
        style={{
          background: "var(--surface-raised)",
          borderColor: "var(--card-border)",
        }}
      >
        <p
          className="mb-2 text-xs font-bold uppercase tracking-wider"
          style={{ color: "var(--brand-gold)" }}
        >
          Learn
        </p>
        <p
          className="mb-1 text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {guide.name}
        </p>
        <p
          className="mb-3 text-xs leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {guide.shortSummary}
        </p>
        <Link
          href={`/learn/${guide.slug}`}
          className="text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: "var(--accent)" }}
        >
          Read the full explainer →
        </Link>
      </aside>
    );
  }

  // Default: inline
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 ${className}`}
      style={{
        background: "var(--info-bg)",
        borderColor: "var(--info-border)",
      }}
    >
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ background: "var(--brand-navy)", color: "#fff" }}
        aria-hidden="true"
      >
        <BookIcon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p
          className="mb-0.5 text-xs font-bold uppercase tracking-wider"
          style={{ color: "var(--info-text)" }}
        >
          Educational overview — {guide.name}
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--info-text)", opacity: 0.85 }}
        >
          {guide.shortSummary}
        </p>
        <Link
          href={`/learn/${guide.slug}`}
          className="mt-1.5 inline-block text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "var(--accent)" }}
        >
          Read the full explainer on {guide.name} →
        </Link>
      </div>
    </div>
  );
}

function BookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}
