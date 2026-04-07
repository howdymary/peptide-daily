"use client";

import { useState } from "react";
import Link from "next/link";
import { DISCOVERY_STEPS, extractTags, type FlowAnswers } from "@/lib/discover/flow-config";
import {
  generateRecommendations,
  type DiscoveryResult,
} from "@/lib/discover/recommendation-engine";
import { PROVIDER_TYPE_LABELS } from "@/lib/providers/search";

interface PeptideRecord {
  slug: string;
  name: string;
  category: string | null;
  goalTags: string[];
  regulatoryStatus: string | null;
}

interface DiscoveryFlowProps {
  peptides: PeptideRecord[];
}

export function DiscoveryFlow({ peptides }: DiscoveryFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<FlowAnswers>({});
  const [result, setResult] = useState<DiscoveryResult | null>(null);

  const isComplete = stepIndex >= DISCOVERY_STEPS.length;
  const currentStep = DISCOVERY_STEPS[stepIndex] ?? null;
  const progress = ((stepIndex) / DISCOVERY_STEPS.length) * 100;

  function selectOption(value: string) {
    const step = DISCOVERY_STEPS[stepIndex];
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);

    if (stepIndex + 1 >= DISCOVERY_STEPS.length) {
      // Generate results
      const recs = generateRecommendations(newAnswers, peptides);
      setResult(recs);
      setStepIndex(stepIndex + 1);
    } else {
      setStepIndex(stepIndex + 1);
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      setResult(null);
    }
  }

  function restart() {
    setStepIndex(0);
    setAnswers({});
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-1.5 w-full rounded-full bg-[var(--bg-tertiary)]">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: `${isComplete ? 100 : progress}%`,
              background: "var(--accent-primary)",
            }}
          />
        </div>
        <p className="mt-2 text-xs text-[var(--text-tertiary)]">
          {isComplete
            ? "Results"
            : `Step ${stepIndex + 1} of ${DISCOVERY_STEPS.length}`}
        </p>
      </div>

      {/* Question card */}
      {!isComplete && currentStep && (
        <div className="surface-card p-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            {currentStep.question}
          </h2>
          {currentStep.subtitle && (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {currentStep.subtitle}
            </p>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {currentStep.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => selectOption(option.value)}
                className="rounded-xl border border-[var(--border-default)] px-5 py-4 text-left transition-all hover:border-[var(--accent-border)] hover:shadow-sm"
              >
                <span className="block text-sm font-medium text-[var(--text-primary)]">
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {stepIndex > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="mt-6 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent-primary)]"
            >
              Back
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {isComplete && result && (
        <div className="space-y-6">
          <div className="surface-card p-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Your recommendations
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Based on your answers, here are the most relevant compounds and sources.
            </p>
          </div>

          {/* Peptide recommendations */}
          {result.peptides.length > 0 && (
            <div className="surface-card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                Recommended compounds
              </h3>
              <div className="mt-4 space-y-3">
                {result.peptides.map((rec) => (
                  <Link
                    key={rec.slug}
                    href={`/peptides/${rec.slug}`}
                    className="flex items-center justify-between rounded-xl border border-[var(--border-default)] px-4 py-3 transition-colors hover:border-[var(--accent-border)]"
                  >
                    <div>
                      <span className="font-medium text-[var(--text-primary)]">{rec.name}</span>
                      <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">{rec.reason}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(rec.relevanceScore, 5) }).map((_, i) => (
                        <span
                          key={i}
                          className="h-2 w-2 rounded-full"
                          style={{ background: "var(--accent-primary)" }}
                        />
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Provider type recommendations */}
          {result.providerTypes.length > 0 && (
            <div className="surface-card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                Recommended source types
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.providerTypes.map((type) => (
                  <Link
                    key={type}
                    href={`/directory?type=${type}`}
                    className="rounded-full border border-[var(--border-default)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--accent-primary)]"
                  >
                    {PROVIDER_TYPE_LABELS[type] ?? type}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={restart}
              className="text-sm text-[var(--accent-primary)] underline underline-offset-2 hover:text-[var(--accent-primary-hover)]"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
