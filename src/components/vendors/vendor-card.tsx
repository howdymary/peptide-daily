import Link from "next/link";
import { FinnrickGradeBadge } from "@/components/primitives/finnrick-grade-badge";
import { TrustScore } from "@/components/primitives/trust-score";
import { TimestampLive } from "@/components/primitives/timestamp-live";
import { DataSourceTag } from "@/components/primitives/data-source-tag";

interface VendorCardProps {
  vendor: {
    name: string;
    slug: string;
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

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link
      href={`/vendors/${vendor.slug}`}
      className="surface-card hover-lift flex h-full flex-col rounded-[1.75rem] p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-[var(--font-newsreader)] text-3xl leading-none text-[var(--text-primary)]">
            {vendor.name}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {vendor.vendorDomain ?? vendor.website.replace(/^https?:\/\//, "")}
          </p>
        </div>
        <FinnrickGradeBadge grade={vendor.bestGrade} size="lg" />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
        <span>Finnrick-tested</span>
        <span aria-hidden="true">·</span>
        <span>{vendor.totalTestCount} lab tests</span>
        <span aria-hidden="true">·</span>
        <span>{vendor.peptideCount} peptides tracked</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
        <TrustScore score={vendor.trustScore} size="md" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[var(--bg-tertiary)] p-4">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Avg lab score
            </p>
            <p className="mt-2 font-mono text-2xl text-[var(--text-primary)]">
              {vendor.averageScore != null ? vendor.averageScore.toFixed(1) : "—"}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--bg-tertiary)] p-4">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Last tested
            </p>
            <div className="mt-2">
              <TimestampLive updatedAt={vendor.latestTestDate} prefix="" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <DataSourceTag source="Finnrick" lastUpdated={vendor.latestTestDate} />
      </div>

      <div className="mt-auto pt-6 text-sm font-medium text-[var(--accent-primary)]">
        View vendor profile →
      </div>
    </Link>
  );
}
