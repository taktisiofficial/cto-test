"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
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
  onSubmit: (data: CreateTransactionInput | any) => Promise<void>;
  isLoading?: boolean;
}

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
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const getErrorMessage = (field: string): string => {
    return errors[field]?.[0] || "";
  };

  const dateValue = transaction
    ? new Date(transaction.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Type
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 rounded-lg px-4 py-2 transition-colors ${
              type === "expense"
                ? "bg-danger text-white"
                : "border border-gray-300 bg-white text-foreground dark:border-gray-700 dark:bg-gray-800"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 rounded-lg px-4 py-2 transition-colors ${
              type === "income"
                ? "bg-success text-white"
                : "border border-gray-300 bg-white text-foreground dark:border-gray-700 dark:bg-gray-800"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
          Description
        </label>
        <input
          id="description"
          type="text"
          name="description"
          defaultValue={transaction?.description || ""}
          required
          maxLength={255}
          className={`w-full rounded-lg border ${
            getErrorMessage("description")
              ? "border-danger"
              : "border-gray-300 dark:border-gray-700"
          } bg-white px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-800`}
          placeholder="Enter transaction description"
        />
        {getErrorMessage("description") && (
          <p className="mt-1 text-sm text-danger">
            {getErrorMessage("description")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            name="amount"
            defaultValue={transaction?.amount || ""}
            required
            step="0.01"
            min="0"
            className={`w-full rounded-lg border ${
              getErrorMessage("amount")
                ? "border-danger"
                : "border-gray-300 dark:border-gray-700"
            } bg-white px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-800`}
            placeholder="0.00"
          />
          {getErrorMessage("amount") && (
            <p className="mt-1 text-sm text-danger">
              {getErrorMessage("amount")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
            Date
          </label>
          <input
            id="date"
            type="date"
            name="date"
            defaultValue={dateValue}
            required
            className={`w-full rounded-lg border ${
              getErrorMessage("date")
                ? "border-danger"
                : "border-gray-300 dark:border-gray-700"
            } bg-white px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-800`}
          />
          {getErrorMessage("date") && (
            <p className="mt-1 text-sm text-danger">
              {getErrorMessage("date")}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-foreground mb-2">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={transaction?.categoryId || ""}
          required
          className={`w-full rounded-lg border ${
            getErrorMessage("categoryId")
              ? "border-danger"
              : "border-gray-300 dark:border-gray-700"
          } bg-white px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-800`}
        >
          <option value="">Select a category</option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {getErrorMessage("categoryId") && (
          <p className="mt-1 text-sm text-danger">
            {getErrorMessage("categoryId")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="accountId" className="block text-sm font-medium text-foreground mb-2">
          Account
        </label>
        <select
          id="accountId"
          name="accountId"
          defaultValue={transaction?.accountId || ""}
          required
          className={`w-full rounded-lg border ${
            getErrorMessage("accountId")
              ? "border-danger"
              : "border-gray-300 dark:border-gray-700"
          } bg-white px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-800`}
        >
          <option value="">Select an account</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>
        {getErrorMessage("accountId") && (
          <p className="mt-1 text-sm text-danger">
            {getErrorMessage("accountId")}
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" variant="primary" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : transaction ? "Update Transaction" : "Create Transaction"}
        </Button>
      </div>
    </form>
  );
}
