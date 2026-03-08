"use client";

import { useState, useRef, useId, type ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  /** Tooltip position relative to trigger */
  side?: "top" | "bottom" | "left" | "right";
}

/**
 * Lightweight accessible tooltip component.
 * Shows on hover/focus, hides on blur/mouseleave.
 */
export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => setVisible(false), 100);
  };

  const positionClasses: Record<NonNullable<TooltipProps["side"]>, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <span className="relative inline-flex items-center">
      <span
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-describedby={visible ? id : undefined}
      >
        {children}
      </span>

      {visible && (
        <span
          id={id}
          role="tooltip"
          className={[
            "pointer-events-none absolute z-50 whitespace-normal rounded-lg px-3 py-2 text-xs leading-relaxed text-white shadow-lg",
            "max-w-xs",
            positionClasses[side],
          ].join(" ")}
          style={{ background: "var(--brand-navy)", minWidth: "140px" }}
        >
          {content}
        </span>
      )}
    </span>
  );
}

/** Small ⓘ icon that triggers a tooltip */
export function InfoIcon({ tooltip }: { tooltip: ReactNode }) {
  return (
    <Tooltip content={tooltip}>
      <button
        type="button"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold transition-colors focus:outline-none"
        style={{
          color: "var(--muted)",
          background: "var(--surface-raised)",
          border: "1px solid var(--border)",
        }}
        aria-label="More information"
        tabIndex={0}
      >
        i
      </button>
    </Tooltip>
  );
}
