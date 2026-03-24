"use client";

import { useState, type FormEvent } from "react";

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
            ? "rounded-xl border p-6 text-center"
            : "flex items-center gap-3"
        }
        style={{
          ...(variant === "card" && !dark
            ? {
                borderColor: "var(--card-border)",
                background: "var(--card-bg)",
                boxShadow: "var(--card-shadow)",
              }
            : {}),
          ...(variant === "card" && dark
            ? {
                borderColor: "rgb(255 255 255 / 0.1)",
                background: "rgb(255 255 255 / 0.05)",
              }
            : {}),
        }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: dark ? "#5EEAD4" : "#0D6E6E" }}
        >
          You're in. Check your inbox.
        </p>
      </div>
    );
  }

  const headlineColor = dark ? "#ffffff" : "#1B2A4A";
  const subtextColor = dark ? "rgb(255 255 255 / 0.55)" : "var(--muted)";
  const inputBg = dark ? "rgb(255 255 255 / 0.08)" : "var(--surface)";
  const inputBorder = dark ? "rgb(255 255 255 / 0.12)" : "var(--border)";
  const inputText = dark ? "#ffffff" : "var(--foreground)";
  const placeholderClass = dark ? "placeholder:text-white/40" : "placeholder:text-gray-400";

  // ── Inline variant (horizontal — for hero/footer) ──────────────────────────
  if (variant === "inline") {
    return (
      <div>
        <p className="mb-2 text-sm font-semibold" style={{ color: headlineColor }}>
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
            className={`flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 ${placeholderClass}`}
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
            className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "#0D6E6E", color: "#ffffff" }}
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
        <p className="mt-1.5 text-xs" style={{ color: subtextColor }}>
          No spam, unsubscribe anytime.
        </p>
      </div>
    );
  }

  // ── Card variant (vertical — for sidebar/standalone) ───────────────────────
  return (
    <div
      className="rounded-xl border p-6"
      style={{
        ...(dark
          ? {
              borderColor: "rgb(255 255 255 / 0.1)",
              background: "rgb(255 255 255 / 0.05)",
            }
          : {
              borderColor: "var(--card-border)",
              background: "var(--card-bg)",
              boxShadow: "var(--card-shadow)",
              borderTopColor: "#0D6E6E",
              borderTopWidth: "3px",
            }),
      }}
    >
      <h3
        className="text-base font-semibold"
        style={{ color: headlineColor }}
      >
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
            className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 ${placeholderClass}`}
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
          className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: "#0D6E6E", color: "#ffffff" }}
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
