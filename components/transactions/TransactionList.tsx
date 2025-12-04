"use client";

import { Trash2, Edit2 } from "lucide-react";
import Button from "@/components/ui/Button";

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
    year: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function TransactionListDesktop({ transactions, isLoading, onEdit, onDelete, isDeleting = {} }: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div className="p-6 text-center text-gray-500">Loading transactions...</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div className="p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-2">No transactions found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Start by creating your first transaction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Account</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Amount</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-sm text-foreground">{transaction.description}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-foreground">
                    {transaction.category.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{transaction.account.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(transaction.date)}
                </td>
                <td className={`px-6 py-4 text-sm font-semibold text-right ${
                  transaction.type === "income"
                    ? "text-success"
                    : "text-danger"
                }`}>
                  {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      disabled={isDeleting[transaction.id]}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-danger" />
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
        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4 text-center text-gray-500">
          Loading transactions...
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg bg-white dark:bg-gray-900 p-6 text-center border border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400 mb-2">No transactions found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">Start by creating your first transaction</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="font-medium text-foreground">{transaction.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(transaction.date)} • {transaction.account.name}
              </p>
            </div>
            <span className={`font-semibold text-sm ${
              transaction.type === "income"
                ? "text-success"
                : "text-danger"
            }`}>
              {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-foreground">
              {transaction.category.name}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(transaction)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="Edit"
              >
                <Edit2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => onDelete(transaction.id)}
                disabled={isDeleting[transaction.id]}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete"
              >
                <Trash2 className="h-4 w-4 text-danger" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
