import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Independent lab testing",
    description:
      "Finnrick tests purity, identity, and quantity so we can cite lab-backed evidence instead of relying on vendor copy.",
  },
  {
    step: "02",
    title: "Live price aggregation",
    description:
      "Vendor prices are refreshed on a 15-minute cadence and normalized into a comparison-ready view.",
  },
  {
    step: "03",
    title: "Composite trust score",
    description:
      "Our trust score weights lab quality 50%, community reviews 30%, and pricing signal 20% — all visible.",
  },
];

export function MethodologyStrip() {
  return (
    <section className="section-spacing bg-[var(--bg-tertiary)]">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="eyebrow">Trust infrastructure</span>
          <h2 className="section-heading mt-4">How we verify peptide data</h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.step} className="surface-card rounded-[1.5rem] p-6">
              <p className="data-mono text-3xl font-semibold text-[var(--accent-primary)]">{step.step}</p>
              <h3 className="mt-4 text-2xl text-[var(--text-primary)]">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/about" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)]">
            Read full methodology <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
