interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
  count?: number;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseStyles =
    "animate-pulse bg-gradient-to-r from-[var(--surface-2)] via-[var(--surface-3)] to-[var(--surface-2)] bg-[length:200%_100%]";

  const variants = {
    text: "h-4 rounded-[var(--radius-sm)]",
    circular: "rounded-full",
    rectangular: "rounded-[var(--radius-md)]",
  };

  const style = {
    width: width || (variant === "text" ? "100%" : undefined),
    height:
      height || (variant === "text" ? undefined : variant === "circular" ? "40px" : "100px"),
  };

  if (count > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            style={style}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
      aria-hidden="true"
      role="status"
      aria-label="Loading"
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] bg-[var(--surface-base)] p-6 border border-[var(--border-subtle)] ${className}`}
    >
      <Skeleton variant="text" width="60%" height="24px" className="mb-4" />
      <Skeleton variant="text" count={3} className="mb-2" />
      <div className="flex gap-2 mt-4">
        <Skeleton variant="rectangular" width="80px" height="36px" />
        <Skeleton variant="rectangular" width="80px" height="36px" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full">
      <div className="border border-[var(--border-default)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="bg-[var(--surface-1)] p-4 border-b border-[var(--border-default)]">
          <div className="flex gap-4">
            <Skeleton variant="text" width="20%" height="20px" />
            <Skeleton variant="text" width="30%" height="20px" />
            <Skeleton variant="text" width="25%" height="20px" />
            <Skeleton variant="text" width="15%" height="20px" />
          </div>
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="p-4 border-b border-[var(--border-default)] last:border-b-0"
          >
            <div className="flex gap-4">
              <Skeleton variant="text" width="20%" />
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="25%" />
              <Skeleton variant="text" width="15%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
