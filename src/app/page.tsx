import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-12 py-16 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Compare Peptide Prices
          <br />
          <span className="text-[var(--accent)]">Across Vendors</span>
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          PeptidePal aggregates prices from multiple peptide vendors so you can
          find the best deals. Read reviews from the community and make informed
          purchasing decisions.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/peptides"
          className="rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--accent-hover)]"
        >
          Browse Catalog
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-semibold transition-colors hover:bg-[var(--card-bg)]"
        >
          Create Account
        </Link>
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <h3 className="font-semibold">Price Comparison</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            See prices from multiple vendors side-by-side. Automatically updated
            every 15 minutes.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <h3 className="font-semibold">Community Reviews</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Read honest reviews from real users. Rate and review peptides
            you&apos;ve tried.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <h3 className="font-semibold">Availability Tracking</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Know what&apos;s in stock across vendors. Filter by availability, price,
            and more.
          </p>
        </div>
      </div>
    </div>
  );
}
