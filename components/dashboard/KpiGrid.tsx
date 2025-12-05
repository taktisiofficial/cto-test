"use client";

import { TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

interface KpiGridProps {
  totalIncome: number;
  totalExpense: number;
  accountCount: number;
  isLoading?: boolean;
}

export function KpiGrid({
  totalIncome,
  totalExpense,
  accountCount,
  isLoading = false,
}: KpiGridProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent>
              <div className="space-y-3">
                <Skeleton variant="text" width="50%" height="16px" />
                <Skeleton variant="text" width="70%" height="28px" />
                <Skeleton variant="text" width="40%" height="16px" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Total Income
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
              {formatCurrency(totalIncome)}
            </h3>
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--success-50)] px-2 py-1 text-xs font-medium text-[var(--success-600)]">
              <TrendingUp className="h-3 w-3" />
              <span>+8.2%</span>
            </div>
          </div>
          <div className="rounded-full bg-[var(--success-100)] p-3">
            <TrendingUp className="h-6 w-6 text-[var(--success-600)]" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Total Expenses
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
              {formatCurrency(totalExpense)}
            </h3>
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--danger-50)] px-2 py-1 text-xs font-medium text-[var(--danger-600)]">
              <TrendingDown className="h-3 w-3" />
              <span>-3.1%</span>
            </div>
          </div>
          <div className="rounded-full bg-[var(--danger-100)] p-3">
            <TrendingDown className="h-6 w-6 text-[var(--danger-600)]" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Active Accounts
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
              {accountCount}
            </h3>
            <p className="mt-3 text-xs text-[var(--text-tertiary)]">
              All active
            </p>
          </div>
          <div className="rounded-full bg-[var(--accent-100)] p-3">
            <CreditCard className="h-6 w-6 text-[var(--accent-600)]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
