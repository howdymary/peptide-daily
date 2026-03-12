import { PeptideCard } from "@/components/peptides/peptide-card";
import type { PaginatedResponse, PeptideListItem } from "@/types";

export async function FeaturedPeptides() {
  let peptides: PeptideListItem[] = [];

  try {
    // Fetch from internal API — sorted by Finnrick rating
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/peptides?sortBy=finnrick_rating&pageSize=6`, {
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data: PaginatedResponse<PeptideListItem> = await res.json();
      peptides = data.data;
    }
  } catch {
    // Silently degrade — home page still renders without featured peptides
  }

  if (peptides.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {peptides.map((peptide) => (
        <PeptideCard key={peptide.id} peptide={peptide} />
      ))}
    </div>
  );
}
