import Link from "next/link";
import { HeroSearch } from "@/components/home/hero-search";

interface HeroProps {
  quickLinks: Array<{ name: string; slug: string; grade: string | null }>;
  stats: Array<{ value: string; label: string }>;
}

export function Hero({ quickLinks, stats }: HeroProps) {
  return (
    <section className="section-spacing">
      <div className="container-page">
        <div className="mx-auto max-w-5xl">
          <h1 className="display-heading fade-up text-[clamp(3rem,8vw,6rem)] text-[var(--text-primary)]">
            Independent peptide prices
            <br />
            and <span className="text-[var(--accent-primary)]">lab-verified</span> data.
          </h1>

          <p className="fade-up mt-6 max-w-2xl text-lg text-[var(--text-secondary)] [animation-delay:150ms]">
            Compare prices across vendors, verified by third-party Finnrick lab
            testing. Updated every 15 minutes.
          </p>

          <div className="fade-up mt-8 [animation-delay:300ms]">
            <HeroSearch suggestions={quickLinks} />
          </div>

          <div className="fade-up mt-5 flex flex-wrap gap-3 text-sm [animation-delay:360ms]">
            {quickLinks.slice(0, 5).map((link) => (
              <Link
                key={link.slug}
                href={`/peptides?search=${encodeURIComponent(link.name)}`}
                className="rounded-full border px-3 py-1.5 text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
                style={{ borderColor: "var(--border-default)" }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="fade-up mt-10 grid gap-4 md:grid-cols-3 [animation-delay:450ms]">
            {stats.map((stat) => (
              <div key={stat.label} className="surface-card rounded-[1.5rem] px-5 py-5">
                <p className="data-mono text-3xl font-semibold text-[var(--text-primary)]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
