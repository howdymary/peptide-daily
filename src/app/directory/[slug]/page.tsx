import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PROVIDER_TYPE_LABELS } from "@/lib/providers/search";
import { MedicalDisclaimer } from "@/components/primitives/medical-disclaimer";

export const revalidate = 300;

interface ProviderPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await prisma.provider.findUnique({
    where: { slug },
    select: { name: true, type: true, city: true, state: true },
  });

  if (!provider) return { title: "Provider not found" };

  const typeLabel = PROVIDER_TYPE_LABELS[provider.type] ?? provider.type;
  const location = provider.city && provider.state ? ` in ${provider.city}, ${provider.state}` : "";

  return {
    title: `${provider.name} | ${typeLabel}${location} | Peptide Daily`,
    description: `${provider.name} — ${typeLabel}${location}. View services, verification status, and contact information.`,
  };
}

export default async function ProviderDetailPage({ params }: ProviderPageProps) {
  const { slug } = await params;

  const provider = await prisma.provider.findUnique({
    where: { slug, isActive: true },
  });

  if (!provider) notFound();

  const typeLabel = PROVIDER_TYPE_LABELS[provider.type] ?? provider.type;
  const location =
    provider.city && provider.state
      ? `${provider.city}, ${provider.state}`
      : provider.state ?? null;

  const SERVICE_LABELS: Record<string, string> = {
    "peptide-therapy": "Peptide Therapy",
    "hormone-replacement": "Hormone Replacement",
    "telehealth-consult": "Virtual Consultations",
    "lab-work": "Lab Work",
    compounding: "Compounding",
    "peptide-formulation": "Peptide Formulation",
    "sterile-compounding": "Sterile Compounding",
    "hormone-prep": "Hormone Preparations",
    "503b-outsourcing": "503B Outsourcing",
    "regenerative-medicine": "Regenerative Medicine",
    "performance-medicine": "Performance Medicine",
    "preventive-health": "Preventive Health",
    "functional-medicine": "Functional Medicine",
    "anti-aging": "Anti-Aging",
    longevity: "Longevity Programs",
    "metabolic-optimization": "Metabolic Optimization",
    "specialty-compounds": "Specialty Compounds",
    veterinary: "Veterinary",
    dermatological: "Dermatological",
  };

  return (
    <div className="section-spacing">
      <div className="container-page max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[var(--text-tertiary)]" aria-label="Breadcrumb">
          <Link href="/directory" className="hover:text-[var(--accent-primary)]">
            Directory
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--text-secondary)]">{provider.name}</span>
        </nav>

        {/* Header */}
        <div className="surface-card p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="display-heading text-2xl md:text-3xl">{provider.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-sm font-medium"
                  style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
                >
                  {typeLabel}
                </span>
                {location && (
                  <span className="text-sm text-[var(--text-secondary)]">{location}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {provider.fdaRegistered && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold uppercase"
                  style={{
                    background: "var(--grade-a-bg, oklch(95% 0.05 145))",
                    color: "var(--grade-a, oklch(45% 0.15 145))",
                  }}
                >
                  FDA Registered
                </span>
              )}
              {provider.cpsVerified && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold uppercase"
                  style={{
                    background: "var(--grade-b-bg, oklch(93% 0.04 240))",
                    color: "var(--grade-b, oklch(50% 0.12 240))",
                  }}
                >
                  CPS Verified
                </span>
              )}
              {provider.offersTelehealth && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold uppercase"
                  style={{ background: "var(--accent-subtle)", color: "var(--accent-primary)" }}
                >
                  Telehealth Available
                </span>
              )}
            </div>
          </div>

          {provider.description && (
            <p className="mt-5 leading-relaxed text-[var(--text-secondary)]">
              {provider.description}
            </p>
          )}
        </div>

        {/* Services */}
        {provider.services.length > 0 && (
          <div className="surface-card mt-6 p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Services</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {provider.services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-2 rounded-lg border border-[var(--border-default)] px-3 py-2"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: "var(--accent-primary)" }}
                  />
                  <span className="text-sm text-[var(--text-primary)]">
                    {SERVICE_LABELS[service] ?? service}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact & Details */}
        <div className="surface-card mt-6 p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Details</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {provider.website && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                  Website
                </dt>
                <dd className="mt-1">
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--accent-primary)] underline underline-offset-2 hover:text-[var(--accent-primary-hover)]"
                  >
                    {provider.website.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </dd>
              </div>
            )}
            {provider.phone && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                  Phone
                </dt>
                <dd className="mt-1 text-sm text-[var(--text-primary)]">{provider.phone}</dd>
              </div>
            )}
            {provider.email && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-[var(--text-primary)]">{provider.email}</dd>
              </div>
            )}
            {provider.address && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                  Address
                </dt>
                <dd className="mt-1 text-sm text-[var(--text-primary)]">
                  {provider.address}
                  {provider.city && provider.state && (
                    <>
                      <br />
                      {provider.city}, {provider.state} {provider.zipCode}
                    </>
                  )}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                Insurance
              </dt>
              <dd className="mt-1 text-sm text-[var(--text-primary)]">
                {provider.acceptsInsurance ? "Accepts insurance" : "Cash pay / self-pay"}
              </dd>
            </div>
            {provider.lastVerifiedAt && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                  Last Verified
                </dt>
                <dd className="mt-1 text-sm text-[var(--text-primary)]">
                  {new Date(provider.lastVerifiedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <MedicalDisclaimer variant="callout" className="mt-10" />
      </div>
    </div>
  );
}
