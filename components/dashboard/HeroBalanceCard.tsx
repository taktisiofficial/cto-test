"use client";

import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

interface HeroBalanceCardProps {
  totalBalance: number;
  isLoading?: boolean;
}

export function HeroBalanceCard({ totalBalance, isLoading = false }: HeroBalanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card variant="elevated" className="lg:col-span-2">
        <CardContent>
          <div className="space-y-4">
            <Skeleton variant="text" width="40%" height="20px" />
            <Skeleton variant="text" width="60%" height="32px" />
            <Skeleton variant="text" width="30%" height="20px" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="lg:col-span-2 bg-gradient-to-br from-[var(--secondary-500)] to-[var(--secondary-600)] text-white overflow-hidden">
      <CardContent className="relative">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="relative z-10">
          <p className="text-sm font-medium text-white/80">Total Balance</p>
          <h2 className="mt-2 text-4xl font-bold">{formatCurrency(totalBalance)}</h2>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            <span>+12.5% this month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
