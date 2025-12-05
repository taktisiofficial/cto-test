"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  HeroBalanceCard,
  KpiGrid,
  ActivityTimeline,
  SpendingBreakdown,
  QuickActions,
  ErrorBanner,
} from "@/components/dashboard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Transaction {
  id: string;
  description: string;
  date: string;
  category?: { name: string };
  type: "income" | "expense";
  amount: number;
}

interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  accounts: any[];
  transactions: Transaction[];
  stats: {
    accountCount: number;
    transactionCount: number;
  };
}

export default function Home() {
  const { data, isLoading, error, mutate } = useSWR<any>("/api/dashboard", fetcher);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dashboardData: DashboardData = data?.data || {
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    accounts: [],
    transactions: [],
    stats: {
      accountCount: 0,
      transactionCount: 0,
    },
  };

  const recentTransactions = dashboardData.transactions.slice(0, 5);
  const hasError = error && !isLoading;

  if (!isMounted) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8 scroll-smooth">
        {/* Header Section */}
        <div className="pt-2 snap-start">
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Welcome back! Here's your financial overview.
          </p>
        </div>

        {/* Error Banner */}
        {hasError && (
          <ErrorBanner onRetry={() => mutate()} />
        )}

        {/* Hero Balance Section */}
        <div className="grid gap-6 lg:grid-cols-4 snap-start">
          <HeroBalanceCard
            totalBalance={dashboardData.totalBalance}
            isLoading={isLoading}
          />
        </div>

        {/* KPI Grid Section */}
        <div className="snap-start">
          <KpiGrid
            totalIncome={dashboardData.totalIncome}
            totalExpense={dashboardData.totalExpense}
            accountCount={dashboardData.stats.accountCount}
            isLoading={isLoading}
          />
        </div>

        {/* Activity and Spending Section - Mobile stacks, Desktop 2-col */}
        <div className="grid gap-6 lg:grid-cols-2 snap-start">
          <ActivityTimeline
            transactions={recentTransactions}
            isLoading={isLoading}
          />
          <SpendingBreakdown isLoading={isLoading} />
        </div>

        {/* Quick Actions Section */}
        <div className="snap-start">
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}
