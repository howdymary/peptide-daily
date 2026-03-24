import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { GradeBadge, GradeBadgeEmpty } from "@/components/finnrick/grade-badge";
import type { Metadata } from "next";
import type { FinnrickGrade } from "@/types";

export const metadata: Metadata = {
  title: "Peptide Vendors — Independent Reviews & Lab Testing | Peptide Daily",
  description:
    "Browse all peptide vendors with independent Finnrick lab testing results, purity grades, and pricing data. Compare vendors side-by-side with third-party verified quality scores.",
};

interface VendorSummary {
  id: string;
  name: string;
  slug: string;
  website: string;
  peptideCount: number;
  finnrickRatingCount: number;
  bestFinnrickGrade: FinnrickGrade | null;
  averageFinnrickScore: number | null;
  totalTestCount: number;
  latestTestDate: string | null;
  vendorDomain: string | null;
}

async function getVendors(): Promise<VendorSummary[]> {
  const vendors = await prisma.vendor.findMany({
    where: { isActive: true },
    include: {
      prices: {
        select: { peptideId: true, price: true },
        distinct: ["peptideId"],
      },
      finnrickRatings: {
        select: {
          grade: true,
          averageScore: true,
          testCount: true,
          newestTestDate: true,
          finnrickUrl: true,
        },
      },
      vendorMapping: {
        select: { vendorDomain: true, finnrickSlug: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const gradeOrder: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };

  return vendors.map((v) => {
    const ratings = v.finnrickRatings;
    const totalTests = ratings.reduce((sum, r) => sum + r.testCount, 0);
    const latestTest =
      ratings.length > 0
        ? ratings.reduce((best, r) =>
            r.newestTestDate > best.newestTestDate ? r : best
          ).newestTestDate
        : null;

    const bestGrade =
      ratings.length > 0
        ? ratings.reduce((best, r) =>
            (gradeOrder[r.grade] ?? 0) > (gradeOrder[best.grade] ?? 0) ? r : best
          ).grade
        : null;

    const avgScore =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + Number(r.averageScore), 0) / ratings.length
        : null;

    return {
      id: v.id,
      name: v.name,
      slug: v.slug,
      website: v.website,
      peptideCount: v.prices.length,
      finnrickRatingCount: ratings.length,
      bestFinnrickGrade: bestGrade as FinnrickGrade | null,
      averageFinnrickScore: avgScore !== null ? Math.round(avgScore * 10) / 10 : null,
      totalTestCount: totalTests,
      latestTestDate: latestTest?.toISOString() ?? null,
      vendorDomain: v.vendorMapping?.vendorDomain ?? null,
    };
  });
}

export default async function VendorsPage() {
  const vendors = await getVendors();

  return (
    <div className="container-page py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Vendors
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          All peptide vendors in our database with Finnrick lab testing summaries.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((v) => (
          <Link
            key={v.id}
            href={`/vendors/${v.slug}`}
            className="group flex flex-col rounded-xl p-5 transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--card-shadow)",
              textDecoration: "none",
            }}
          >
            {/* Vendor name + grade */}
            <div className="flex items-start justify-between gap-2">
              <h2
                className="font-semibold leading-snug transition-colors group-hover:text-[var(--accent)]"
                style={{ color: "var(--foreground)" }}
              >
                {v.name}
              </h2>
              {v.bestFinnrickGrade ? (
                <GradeBadge grade={v.bestFinnrickGrade} compact />
              ) : (
                <GradeBadgeEmpty />
              )}
            </div>

            {v.vendorDomain && (
              <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
                {v.vendorDomain}
              </p>
            )}

            <div className="mt-4 flex-1" />

            {/* Stats grid */}
            <dl className="mt-3 grid grid-cols-2 gap-2">
              <div
                className="rounded-lg p-2.5"
                style={{ background: "var(--surface-raised)" }}
              >
                <dt className="text-xs" style={{ color: "var(--muted)" }}>
                  Peptides
                </dt>
                <dd className="mt-0.5 font-semibold" style={{ color: "var(--foreground)" }}>
                  {v.peptideCount}
                </dd>
              </div>
              <div
                className="rounded-lg p-2.5"
                style={{ background: "var(--surface-raised)" }}
              >
                <dt className="text-xs" style={{ color: "var(--muted)" }}>
                  Lab tests
                </dt>
                <dd className="mt-0.5 font-semibold" style={{ color: "var(--foreground)" }}>
                  {v.totalTestCount}
                </dd>
              </div>
              {v.averageFinnrickScore !== null && (
                <div
                  className="rounded-lg p-2.5"
                  style={{ background: "var(--surface-raised)" }}
                >
                  <dt className="text-xs" style={{ color: "var(--muted)" }}>
                    Avg score
                  </dt>
                  <dd className="mt-0.5 font-semibold" style={{ color: "var(--foreground)" }}>
                    {v.averageFinnrickScore.toFixed(1)}
                  </dd>
                </div>
              )}
              {v.latestTestDate && (
                <div
                  className="rounded-lg p-2.5"
                  style={{ background: "var(--surface-raised)" }}
                >
                  <dt className="text-xs" style={{ color: "var(--muted)" }}>
                    Last tested
                  </dt>
                  <dd
                    className="mt-0.5 text-sm font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {new Date(v.latestTestDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              )}
            </dl>

            {v.finnrickRatingCount === 0 && (
              <p
                className="mt-3 text-xs"
                style={{ color: "var(--muted-light)" }}
              >
                No Finnrick lab data yet
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Finnrick explanation */}
      <div
        className="mt-8 rounded-xl p-4"
        style={{ background: "var(--info-bg)", border: "1px solid var(--info-border)" }}
      >
        <p className="text-xs leading-relaxed" style={{ color: "var(--foreground-secondary)" }}>
          <strong style={{ color: "var(--info)" }}>About Finnrick grades:</strong> Finnrick
          is an independent third-party lab testing service at{" "}
          <a
            href="https://www.finnrick.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            finnrick.com
          </a>
          . Grades (A-E) reflect purity, quantity accuracy, and identity test results.
          Peptide Daily imports and displays this data without modification. Grades are per
          peptide; the grade shown here is the best grade across all peptides tested for
          that vendor.
        </p>
      </div>
    </div>
  );
}
