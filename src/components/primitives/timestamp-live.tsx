"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { formatRelativeTime } from "@/lib/presentation";

export function TimestampLive({
  updatedAt,
  prefix = "Updated",
  className,
}: {
  updatedAt?: string | Date | null;
  prefix?: string;
  className?: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const sync = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => {
      window.clearTimeout(sync);
      window.clearInterval(timer);
    };
  }, []);

  if (!updatedAt) return null;

  return (
    <span className={cn("inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]", className)}>
      <span className="live-dot h-2.5 w-2.5 rounded-full bg-[var(--accent-primary)]" aria-hidden="true" />
      <span>{prefix} {formatRelativeTime(updatedAt, now ?? undefined)}</span>
    </span>
  );
}
