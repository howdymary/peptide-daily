import { CategoryPill } from "@/components/primitives/category-pill";
import { FinnrickGradeBadge } from "@/components/primitives/finnrick-grade-badge";
import { PriceTag } from "@/components/primitives/price-tag";
import { TrustScore } from "@/components/primitives/trust-score";

export function PeptideDetailHeader({
  name,
  description,
  category,
  grade,
  bestPrice,
  bestPriceVendor,
  trustScore,
}: {
  name: string;
  description?: string | null;
  category?: string | null;
  grade: string | null;
  bestPrice: number | null;
  bestPriceVendor?: string | null;
  trustScore: number | null;
}) {
  return (
    <section className="section-spacing pb-10">
      <div className="container-page">
        <div className="max-w-4xl">
          <CategoryPill category={category} />
          <h1 className="display-heading mt-5 text-[clamp(3rem,7vw,5.5rem)] text-[var(--text-primary)]">
            {name}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-lg text-[var(--text-secondary)]">
              {description}
            </p>
          )}

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="surface-card rounded-[1.5rem] px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                Grade
              </p>
              <div className="mt-3">
                <FinnrickGradeBadge grade={grade as never} size="lg" />
              </div>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">Finnrick lab signal</p>
            </div>

            <div className="surface-card rounded-[1.5rem] px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                Lowest
              </p>
              <div className="mt-3">
                <PriceTag amount={bestPrice} vendor={bestPriceVendor} lowest />
              </div>
            </div>

            <div className="surface-card rounded-[1.5rem] px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                Trust
              </p>
              <div className="mt-3">
                <TrustScore score={trustScore} size="lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
