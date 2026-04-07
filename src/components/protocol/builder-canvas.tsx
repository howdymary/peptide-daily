"use client";

import { useState, useCallback } from "react";

interface PeptideOption {
  id: string;
  slug: string;
  name: string;
  category: string | null;
}

interface SafetyResult {
  safetyScore: { score: number; label: string; color: string };
  warnings: {
    peptideAName: string;
    peptideBName: string;
    severity: string;
    description: string;
  }[];
  overallSeverity: string;
}

interface BuilderCanvasProps {
  peptides: PeptideOption[];
}

export function BuilderCanvas({ peptides }: BuilderCanvasProps) {
  const [selected, setSelected] = useState<PeptideOption[]>([]);
  const [search, setSearch] = useState("");
  const [safetyResult, setSafetyResult] = useState<SafetyResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [protocolName, setProtocolName] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = search
    ? peptides
        .filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) &&
            !selected.some((s) => s.id === p.id),
        )
        .slice(0, 8)
    : [];

  const addPeptide = useCallback(
    (peptide: PeptideOption) => {
      if (selected.length >= 8) return;
      setSelected((prev) => [...prev, peptide]);
      setSearch("");
      setSafetyResult(null);
      setShareUrl(null);
    },
    [selected.length],
  );

  const removePeptide = useCallback((id: string) => {
    setSelected((prev) => prev.filter((p) => p.id !== id));
    setSafetyResult(null);
    setShareUrl(null);
  }, []);

  async function checkSafety() {
    if (selected.length < 2) return;
    setChecking(true);
    try {
      const res = await fetch("/api/interactions/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peptideIds: selected.map((p) => p.id) }),
      });
      if (res.ok) {
        setSafetyResult(await res.json());
      }
    } finally {
      setChecking(false);
    }
  }

  async function saveProtocol() {
    if (!protocolName.trim() || selected.length < 2) return;
    setSaving(true);
    try {
      const res = await fetch("/api/protocols", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: protocolName,
          peptideIds: selected.map((p) => p.id),
          isPublic: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.shareToken) {
          setShareUrl(`${window.location.origin}/protocol-builder/${data.shareToken}`);
        }
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Left: search + add */}
      <div className="surface-card p-5 lg:col-span-1">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          Add compounds
        </h2>
        <div className="relative mt-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search peptides..."
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent-primary)]"
          />
          {filtered.length > 0 && (
            <ul className="absolute left-0 top-full z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] shadow-lg">
              {filtered.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => addPeptide(p)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--bg-tertiary)]"
                  >
                    <span className="font-medium text-[var(--text-primary)]">{p.name}</span>
                    {p.category && (
                      <span className="ml-2 text-xs text-[var(--text-tertiary)]">
                        {p.category}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-3 text-xs text-[var(--text-tertiary)]">
          {selected.length}/8 compounds selected
        </p>
      </div>

      {/* Right: timeline + safety */}
      <div className="lg:col-span-2">
        {/* Timeline */}
        <div className="surface-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Protocol timeline
          </h2>

          {selected.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--text-tertiary)]">
              Search and add compounds to build your protocol.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
                  style={{
                    borderColor: "var(--accent-border)",
                    background: "var(--accent-subtle)",
                  }}
                >
                  <span className="data-mono text-xs text-[var(--text-tertiary)]">{i + 1}</span>
                  <span className="font-medium text-[var(--accent-primary)]">{p.name}</span>
                  <button
                    type="button"
                    onClick={() => removePeptide(p.id)}
                    className="ml-1 rounded-full p-0.5 text-xs text-[var(--text-tertiary)] hover:bg-[var(--accent-primary)] hover:text-white"
                    aria-label={`Remove ${p.name}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {selected.length >= 2 && (
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={checkSafety}
                disabled={checking}
                className="rounded-xl border border-[var(--border-default)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-border)] disabled:opacity-50"
              >
                {checking ? "Checking..." : "Check interactions"}
              </button>
            </div>
          )}
        </div>

        {/* Safety result */}
        {safetyResult && (
          <div className="surface-card mt-5 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                Safety assessment
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className="data-mono text-2xl font-bold"
                  style={{ color: safetyResult.safetyScore.color }}
                >
                  {safetyResult.safetyScore.score}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: safetyResult.safetyScore.color }}
                >
                  {safetyResult.safetyScore.label}
                </span>
              </div>
            </div>

            {safetyResult.warnings.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {safetyResult.warnings.map((w, i) => (
                  <li
                    key={i}
                    className="rounded-xl p-3"
                    style={{
                      background:
                        w.severity === "avoid"
                          ? "oklch(95% 0.03 15)"
                          : "oklch(95% 0.03 80)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                        style={{
                          background:
                            w.severity === "avoid"
                              ? "var(--grade-e, oklch(50% 0.2 15))"
                              : "var(--grade-c, oklch(60% 0.14 80))",
                          color: "white",
                        }}
                      >
                        {w.severity}
                      </span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {w.peptideAName} + {w.peptideBName}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{w.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-[var(--text-secondary)]">
                No known interactions found between selected compounds.
              </p>
            )}
          </div>
        )}

        {/* Save & share */}
        {selected.length >= 2 && (
          <div className="surface-card mt-5 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Save & share
            </h2>
            <div className="mt-3 flex gap-3">
              <input
                type="text"
                value={protocolName}
                onChange={(e) => setProtocolName(e.target.value)}
                placeholder="Name your protocol..."
                className="flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent-primary)]"
              />
              <button
                type="button"
                onClick={saveProtocol}
                disabled={saving || !protocolName.trim()}
                className="rounded-xl bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-primary-hover)] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

            {shareUrl && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-[var(--bg-tertiary)] px-4 py-2.5">
                <span className="flex-1 truncate text-sm text-[var(--text-secondary)]">
                  {shareUrl}
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="shrink-0 text-sm font-medium text-[var(--accent-primary)] hover:underline"
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
