"use client";

import { Trash2, Edit2 } from "lucide-react";
import { SkeletonTable } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
}

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  categoryId: string;
  accountId: string;
  category: Category;
  account: Account;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (transaction?: Transaction) => void;
  onDelete: (id: string) => void;
  isDeleting?: Record<string, boolean>;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const getCategoryColor = (type: "income" | "expense"): string => {
  return type === "income" ? "bg-[var(--success-100)]" : "bg-[var(--danger-100)]";
};

const getCategoryTextColor = (type: "income" | "expense"): string => {
  return type === "income" ? "text-[var(--success-700)]" : "text-[var(--danger-700)]";
};

const getCategoryInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

export function TransactionListDesktop({ transactions, isLoading, onEdit, onDelete, isDeleting = {} }: TransactionListProps) {
  if (isLoading) {
    return <SkeletonTable rows={6} />;
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Create your first transaction to get started"
        className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-base)]"
      />
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-base)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0">
            <tr className="border-b border-[var(--border-default)] bg-[var(--surface-1)]">
              <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">Account</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">Date</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-[var(--text-primary)]">Amount</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-[var(--text-primary)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {transactions.map((transaction, idx) => (
              <tr
                key={transaction.id}
                className={`transition-colors ${
                  idx % 2 === 0
                    ? "bg-[var(--surface-base)] hover:bg-[var(--surface-1)]"
                    : "bg-[var(--surface-1)] hover:bg-[var(--surface-2)]"
                }`}
              >
                <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">{transaction.description}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${getCategoryColor(
                        transaction.type
                      )} ${getCategoryTextColor(transaction.type)}`}
                    >
                      {getCategoryInitial(transaction.category.name)}
                    </div>
                    <span className="text-[var(--text-primary)]">{transaction.category.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{transaction.account.name}</td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                  {formatDate(transaction.date)}
                </td>
                <td
                  className={`px-6 py-4 text-sm font-semibold text-right ${
                    transaction.type === "income"
                      ? "text-[var(--success-600)]"
                      : "text-[var(--danger-600)]"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-2 hover:bg-[var(--surface-2)] rounded-[var(--radius-md)] transition-colors"
                      title="Edit transaction"
                      aria-label="Edit transaction"
                    >
                      <Edit2 className="h-4 w-4 text-[var(--text-secondary)]" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      disabled={isDeleting[transaction.id]}
                      className="p-2 hover:bg-[var(--surface-2)] rounded-[var(--radius-md)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete transaction"
                      aria-label="Delete transaction"
                    >
                      <Trash2 className="h-4 w-4 text-[var(--danger-600)]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TransactionListMobile({ transactions, isLoading, onEdit, onDelete, isDeleting = {} }: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-[var(--radius-lg)] bg-[var(--surface-1)] p-4 h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Create your first transaction to get started"
        className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-base)]"
      />
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="rounded-[var(--radius-lg)] border-l-4 border-l-[var(--border-default)] border border-[var(--border-default)] bg-[var(--surface-base)] p-3 flex items-start justify-between gap-3 active:bg-[var(--surface-1)] transition-colors"
          style={{
            borderLeftColor:
              transaction.type === "income"
                ? "var(--success-500)"
                : "var(--danger-500)",
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${getCategoryColor(
                  transaction.type
                )} ${getCategoryTextColor(transaction.type)}`}
              >
                {getCategoryInitial(transaction.category.name)}
              </div>
              <p className="font-medium text-[var(--text-primary)] truncate text-sm">
                {transaction.description}
              </p>
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              {formatDate(transaction.date)} • {transaction.account.name}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span
              className={`font-semibold text-sm whitespace-nowrap ${
                transaction.type === "income"
                  ? "text-[var(--success-600)]"
                  : "text-[var(--danger-600)]"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => onEdit(transaction)}
                className="p-1.5 hover:bg-[var(--surface-1)] rounded transition-colors"
                title="Edit"
                aria-label="Edit transaction"
              >
                <Edit2 className="h-4 w-4 text-[var(--text-secondary)]" />
              </button>
              <button
                onClick={() => onDelete(transaction.id)}
                disabled={isDeleting[transaction.id]}
                className="p-1.5 hover:bg-[var(--surface-1)] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete"
                aria-label="Delete transaction"
              >
                <Trash2 className="h-4 w-4 text-[var(--danger-600)]" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
