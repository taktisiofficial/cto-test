import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-[var(--focus-ring-offset)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none relative overflow-hidden";

  const variants = {
    primary:
      "bg-[var(--secondary-600)] text-white hover:bg-[var(--secondary-700)] active:bg-[var(--secondary-800)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
    secondary:
      "bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--surface-3)] active:bg-[var(--neutral-300)] border border-[var(--border-default)] shadow-[var(--shadow-xs)]",
    outline:
      "border-2 border-[var(--border-strong)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-1)] active:bg-[var(--surface-2)] shadow-[var(--shadow-xs)]",
    ghost:
      "bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-1)] active:bg-[var(--surface-2)]",
    danger:
      "bg-[var(--danger-600)] text-white hover:bg-[var(--danger-700)] active:bg-[var(--danger-700)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm min-h-[40px]",
    md: "px-4 py-2.5 text-base min-h-[44px]",
    lg: "px-6 py-3 text-lg min-h-[48px]",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
