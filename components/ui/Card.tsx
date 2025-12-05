import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "elevated" | "outlined" | "flat";
  className?: string;
}

export function Card({ children, variant = "elevated", className = "" }: CardProps) {
  const variants = {
    elevated:
      "rounded-[var(--radius-lg)] bg-[var(--surface-base)] shadow-[var(--shadow-md)] border border-[var(--border-subtle)]",
    outlined:
      "rounded-[var(--radius-lg)] bg-[var(--surface-base)] border-2 border-[var(--border-default)]",
    flat: "rounded-[var(--radius-lg)] bg-[var(--surface-1)]",
  };

  return (
    <div
      className={`${variants[variant]} p-6 transition-shadow duration-[var(--duration-base)] ease-[var(--ease-out)] ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold text-[var(--text-primary)] ${className}`}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-[var(--border-default)] ${className}`}>
      {children}
    </div>
  );
}
