"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import useSWR from "swr";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast, ToastContainer } from "@/components/ui/Toast";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionListDesktop, TransactionListMobile } from "@/components/transactions/TransactionList";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { Plus } from "lucide-react";
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

export default function TransactionsPage() {
  const [toasts, setToasts] = useState<Array<any>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [type, setType] = useState<"income" | "expense" | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

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
  useState(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      setIsMobile(mediaQuery.matches);
      const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  });

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

  const handleSubmit = async (data: CreateTransactionInput | any) => {
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

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const errorValues = Object.values(result.errors);
          throw new Error((errorValues[0] as any)?.[0] || "Failed to save");
        }
        throw new Error(result.message || "Failed to save transaction");
      }

      addToast(
        selectedTransaction ? "Transaction updated" : "Transaction created",
        "success"
      );

      handleCloseModal();
      mutateTransactions();
    } catch (error: any) {
      console.error("Error saving transaction:", error);
      throw error;
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
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage and view all your transactions
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Transaction</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {transactions.length > 0
                ? `${transactions.length} Transaction${
                    transactions.length !== 1 ? "s" : ""
                  }`
                : "Transactions"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isMobile === null ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
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
          </CardContent>
        </Card>
      </div>

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
          <div className="py-8 text-center text-gray-500">Loading...</div>
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
