import type { ReactNode } from "react";

export type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "info" | "brand";
export type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, { color: string; bg: string; border: string }> = {
  success: {
    color: "var(--success)",
    bg: "var(--success-bg)",
    border: "var(--success-border)",
  },
  warning: {
    color: "var(--warning)",
    bg: "var(--warning-bg)",
    border: "var(--warning-border)",
  },
  danger: {
    color: "var(--danger)",
    bg: "var(--danger-bg)",
    border: "var(--danger-border)",
  },
  neutral: {
    color: "var(--muted)",
    bg: "var(--surface-raised)",
    border: "var(--border)",
  },
  info: {
    color: "var(--info)",
    bg: "var(--info-bg)",
    border: "var(--info-border)",
  },
  brand: {
    color: "var(--brand-navy)",
    bg: "#e0f2fe",
    border: "#bae6fd",
  },
};

export function Badge({ variant = "neutral", size = "sm", children, className = "" }: BadgeProps) {
  const styles = VARIANT_STYLES[variant];
  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        className,
      ].join(" ")}
      style={{
        color: styles.color,
        background: styles.bg,
        border: `1px solid ${styles.border}`,
      }}
    >
      {children}
    </span>
  );
}

export function AvailabilityBadge({ status }: { status: string }) {
  const MAP: Record<string, { variant: BadgeVariant; label: string }> = {
    in_stock: { variant: "success", label: "In Stock" },
    out_of_stock: { variant: "danger", label: "Out of Stock" },
    pre_order: { variant: "warning", label: "Pre-Order" },
  };

  const config = MAP[status] ?? { variant: "neutral" as BadgeVariant, label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

/** "Best Price" highlight badge */
export function BestPriceBadge() {
  return (
    <Badge variant="success" size="sm">
      Best Price
    </Badge>
  );
}
