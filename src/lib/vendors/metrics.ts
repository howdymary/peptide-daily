function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function computeVendorTrustScore({
  averageFinnrickScore,
  totalTestCount,
  peptideCount,
  latestTestDate,
}: {
  averageFinnrickScore?: number | null;
  totalTestCount?: number | null;
  peptideCount?: number | null;
  latestTestDate?: Date | string | null;
}) {
  const lab = averageFinnrickScore != null ? clamp(averageFinnrickScore * 10) : 0;
  const breadth = clamp(((totalTestCount ?? 0) / 24) * 100);

  let freshness = 0;
  if (latestTestDate) {
    const testedAt = new Date(latestTestDate);
    const ageDays = Math.max(
      0,
      (Date.now() - testedAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (ageDays <= 30) freshness = 100;
    else if (ageDays <= 90) freshness = 85;
    else if (ageDays <= 180) freshness = 70;
    else if (ageDays <= 365) freshness = 55;
    else freshness = 35;
  }

  const catalog = clamp(((peptideCount ?? 0) / 8) * 100);
  const evidence = clamp(breadth * 0.65 + catalog * 0.35);
  const overall = Math.round(lab * 0.6 + evidence * 0.25 + freshness * 0.15);

  return {
    overall: Number.isFinite(overall) ? overall : 0,
    breakdown: {
      lab: Math.round(lab),
      evidence: Math.round(evidence),
      freshness: Math.round(freshness),
    },
  };
}
