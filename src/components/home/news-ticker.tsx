"use client";

/**
 * NewsTickerBanner — Horizontally scrolling topline news/price ticker.
 *
 * TECH_NOTES — How the moving headline works:
 *  - Props: `items` array of { text, href?, type } passed from the server component.
 *  - Items are typically the 8 most recent article titles + 2–3 price insight messages.
 *  - Animation: CSS `@keyframes ticker-scroll` (defined in globals.css / inline style).
 *  - Accessibility: `prefers-reduced-motion` → switches to a fade-cycle carousel.
 *  - Pausable: animation-play-state toggles to "paused" on hover or focus.
 *  - Dismissible: user can click ✕; dismissed state stored in sessionStorage so
 *    it resets on the next page load / new session.
 *  - Duplicates the item list to create a seamless loop.
 *
 * To adjust behavior:
 *  - Speed: change `animationDuration` (seconds) below.
 *  - Item count: pass more/fewer items from the server component.
 *  - Style: edit the wrapper className / colors below.
 */

import { useEffect, useRef, useState } from "react";

export interface TickerItem {
  text: string;
  href?: string;
  /** Visual accent: "news" = sky blue dot, "price" = teal dot */
  type: "news" | "price";
}

interface NewsTickerBannerProps {
  items: TickerItem[];
}

const DISMISS_KEY = "peptidedaily:ticker-dismissed";

export function NewsTickerBanner({ items }: NewsTickerBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);
  // prefers-reduced-motion → fade carousel instead of scroll
  const [reducedMotion, setReducedMotion] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Carousel auto-advance (reduced-motion mode)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    const syncTimer = window.setTimeout(sync, 0);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => {
      window.clearTimeout(syncTimer);
      mq.removeEventListener("change", handler);
    };
  }, []);

  useEffect(() => {
    if (!reducedMotion || paused || items.length === 0) return;
    carouselTimer.current = setInterval(() => {
      setCarouselIdx((i) => (i + 1) % items.length);
    }, 4000);
    return () => {
      if (carouselTimer.current) clearInterval(carouselTimer.current);
    };
  }, [reducedMotion, paused, items.length]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
      } catch {
        setDismissed(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);
  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  if (dismissed || items.length === 0) return null;

  // Duration scales with item count so each item gets ~5 s of screen time
  const animationDuration = Math.max(20, items.length * 5);
  // Duplicate the list to make the loop seamless
  const displayItems = [...items, ...items];

  const dotColor = (type: TickerItem["type"]) =>
    type === "price" ? "var(--brand-teal)" : "var(--brand-sky, #1A8F8F)";

  // ── Reduced-motion: single fading headline ──────────────────────────────
  if (reducedMotion) {
    const item = items[carouselIdx];
    return (
      <div
        role="marquee"
        aria-label="Latest peptide news and price updates"
        className="flex items-center gap-3 overflow-hidden border-b px-4 py-2 sm:px-6"
        style={{
          background: "var(--brand-navy)",
          borderColor: "rgb(255 255 255 / 0.08)",
          minHeight: "36px",
        }}
      >
        {/* "LIVE" label */}
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
          style={{ background: "var(--brand-gold)", color: "#fff" }}
          aria-hidden="true"
        >
          Live
        </span>

        {/* Headline */}
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: dotColor(item.type) }}
            aria-hidden="true"
          />
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="truncate text-xs font-medium transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              style={{ color: "rgb(255 255 255 / 0.85)" }}
            >
              {item.text}
            </a>
          ) : (
            <span
              className="truncate text-xs"
              style={{ color: "rgb(255 255 255 / 0.75)" }}
            >
              {item.text}
            </span>
          )}
        </span>

        {/* Step indicator */}
        <span
          className="shrink-0 text-[10px] tabular-nums"
          style={{ color: "rgb(255 255 255 / 0.35)" }}
          aria-live="polite"
          aria-atomic="true"
        >
          {carouselIdx + 1} / {items.length}
        </span>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          aria-label="Dismiss news ticker"
          className="shrink-0 rounded p-1 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
          style={{ color: "rgb(255 255 255 / 0.4)" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    );
  }

  // ── Full animation: horizontal marquee scroll ───────────────────────────
  return (
    <div
      role="marquee"
      aria-label="Latest peptide news and price updates"
      className="flex items-center gap-0 overflow-hidden border-b"
      style={{
        background: "var(--brand-navy)",
        borderColor: "rgb(255 255 255 / 0.08)",
        minHeight: "36px",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* "LIVE" badge — fixed left */}
      <div
        className="flex shrink-0 items-center gap-2 border-r px-3 py-2"
        style={{
          background: "rgb(255 255 255 / 0.04)",
          borderColor: "rgb(255 255 255 / 0.1)",
          zIndex: 1,
        }}
      >
        <span
          className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
          style={{ background: "var(--brand-gold)", color: "#fff" }}
          aria-hidden="true"
        >
          Live
        </span>
      </div>

      {/* Scrolling track */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{ height: "36px" }}
        aria-hidden="true"
      >
        <div
          className="flex items-center whitespace-nowrap"
          style={{
            animationName: "ticker-scroll",
            animationDuration: `${animationDuration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: paused ? "paused" : "running",
            height: "36px",
            willChange: "transform",
          }}
        >
          {displayItems.map((item, i) => (
            <TickerItemEl key={i} item={item} />
          ))}
        </div>
      </div>

      {/* Dismiss button — fixed right */}
      <button
        onClick={dismiss}
        aria-label="Dismiss news ticker"
        className="shrink-0 px-3 py-2 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
        style={{ color: "rgb(255 255 255 / 0.35)" }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <path d="M1 1l8 8M9 1L1 9" />
        </svg>
      </button>

      {/* Keyframe animation injected as a style tag */}
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function TickerItemEl({ item }: { item: TickerItem }) {
  const dotColor = item.type === "price" ? "var(--brand-teal)" : "var(--brand-sky, #1A8F8F)";

  const inner = (
    <span className="flex items-center gap-2 px-6">
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: dotColor }}
      />
      <span
        className="text-xs"
        style={{ color: "rgb(255 255 255 / 0.80)" }}
      >
        {item.text}
      </span>
    </span>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-flex items-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
        tabIndex={0}
      >
        {inner}
      </a>
    );
  }

  return <span className="inline-flex">{inner}</span>;
}
