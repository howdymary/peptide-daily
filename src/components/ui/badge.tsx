interface BadgeProps {
  variant: "success" | "warning" | "danger" | "neutral";
  children: React.ReactNode;
}

const variantClasses = {
  success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  neutral: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}

export function AvailabilityBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeProps["variant"]; label: string }> = {
    in_stock: { variant: "success", label: "In Stock" },
    out_of_stock: { variant: "danger", label: "Out of Stock" },
    pre_order: { variant: "warning", label: "Pre-Order" },
  };

  const { variant, label } = config[status] || { variant: "neutral", label: status };

  return <Badge variant={variant}>{label}</Badge>;
}
