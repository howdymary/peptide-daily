/**
 * SafetyNotice — centralized safety / disclaimer block.
 *
 * Replaces ad-hoc disclaimer paragraphs across news pages, peptide detail
 * screens, comparison tables, and onboarding flows with a single reusable
 * component. Content is drawn from the guide's "Safety Information" section.
 *
 * Variants:
 *   "banner"  — full-width info bar (used at page level)
 *   "card"    — rounded card, suitable in sidebars or section footers
 *   "inline"  — minimal 1-line reminder, for tight spaces
 */

import Link from "next/link";

interface SafetyNoticeProps {
  variant?: "banner" | "card" | "inline";
  className?: string;
  /** Show a link to the full safety guide section */
  showLearnMoreLink?: boolean;
}

export function SafetyNotice({
  variant = "banner",
  className = "",
  showLearnMoreLink = true,
}: SafetyNoticeProps) {
  if (variant === "inline") {
    return (
      <p
        className={`text-xs leading-relaxed ${className}`}
        style={{ color: "var(--muted)" }}
      >
        <strong>Educational content only.</strong> Not medical advice. Consult a
        qualified healthcare professional before making any treatment decisions.{" "}
        {showLearnMoreLink && (
          <Link
            href="/learn"
            className="underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            Learn about peptide safety →
          </Link>
        )}
      </p>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`rounded-xl border p-5 ${className}`}
        style={{
          background: "var(--warning-bg)",
          borderColor: "var(--warning-border)",
        }}
      >
        <div className="flex items-start gap-3">
          <WarningIcon className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p
              className="mb-1 text-sm font-semibold"
              style={{ color: "var(--warning)" }}
            >
              Educational content only — not medical advice
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--warning)", opacity: 0.85 }}
            >
              Peptide research spans FDA-approved medications with robust clinical
              data to investigational compounds with limited human evidence. Always
              consult a licensed healthcare professional before making decisions
              related to any peptide or medication. Regulatory status and
              availability vary by country.
            </p>
            {showLearnMoreLink && (
              <Link
                href="/learn"
                className="mt-2 inline-block text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
                style={{ color: "var(--warning)" }}
              >
                Learn about safety &amp; regulation →
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: banner
  return (
    <div
      className={`border-b py-3 ${className}`}
      style={{
        background: "var(--info-bg)",
        borderColor: "var(--info-border)",
      }}
    >
      <div className="container-page">
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--info-text)" }}
        >
          <strong>Educational content only.</strong> The information on this page
          is for educational purposes only and does not constitute medical advice,
          diagnosis, or treatment recommendations. Always consult a qualified
          healthcare professional before making decisions about any medication or
          health intervention. Regulations and product availability vary by country
          and jurisdiction.{" "}
          {showLearnMoreLink && (
            <Link
              href="/learn"
              className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
              style={{ color: "var(--accent)" }}
            >
              Learn about peptide safety &amp; regulation →
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}

function WarningIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ color: "var(--warning)" }}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}
