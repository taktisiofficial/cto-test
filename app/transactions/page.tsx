"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import useSWR from "swr";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ToastContainer } from "@/components/ui/Toast";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionListDesktop, TransactionListMobile } from "@/components/transactions/TransactionList";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { Plus, X } from "lucide-react";
import type { CreateTransactionInput } from "@/lib/validations";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  title?: string;
  onClose: () => void;
}

export default function TransactionsPage() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [type, setType] = useState<"income" | "expense" | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info", title?: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, message, type, title, onClose: () => {} }]);
      setTimeout(() => removeToast(id), 5000);
    },
    [removeToast]
  );

  // Load categories
  const { data: categoriesData, isLoading: categoriesLoading } = useSWR(
    "/api/categories",
    fetcher
  );

  // Load accounts
  const { data: accountsData, isLoading: accountsLoading } = useSWR(
    "/api/accounts",
    fetcher
  );

  // Build query params
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (categoryId) params.append("categoryId", categoryId);
    if (startDate) params.append("startDate", new Date(startDate).toISOString());
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      params.append("endDate", endDateTime.toISOString());
    }
    params.append("limit", "100");
    return params.toString();
  }, [type, categoryId, startDate, endDate]);

  // Load transactions
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    mutate: mutateTransactions,
  } = useSWR(
    `/api/transactions?${queryParams}`,
    fetcher
  );

  const categories = categoriesData?.data?.categories || [];
  const accounts = accountsData?.data?.accounts || [];
  const transactions = transactionsData?.data?.transactions || [];

  // Detect mobile
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      setIsMobile(mediaQuery.matches);
      const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const handleOpenModal = (transaction?: Transaction) => {
    if (transaction) {
      setSelectedTransaction(transaction);
    } else {
      setSelectedTransaction(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleSubmit = async (data: CreateTransactionInput | Record<string, unknown>) => {
    try {
      const url = selectedTransaction
        ? `/api/transactions/${selectedTransaction.id}`
        : "/api/transactions";

      const method = selectedTransaction ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json() as {
        errors?: Record<string, string[]>;
        message?: string;
      };

      if (!response.ok) {
        if (result.errors) {
          const errorValues = Object.values(result.errors);
          throw new Error((errorValues[0] as string[])?.[0] || "Failed to save");
        }
        throw new Error(result.message || "Failed to save transaction");
      }

      addToast(
        selectedTransaction ? "Transaction updated" : "Transaction created",
        "success"
      );

      handleCloseModal();
      mutateTransactions();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("Error saving transaction:", err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    setIsDeleting((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      addToast("Transaction deleted", "success");
      mutateTransactions();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("Error deleting transaction:", err);
      addToast("Failed to delete transaction", "error");
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReset = () => {
    setType(null);
    setCategoryId(null);
    setStartDate(null);
    setEndDate(null);
  };

  const isLoading = categoriesLoading || accountsLoading || transactionsLoading;
  const hasFilters = type || categoryId || startDate || endDate;

  return (
    <DashboardLayout>
      <div className="space-y-0">
        {/* Header */}
        <div className="px-4 pt-6 pb-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">Transactions</h1>
              <p className="mt-1 text-[var(--text-secondary)]">
                Manage and view all your transactions
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-0 z-30 bg-[var(--surface-base)] border-b border-[var(--border-default)] px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {type && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--danger-100)] px-2.5 py-1 text-xs font-medium text-[var(--danger-700)] flex-shrink-0">
                    {type === "income" ? "Income" : "Expense"}
                    <button onClick={() => setType(null)} className="hover:opacity-70">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {categoryId && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-100)] px-2.5 py-1 text-xs font-medium text-[var(--accent-700)] flex-shrink-0">
                    {categories.find((c: Category) => c.id === categoryId)?.name}
                    <button onClick={() => setCategoryId(null)} className="hover:opacity-70">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {startDate && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--info-100)] px-2.5 py-1 text-xs font-medium text-[var(--info-700)] flex-shrink-0">
                    From {new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    <button onClick={() => setStartDate(null)} className="hover:opacity-70">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {endDate && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warning-100)] px-2.5 py-1 text-xs font-medium text-[var(--warning-700)] flex-shrink-0">
                    To {new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    <button onClick={() => setEndDate(null)} className="hover:opacity-70">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {hasFilters && (
                  <button
                    onClick={handleReset}
                    className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors ml-auto sm:ml-0"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                className="hidden md:inline-flex p-2 rounded-[var(--radius-md)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-1)] transition-colors"
                title="Toggle filters"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Drawer (Desktop) */}
        {isFilterDrawerOpen && (
          <div className="hidden md:block bg-[var(--surface-1)] border-b border-[var(--border-default)] px-6 lg:px-8 py-4">
            <TransactionFilters
              type={type}
              categoryId={categoryId}
              startDate={startDate}
              endDate={endDate}
              categories={categories}
              onTypeChange={setType}
              onCategoryChange={setCategoryId}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <Card>
            <CardContent>
              <div className="space-y-4">
                {/* Mobile Filters */}
                {isMobile && (
                  <div className="md:hidden">
                    <TransactionFilters
                      type={type}
                      categoryId={categoryId}
                      startDate={startDate}
                      endDate={endDate}
                      categories={categories}
                      onTypeChange={setType}
                      onCategoryChange={setCategoryId}
                      onStartDateChange={setStartDate}
                      onEndDateChange={setEndDate}
                      onReset={handleReset}
                    />
                  </div>
                )}

                {/* Transaction Count */}
                {!isLoading && (
                  <div className="text-sm font-medium text-[var(--text-secondary)]">
                    {transactions.length > 0
                      ? `${transactions.length} Transaction${
                          transactions.length !== 1 ? "s" : ""
                        }`
                      : "No transactions"}
                  </div>
                )}

                {/* Transaction List */}
                {isMobile === null ? (
                  <div className="text-center py-8 text-[var(--text-tertiary)]">Loading...</div>
                ) : isMobile ? (
                  <TransactionListMobile
                    transactions={transactions}
                    isLoading={isLoading}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                  />
                ) : (
                  <TransactionListDesktop
                    transactions={transactions}
                    isLoading={isLoading}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal for Add/Edit Transaction */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          selectedTransaction
            ? "Edit Transaction"
            : "Create New Transaction"
        }
      >
        {(categoriesLoading || accountsLoading) ? (
          <div className="py-8 text-center text-[var(--text-tertiary)]">Loading...</div>
        ) : (
          <TransactionForm
            transaction={selectedTransaction || undefined}
            categories={categories}
            accounts={accounts}
            onSubmit={handleSubmit}
          />
        )}
      </Modal>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </DashboardLayout>
  );
}
