"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";

type Variant = "inline" | "card";

interface NewsletterSignupProps {
  variant?: Variant;
  /** When true, uses light text for dark backgrounds (hero/footer) */
  dark?: boolean;
}

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterSignup({
  variant = "card",
  dark = false,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div
        className={
          variant === "card"
            ? "rounded-[1.5rem] border p-6 text-center"
            : "flex items-center gap-3 rounded-[1.25rem] border px-4 py-3"
        }
        style={{
          borderColor: dark ? "rgba(255,255,255,0.14)" : "var(--accent-border)",
          background: dark ? "rgba(255,255,255,0.06)" : "var(--accent-subtle)",
        }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: dark ? "white" : "var(--accent-primary)" }}
        >
          You&apos;re in. Check your inbox.
        </p>
      </div>
    );
  }

  const headlineColor = dark ? "#ffffff" : "var(--text-primary)";
  const subtextColor = dark ? "rgba(255,255,255,0.62)" : "var(--text-secondary)";
  const inputBg = dark ? "rgba(255, 255, 255, 0.06)" : "var(--bg-secondary)";
  const inputBorder = dark ? "rgba(255,255,255,0.14)" : "var(--border-default)";
  const inputText = dark ? "#ffffff" : "var(--text-primary)";
  const placeholderClass = dark ? "placeholder:text-white/35" : "placeholder:text-[var(--text-tertiary)]";

  // ── Inline variant (horizontal — for hero/footer) ──────────────────────────
  if (variant === "inline") {
    return (
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: dark ? "rgba(255,255,255,0.72)" : "var(--text-tertiary)" }}>
          Weekly update
        </p>
        <p className="mb-3 text-base font-medium" style={{ color: headlineColor }}>
          Get weekly peptide price intel
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor="newsletter-email-inline" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email-inline"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={cn(
              "flex-1 rounded-full border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.14)]",
              placeholderClass,
            )}
            style={{
              background: inputBg,
              borderColor: inputBorder,
              color: inputText,
            }}
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-60"
            style={{ background: "var(--accent-primary)", color: "#ffffff" }}
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
        {status === "error" && (
          <p className="mt-1.5 text-xs" style={{ color: "#ef4444" }}>
            {errorMsg}{" "}
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="underline"
            >
              Retry
            </button>
          </p>
        )}
        <p className="mt-2 text-xs" style={{ color: subtextColor }}>
          No spam, unsubscribe anytime.
        </p>
      </div>
    );
  }

  // ── Card variant (vertical — for sidebar/standalone) ───────────────────────
  return (
    <div
      className="rounded-[1.5rem] border p-6"
      style={{
        ...(dark
          ? {
              borderColor: "rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
            }
          : {
              borderColor: "var(--border-default)",
              background: "var(--bg-secondary)",
              boxShadow: "0 18px 48px -38px rgba(28,25,23,0.22)",
            }),
      }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
        Newsletter
      </p>
      <h3 className="mt-2 text-xl font-medium" style={{ color: headlineColor }}>
        Get weekly peptide price intel
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: subtextColor }}>
        Join researchers who check prices weekly. No spam, unsubscribe anytime.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label htmlFor="newsletter-email-card" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email-card"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={cn(
              "w-full rounded-full border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.14)]",
              placeholderClass,
            )}
            style={{
              background: inputBg,
              borderColor: inputBorder,
              color: inputText,
            }}
            disabled={status === "loading"}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-full px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-60"
          style={{ background: "var(--accent-primary)", color: "#ffffff" }}
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-2 text-xs" style={{ color: "#ef4444" }}>
          {errorMsg}{" "}
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="underline"
          >
            Retry
          </button>
        </p>
      )}
    </div>
  );
}
