import Link from "next/link";
import { PROVIDER_TYPE_LABELS } from "@/lib/providers/search";

interface ProviderCardProps {
  provider: {
    name: string;
    slug: string;
    type: string;
    city: string | null;
    state: string | null;
    description: string | null;
    services: string[];
    offersTelehealth: boolean;
    fdaRegistered: boolean;
    cpsVerified: boolean;
  };
}

const SERVICE_LABELS: Record<string, string> = {
  "peptide-therapy": "Peptide Therapy",
  "hormone-replacement": "HRT",
  "telehealth-consult": "Virtual Visits",
  "lab-work": "Lab Work",
  compounding: "Compounding",
  "peptide-formulation": "Peptide Formulation",
  "sterile-compounding": "Sterile Compounding",
  "hormone-prep": "Hormone Prep",
  "503b-outsourcing": "503B Outsourcing",
  "regenerative-medicine": "Regenerative Medicine",
  "performance-medicine": "Performance Medicine",
  "preventive-health": "Preventive Health",
  "functional-medicine": "Functional Medicine",
  "anti-aging": "Anti-Aging",
  longevity: "Longevity",
  "metabolic-optimization": "Metabolic Optimization",
  "specialty-compounds": "Specialty Compounds",
  veterinary: "Veterinary",
  dermatological: "Dermatological",
};

export function ProviderCard({ provider }: ProviderCardProps) {
  const typeLabel = PROVIDER_TYPE_LABELS[provider.type] ?? provider.type;
  const location =
    provider.city && provider.state
      ? `${provider.city}, ${provider.state}`
      : provider.state ?? null;

  return (
    <Link
      href={`/directory/${provider.slug}`}
      className="surface-card group flex flex-col gap-4 p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
            {provider.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span
              className="rounded-full px-2.5 py-0.5 font-medium"
              style={{
                background: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
              }}
            >
              {typeLabel}
            </span>
            {location && <span>{location}</span>}
          </div>
        </div>
        <div className="flex shrink-0 gap-1.5">
          {provider.fdaRegistered && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                background: "var(--grade-a-bg, oklch(95% 0.05 145))",
                color: "var(--grade-a, oklch(45% 0.15 145))",
              }}
            >
              FDA
            </span>
          )}
          {provider.cpsVerified && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                background: "var(--grade-b-bg, oklch(93% 0.04 240))",
                color: "var(--grade-b, oklch(50% 0.12 240))",
              }}
            >
              CPS
            </span>
          )}
          {provider.offersTelehealth && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                background: "var(--accent-subtle)",
                color: "var(--accent-primary)",
              }}
            >
              Telehealth
            </span>
          )}
        </div>
      </div>

      {provider.description && (
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {provider.description}
        </p>
      )}

      {provider.services.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {provider.services.slice(0, 4).map((service) => (
            <span
              key={service}
              className="rounded-md px-2 py-0.5 text-[11px] text-[var(--text-tertiary)]"
              style={{ background: "var(--bg-tertiary)" }}
            >
              {SERVICE_LABELS[service] ?? service}
            </span>
          ))}
          {provider.services.length > 4 && (
            <span className="px-1 text-[11px] text-[var(--text-tertiary)]">
              +{provider.services.length - 4} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
