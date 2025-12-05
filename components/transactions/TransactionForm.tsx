"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { CreateTransactionInput } from "@/lib/validations";

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
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  categoryId: string;
  accountId: string;
}

interface TransactionFormProps {
  transaction?: Transaction;
  categories: Category[];
  accounts: Account[];
  onSubmit: (data: CreateTransactionInput | Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
}

const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export function TransactionForm({
  transaction,
  categories,
  accounts,
  onSubmit,
  isLoading = false,
}: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">(
    transaction?.type || "expense"
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string),
      type,
      date: new Date(formData.get("date") as string).toISOString(),
      categoryId: formData.get("categoryId") as string,
      accountId: formData.get("accountId") as string,
    };

    try {
      await onSubmit(data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const getErrorMessage = (field: string): string => {
    return errors[field]?.[0] || "";
  };

  const dateValue = transaction
    ? new Date(transaction.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const animationClass = prefersReducedMotion()
    ? ""
    : "animate-in fade-in duration-200";

  const categoryOptions = filteredCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const accountOptions = accounts.map((acc) => ({
    value: acc.id,
    label: acc.name,
  }));

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${animationClass}`}>
      {/* Type Selection */}
      <div>
        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2.5">
          Transaction Type
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 rounded-[var(--radius-md)] px-4 py-3 font-medium transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] ${
              type === "expense"
                ? "bg-[var(--danger-600)] text-white shadow-[var(--shadow-sm)]"
                : "border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-primary)] hover:bg-[var(--surface-1)]"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 rounded-[var(--radius-md)] px-4 py-3 font-medium transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] ${
              type === "income"
                ? "bg-[var(--success-600)] text-white shadow-[var(--shadow-sm)]"
                : "border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-primary)] hover:bg-[var(--surface-1)]"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* Description */}
      <Input
        id="description"
        name="description"
        label="Description"
        type="text"
        defaultValue={transaction?.description || ""}
        required
        maxLength={255}
        placeholder="e.g., Grocery shopping, Monthly salary"
        error={getErrorMessage("description")}
        helperText={getErrorMessage("description") ? undefined : "What is this transaction for?"}
      />

      {/* Amount and Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="amount"
          name="amount"
          label="Amount"
          type="number"
          defaultValue={transaction?.amount || ""}
          required
          step="0.01"
          min="0"
          placeholder="0.00"
          inputMode="decimal"
          error={getErrorMessage("amount")}
          helperText={getErrorMessage("amount") ? undefined : "Enter the transaction amount"}
        />

        <Input
          id="date"
          name="date"
          label="Date"
          type="date"
          defaultValue={dateValue}
          required
          error={getErrorMessage("date")}
          helperText={getErrorMessage("date") ? undefined : "When did this happen?"}
        />
      </div>

      {/* Category */}
      <Select
        id="categoryId"
        name="categoryId"
        label="Category"
        options={[
          { value: "", label: "Select a category", disabled: true },
          ...categoryOptions,
        ]}
        defaultValue={transaction?.categoryId || ""}
        required
        error={getErrorMessage("categoryId")}
        helperText={getErrorMessage("categoryId") ? undefined : `Choose a ${type} category`}
      />

      {/* Account */}
      <Select
        id="accountId"
        name="accountId"
        label="Account"
        options={[
          { value: "", label: "Select an account", disabled: true },
          ...accountOptions,
        ]}
        defaultValue={transaction?.accountId || ""}
        required
        error={getErrorMessage("accountId")}
        helperText={getErrorMessage("accountId") ? undefined : "Which account is this for?"}
      />

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          size="lg"
          className="flex-1"
        >
          {isLoading ? "Saving..." : transaction ? "Update Transaction" : "Create Transaction"}
        </Button>
      </div>
    </form>
  );
}
