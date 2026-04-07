"use client";

import { useState } from "react";
import Link from "next/link";

export default function VerifiedSourceApplyPage() {
  const [formData, setFormData] = useState({
    contactName: "",
    contactEmail: "",
    organizationName: "",
    organizationType: "",
    website: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/verified-source/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="section-spacing">
        <div className="container-page max-w-lg text-center">
          <div className="surface-card p-10">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white"
              style={{ background: "var(--accent-primary)" }}
            >
              &#10003;
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">
              Application received
            </h1>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              We will review your application and respond within 5 business days.
              You will receive a confirmation email with next steps.
            </p>
            <Link
              href="/verified-source"
              className="mt-6 inline-block text-sm text-[var(--accent-primary)] underline underline-offset-2"
            >
              Back to Verified Source Program
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-spacing">
      <div className="container-page max-w-lg">
        <nav className="mb-6 text-sm text-[var(--text-tertiary)]">
          <Link href="/verified-source" className="hover:text-[var(--accent-primary)]">
            Verified Source
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--text-secondary)]">Apply</span>
        </nav>

        <h1 className="display-heading text-2xl">Apply for verification</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Complete this form to start the verification process. We will review
          your information and reach out within 5 business days.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
              Your name *
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={formData.contactName}
              onChange={(e) => updateField("contactName", e.target.value)}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-sm outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
              Email *
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={formData.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-sm outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div>
            <label htmlFor="org-name" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
              Organization name *
            </label>
            <input
              id="org-name"
              type="text"
              required
              value={formData.organizationName}
              onChange={(e) => updateField("organizationName", e.target.value)}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-sm outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div>
            <label htmlFor="org-type" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
              Organization type *
            </label>
            <select
              id="org-type"
              required
              value={formData.organizationType}
              onChange={(e) => updateField("organizationType", e.target.value)}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-sm outline-none focus:border-[var(--accent-primary)]"
            >
              <option value="">Select...</option>
              <option value="research_vendor">Research Vendor</option>
              <option value="pharmacy_503a">503A Compounding Pharmacy</option>
              <option value="pharmacy_503b">503B Outsourcing Facility</option>
              <option value="clinic">Clinic</option>
              <option value="telehealth">Telehealth Provider</option>
              <option value="cdmo">CDMO / Manufacturer</option>
            </select>
          </div>

          <div>
            <label htmlFor="website" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
              Website
            </label>
            <input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://"
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-sm outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
              Anything else we should know?
            </label>
            <textarea
              id="message"
              rows={3}
              value={formData.message}
              onChange={(e) => updateField("message", e.target.value)}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-sm outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--danger)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[var(--accent-primary)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-primary-hover)] disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </div>
    </div>
  );
}
