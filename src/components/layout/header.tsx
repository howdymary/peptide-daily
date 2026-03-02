import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card-bg)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-[var(--accent)]">
          PeptidePal
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/peptides"
            className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            Catalog
          </Link>
          <Link
            href="/auth/signin"
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
