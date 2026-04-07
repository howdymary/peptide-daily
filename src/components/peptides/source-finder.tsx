import Link from "next/link";
import { PROVIDER_TYPE_LABELS } from "@/lib/providers/search";

interface SourceFinderProvider {
  slug: string;
  name: string;
  type: string;
  city: string | null;
  state: string | null;
  offersTelehealth: boolean;
  fdaRegistered: boolean;
  cpsVerified: boolean;
}

interface SourceFinderProps {
  peptideName: string;
  providers: SourceFinderProvider[];
}

export function SourceFinder({ peptideName, providers }: SourceFinderProps) {
  if (providers.length === 0) {
    return (
      <section className="mt-14">
        <div className="max-w-2xl">
          <span className="eyebrow">Source finder</span>
          <h2 className="section-heading mt-3">Clinics & pharmacies</h2>
          <p className="section-subheading">
            We are building a directory of clinics and pharmacies that carry or
            compound {peptideName}. In the meantime, browse the{" "}
            <Link href="/directory" className="text-[var(--accent-primary)] underline underline-offset-2">
              full directory
            </Link>
            .
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-14">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="eyebrow">Source finder</span>
          <h2 className="section-heading mt-3">
            Clinics & pharmacies
          </h2>
          <p className="section-subheading">
            Providers that may carry or compound {peptideName}. Verify availability
            directly with each provider.
          </p>
        </div>
        <Link
          href="/directory"
          className="text-sm text-[var(--accent-primary)] hover:underline"
        >
          View full directory →
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {providers.map((provider) => {
          const typeLabel = PROVIDER_TYPE_LABELS[provider.type] ?? provider.type;
          const location =
            provider.city && provider.state
              ? `${provider.city}, ${provider.state}`
              : null;

          return (
            <Link
              key={provider.slug}
              href={`/directory/${provider.slug}`}
              className="surface-card group flex items-center justify-between gap-3 p-4 transition-shadow hover:shadow-md"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                  {provider.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)]">
                  <span>{typeLabel}</span>
                  {location && (
                    <>
                      <span aria-hidden="true">&middot;</span>
                      <span>{location}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                {provider.fdaRegistered && (
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase" style={{ background: "oklch(95% 0.05 145)", color: "oklch(45% 0.15 145)" }}>FDA</span>
                )}
                {provider.offersTelehealth && (
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase" style={{ background: "var(--accent-subtle)", color: "var(--accent-primary)" }}>Telehealth</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
