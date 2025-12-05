"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { BarChart3 } from "lucide-react";

const SPENDING_CATEGORIES = [
  { name: "Food & Dining", amount: 856, percent: 35, color: "bg-[var(--secondary-500)]" },
  { name: "Transportation", amount: 432, percent: 20, color: "bg-[var(--accent-500)]" },
  { name: "Shopping", amount: 654, percent: 25, color: "bg-[var(--warning-500)]" },
  { name: "Entertainment", amount: 234, percent: 15, color: "bg-[var(--info-500)]" },
  { name: "Others", amount: 123, percent: 5, color: "bg-[var(--neutral-400)]" },
];

interface SpendingBreakdownProps {
  isLoading?: boolean;
}

export function SpendingBreakdown({ isLoading = false }: SpendingBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Spending Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <Skeleton variant="text" width="40%" height="16px" className="mb-2" />
                <Skeleton variant="rectangular" height="8px" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Spending Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {SPENDING_CATEGORIES.map((category) => (
            <div key={category.name}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {category.name}
                </span>
                <span className="text-sm font-semibold text-[var(--text-secondary)]">
                  {formatCurrency(category.amount)}
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
                <div
                  className={`h-full ${category.color} transition-all duration-500 ease-out`}
                  style={{ width: `${category.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <Link href="/analytics">
          <Button variant="outline" className="mt-6 w-full">
            View Detailed Analytics
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
