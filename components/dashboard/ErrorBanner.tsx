"use client";

import { AlertCircle, RotateCw } from "lucide-react";
import Button from "@/components/ui/Button";

interface ErrorBannerProps {
  onRetry?: () => void;
}

export function ErrorBanner({ onRetry }: ErrorBannerProps) {
  return (
    <div className="rounded-lg bg-[var(--danger-50)] border border-[var(--danger-200)] p-4 flex items-start gap-4">
      <AlertCircle className="h-5 w-5 text-[var(--danger-600)] flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold text-[var(--danger-900)]">
          Unable to load dashboard
        </h3>
        <p className="text-sm text-[var(--danger-700)] mt-1">
          There was an error fetching your financial data. Please try again.
        </p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <RotateCw className="h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
