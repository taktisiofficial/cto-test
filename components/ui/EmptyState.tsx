import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline";
  };
  children?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 py-12 ${className}`}
      role="status"
      aria-live="polite"
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-[var(--surface-2)] p-4">
          <Icon
            className="h-8 w-8 text-[var(--text-tertiary)]"
            aria-hidden="true"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || "primary"}
          size="md"
        >
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}

interface EmptyStateCardProps extends EmptyStateProps {
  variant?: "elevated" | "outlined" | "flat";
}

export function EmptyStateCard({
  variant = "outlined",
  className = "",
  ...props
}: EmptyStateCardProps) {
  const variants = {
    elevated:
      "rounded-[var(--radius-lg)] bg-[var(--surface-base)] shadow-[var(--shadow-md)] border border-[var(--border-subtle)]",
    outlined:
      "rounded-[var(--radius-lg)] bg-[var(--surface-base)] border-2 border-dashed border-[var(--border-default)]",
    flat: "rounded-[var(--radius-lg)] bg-[var(--surface-1)]",
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      <EmptyState {...props} />
    </div>
  );
}
