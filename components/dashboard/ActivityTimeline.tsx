"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyStateCard } from "@/components/ui/EmptyState";
import { Activity } from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  date: string;
  category?: { name: string };
  type: "income" | "expense";
  amount: number;
}

interface ActivityTimelineProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function ActivityTimeline({
  transactions,
  isLoading = false,
}: ActivityTimelineProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-b border-[var(--border-default)] pb-4 last:border-0 last:pb-0">
                <Skeleton variant="text" width="70%" height="18px" className="mb-2" />
                <Skeleton variant="text" width="40%" height="14px" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyStateCard
            icon={Activity}
            title="No transactions yet"
            description="Start by adding your first transaction to see activity here"
            action={{
              label: "Add Transaction",
              onClick: () => {},
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`flex items-center justify-between py-4 ${
                index < transactions.length - 1
                  ? "border-b border-[var(--border-default)]"
                  : ""
              }`}
            >
              <div className="flex-1">
                <p className="font-medium text-[var(--text-primary)]">
                  {transaction.description}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {formatDate(transaction.date)} • {transaction.category?.name || "Uncategorized"}
                </p>
              </div>
              <span
                className={`whitespace-nowrap font-semibold ml-4 ${
                  transaction.type === "income"
                    ? "text-[var(--success-600)]"
                    : "text-[var(--danger-600)]"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          ))}
        </div>
        <Link href="/transactions" className="block mt-6">
          <Button variant="outline" className="w-full">
            View All Transactions
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
