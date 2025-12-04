"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
}

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function CategoryForm({
  category,
  onSubmit,
  isLoading = false,
}: CategoryFormProps) {
  const [type, setType] = useState<"income" | "expense">(
    category?.type || "expense"
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      type,
      color: formData.get("color") as string,
      icon: formData.get("icon") as string,
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
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          defaultValue={category?.name || ""}
          required
          maxLength={255}
          className={`w-full rounded-lg border ${
            getErrorMessage("name")
              ? "border-danger"
              : "border-gray-300 dark:border-gray-700"
          } bg-white px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-800`}
          placeholder="e.g., Groceries, Salary, etc."
        />
        {getErrorMessage("name") && (
          <p className="mt-1 text-sm text-danger">
            {getErrorMessage("name")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-foreground mb-2">
            Color
          </label>
          <input
            id="color"
            type="color"
            name="color"
            defaultValue={category?.color || "#3b82f6"}
            required
            className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer"
          />
          {getErrorMessage("color") && (
            <p className="mt-1 text-sm text-danger">
              {getErrorMessage("color")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-foreground mb-2">
            Icon
          </label>
          <input
            id="icon"
            type="text"
            name="icon"
            defaultValue={category?.icon || "tag"}
            required
            maxLength={50}
            className={`w-full rounded-lg border ${
              getErrorMessage("icon")
                ? "border-danger"
                : "border-gray-300 dark:border-gray-700"
            } bg-white px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-800`}
            placeholder="e.g., tag, shopping-cart"
          />
          {getErrorMessage("icon") && (
            <p className="mt-1 text-sm text-danger">
              {getErrorMessage("icon")}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" variant="primary" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : category ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
