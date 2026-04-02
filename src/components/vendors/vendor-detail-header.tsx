import { FinnrickGradeBadge } from "@/components/primitives/finnrick-grade-badge";
import { TrustScore } from "@/components/primitives/trust-score";
import { TimestampLive } from "@/components/primitives/timestamp-live";

interface VendorDetailHeaderProps {
  vendor: {
    name: string;
    website: string;
    vendorDomain?: string | null;
    bestGrade: "A" | "B" | "C" | "D" | "E" | null;
    trustScore: number;
    peptideCount: number;
    totalTestCount: number;
    averageScore: number | null;
    latestTestDate?: Date | string | null;
  };
}

export function VendorDetailHeader({ vendor }: VendorDetailHeaderProps) {
  const stats = [
    { label: "Peptides tracked", value: vendor.peptideCount },
    { label: "Lab tests", value: vendor.totalTestCount },
    {
      label: "Avg Finnrick score",
      value: vendor.averageScore != null ? vendor.averageScore.toFixed(1) : "—",
    },
  ];

  return (
    <section className="rounded-[2rem] border border-[var(--border-default)] bg-[var(--bg-secondary)] px-6 py-8 shadow-[0_28px_70px_-48px_rgba(28,25,23,0.38)] md:px-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Vendor profile</p>
          <h1 className="mt-4 font-[var(--font-newsreader)] text-[clamp(2.4rem,5vw,4.75rem)] leading-[0.95] text-[var(--text-primary)]">
            {vendor.name}
          </h1>
          <a
            href={vendor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--info)] underline-offset-4 hover:underline"
          >
            {vendor.vendorDomain ?? vendor.website.replace(/^https?:\/\//, "")} ↗
          </a>
          <div className="mt-5">
            <TimestampLive updatedAt={vendor.latestTestDate} prefix="Lab data updated" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-[1.5rem] bg-[var(--bg-tertiary)] p-5">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Finnrick grade
            </p>
            <div className="mt-3">
              <FinnrickGradeBadge grade={vendor.bestGrade} size="lg" />
            </div>
          </div>
          <TrustScore score={vendor.trustScore} size="lg" className="justify-center" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[1.5rem] border border-[var(--border-default)] bg-[var(--bg-tertiary)] p-5">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              {item.label}
            </p>
            <p className="mt-2 font-mono text-[1.75rem] text-[var(--text-primary)]">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
