"use client";

import { X } from "lucide-react";
import Button from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}

interface TransactionFiltersProps {
  type: "income" | "expense" | null;
  categoryId: string | null;
  startDate: string | null;
  endDate: string | null;
  categories: Category[];
  onTypeChange: (type: "income" | "expense" | null) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onStartDateChange: (date: string | null) => void;
  onEndDateChange: (date: string | null) => void;
  onReset: () => void;
}

export function TransactionFilters({
  type,
  categoryId,
  startDate,
  endDate,
  categories,
  onTypeChange,
  onCategoryChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: TransactionFiltersProps) {
  const filteredCategories = categoryId
    ? categories.filter((cat) => cat.type === type)
    : categories;

  const hasFilters = type || categoryId || startDate || endDate;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Type
          </label>
          <select
            value={type || ""}
            onChange={(e) =>
              onTypeChange(
                (e.target.value as "income" | "expense") || null
              )
            }
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category
          </label>
          <select
            value={categoryId || ""}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="">All Categories</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => onStartDateChange(e.target.value || null)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => onEndDateChange(e.target.value || null)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div className="flex items-end">
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="w-full"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          {type && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-sm text-foreground">
              {type === "income" ? "Income" : "Expense"}
              <button
                onClick={() => onTypeChange(null)}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {categoryId && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-sm text-foreground">
              {categories.find((c) => c.id === categoryId)?.name}
              <button
                onClick={() => onCategoryChange(null)}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {startDate && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-sm text-foreground">
              From {new Date(startDate).toLocaleDateString()}
              <button
                onClick={() => onStartDateChange(null)}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {endDate && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-sm text-foreground">
              To {new Date(endDate).toLocaleDateString()}
              <button
                onClick={() => onEndDateChange(null)}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
