/**
 * InfoBanner — dismissible, accessible alert banner.
 *
 * Variants:
 *   info     — blue/sky  (neutral announcements, new data available)
 *   success  — green     (successful imports, confirmations)
 *   warning  — amber     (medical disclaimer, data caveats)
 *   error    — red       (service unavailable, scraping failure)
 *
 * Usage:
 *   <InfoBanner variant="warning" title="Medical disclaimer">
 *     This site provides information only, not medical advice.
 *   </InfoBanner>
 *
 *   <InfoBanner variant="info" icon="🔬" dismissible>
 *     New Finnrick lab data is available for 3 vendors.
 *   </InfoBanner>
 */

"use client";

import { useState, type ReactNode } from "react";

type BannerVariant = "info" | "success" | "warning" | "error";

interface InfoBannerProps {
  variant?: BannerVariant;
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  dismissible?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<
  BannerVariant,
  { bg: string; border: string; iconColor: string; titleColor: string; textColor: string }
> = {
  info: {
    bg: "var(--info-bg)",
    border: "var(--info-border, #99d6d6)",
    iconColor: "var(--info-icon, #0D6E6E)",
    titleColor: "var(--info-title, #0A5858)",
    textColor: "var(--info-text)",
  },
  success: {
    bg: "var(--success-bg, #f0fdf4)",
    border: "var(--success-border, #bbf7d0)",
    iconColor: "var(--success, #16a34a)",
    titleColor: "#14532d",
    textColor: "#166534",
  },
  warning: {
    bg: "var(--warning-bg, #fffbeb)",
    border: "var(--warning-border, #fde68a)",
    iconColor: "var(--warning, #d97706)",
    titleColor: "#78350f",
    textColor: "#92400e",
  },
  error: {
    bg: "var(--error-bg, #fef2f2)",
    border: "var(--error-border, #fecaca)",
    iconColor: "var(--danger, #dc2626)",
    titleColor: "#7f1d1d",
    textColor: "#991b1b",
  },
};

const DEFAULT_ICONS: Record<BannerVariant, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  error: "✕",
};

export function InfoBanner({
  variant = "info",
  title,
  icon,
  children,
  dismissible = false,
  className = "",
}: InfoBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const styles = VARIANT_STYLES[variant];
  const displayIcon = icon ?? DEFAULT_ICONS[variant];

  return (
    <div
      role={variant === "error" || variant === "warning" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm ${className}`}
      style={{
        background: styles.bg,
        borderColor: styles.border,
        color: styles.textColor,
      }}
    >
      {/* Icon */}
      <span
        className="mt-0.5 shrink-0 text-base font-bold leading-none"
        style={{ color: styles.iconColor }}
        aria-hidden="true"
      >
        {displayIcon}
      </span>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold leading-snug" style={{ color: styles.titleColor }}>
            {title}
          </p>
        )}
        <div className={title ? "mt-1" : ""}>{children}</div>
      </div>

      {/* Dismiss button */}
      {dismissible && (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notification"
          className="mt-0.5 shrink-0 rounded p-0.5 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2"
          style={{ color: styles.iconColor, outlineColor: styles.iconColor }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path d="M3.22 3.22a.75.75 0 0 1 1.06 0L8 6.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L9.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L8 9.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L6.94 8 3.22 4.28a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>
      )}
    </div>
  );
}

/** Pre-built variant: medical disclaimer */
export function MedicalDisclaimer({ className = "" }: { className?: string }) {
  return (
    <InfoBanner variant="warning" title="Medical disclaimer" className={className}>
      Peptide Daily is an informational resource only. Peptide research chemicals
      are not approved for human use unless otherwise noted. Nothing on this
      site constitutes medical advice. Always consult a qualified healthcare
      professional before using any peptide or research chemical.
    </InfoBanner>
  );
}

/** Pre-built variant: data freshness notice */
export function DataFreshnessNotice({
  lastUpdated,
  className = "",
}: {
  lastUpdated?: string | null;
  className?: string;
}) {
  if (!lastUpdated) return null;

  const date = new Date(lastUpdated);
  const ageMs = Date.now() - date.getTime();
  const ageMins = Math.floor(ageMs / 60_000);
  const ageHours = Math.floor(ageMs / 3_600_000);
  const ageLabel =
    ageMins < 2
      ? "just now"
      : ageMins < 60
        ? `${ageMins} min ago`
        : ageHours < 24
          ? `${ageHours}h ago`
          : date.toLocaleDateString();

  return (
    <InfoBanner variant="info" className={className}>
      Price data last updated <strong>{ageLabel}</strong>. Prices refresh
      automatically every 15 minutes.
    </InfoBanner>
  );
}
