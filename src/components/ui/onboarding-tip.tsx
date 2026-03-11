/**
 * OnboardingTip — collapsible explainer blocks for first-time visitors.
 *
 * Stores the dismissed state in localStorage so it doesn't re-appear.
 * Falls back to always-visible if localStorage is unavailable (SSR).
 *
 * Usage:
 *   <OnboardingTip id="catalog-how-to" title="How to read this table">
 *     <p>The <strong>Grade</strong> column shows Finnrick's A–E letter rating…</p>
 *   </OnboardingTip>
 */

"use client";

import { useState, useEffect, type ReactNode } from "react";

interface OnboardingTipProps {
  /** Unique ID used as localStorage key — change it to re-show the tip */
  id: string;
  title: string;
  children: ReactNode;
  /** If true, show even after dismissal (for contextual always-visible tips) */
  persistent?: boolean;
  className?: string;
}

const STORAGE_KEY_PREFIX = "pp_tip_dismissed:";

export function OnboardingTip({
  id,
  title,
  children,
  persistent = false,
  className = "",
}: OnboardingTipProps) {
  const storageKey = `${STORAGE_KEY_PREFIX}${id}`;
  // Start hidden to avoid SSR mismatch; reveal after hydration
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (persistent) {
      setVisible(true);
      return;
    }
    try {
      const dismissed = localStorage.getItem(storageKey) === "1";
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true); // if localStorage throws (private mode), always show
    }
  }, [storageKey, persistent]);

  function dismiss() {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className={`rounded-xl border border-[var(--brand-sky,#38bdf8)]/30 bg-[#f0f9ff] px-4 py-3 ${className}`}
      style={{ borderColor: "#bae6fd" }}
    >
      {/* Header row */}
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-base" aria-hidden="true">
          💡
        </span>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="flex flex-1 items-center justify-between gap-2 text-left focus-visible:outline-none"
        >
          <span className="text-sm font-semibold" style={{ color: "#0c4a6e" }}>
            {title}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3.5 w-3.5 shrink-0 transition-transform"
            style={{
              color: "#0284c7",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {!persistent && (
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss tip"
            className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 focus-visible:outline-none"
            style={{ color: "#0284c7" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3 w-3"
              aria-hidden="true"
            >
              <path d="M3.22 3.22a.75.75 0 0 1 1.06 0L8 6.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L9.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L8 9.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L6.94 8 3.22 4.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Body */}
      {expanded && (
        <div
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "#075985" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/** Pre-built: explains the Finnrick grade scale */
export function GradeScaleTip({ className = "" }: { className?: string }) {
  return (
    <OnboardingTip id="grade-scale-v1" title="How to read Finnrick grades" className={className}>
      <p>
        Finnrick independently tests peptides from vendors and assigns an{" "}
        <strong>A–E letter grade</strong>:
      </p>
      <ul className="mt-2 space-y-1 pl-4 list-disc">
        <li><strong>A</strong> — Excellent purity and quantity accuracy</li>
        <li><strong>B</strong> — Good, minor deviations within tolerance</li>
        <li><strong>C</strong> — Acceptable, some quality concerns</li>
        <li><strong>D</strong> — Poor results, significant under-dosing or impurities</li>
        <li><strong>E</strong> — Failed — do not use</li>
      </ul>
      <p className="mt-2">
        Grades with fewer than 3 tests are marked <em>limited data</em>.
      </p>
    </OnboardingTip>
  );
}

/** Pre-built: explains the Trust Score */
export function TrustScoreTip({ className = "" }: { className?: string }) {
  return (
    <OnboardingTip id="trust-score-v1" title="What is the Trust Score?" className={className}>
      <p>
        The <strong>Trust Score (0–100)</strong> is PeptidePal&apos;s derived metric.
        It combines three signals:
      </p>
      <ul className="mt-2 space-y-1 pl-4 list-disc">
        <li><strong>50%</strong> — Finnrick lab quality (grade + numeric score)</li>
        <li><strong>30%</strong> — User review ratings (confidence-weighted)</li>
        <li><strong>20%</strong> — Pricing relative to market median</li>
      </ul>
      <p className="mt-2">
        If any component is missing, its weight distributes to the others.
        The Trust Score is <em>not</em> affiliated with Finnrick.
      </p>
    </OnboardingTip>
  );
}

/** Pre-built: catalog page guide */
export function CatalogGuideTip({ className = "" }: { className?: string }) {
  return (
    <OnboardingTip id="catalog-guide-v1" title="How to compare peptides" className={className}>
      <p>
        Use the filters above to narrow by <strong>vendor</strong>,{" "}
        <strong>Finnrick grade</strong>, <strong>price range</strong>, or{" "}
        <strong>availability</strong>. Sort by <em>Trust Score</em> to see the
        highest-confidence options first. Click any peptide to see the full
        vendor comparison table with lab test details.
      </p>
    </OnboardingTip>
  );
}
