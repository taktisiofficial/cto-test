"use client";

import { Edit2, Trash2, Tag } from "lucide-react";
import Button from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
}

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isDeleting: Record<string, boolean>;
}

export function CategoryListDesktop({
  categories,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          No categories yet. Create your first category to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Color
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Icon
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr
              key={category.id}
              className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="px-4 py-3 text-sm text-foreground">
                {category.name}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    category.type === "income"
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {category.type}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-700"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {category.color}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {category.icon}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(category)}
                    className="rounded p-1.5 text-accent hover:bg-accent/10 transition-colors"
                    aria-label="Edit category"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(category.id)}
                    disabled={isDeleting[category.id]}
                    className="rounded p-1.5 text-danger hover:bg-danger/10 transition-colors disabled:opacity-50"
                    aria-label="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CategoryListMobile({
  categories,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          No categories yet. Create your first category to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-700 flex items-center justify-center"
                style={{ backgroundColor: category.color }}
              >
                <span className="text-white text-xs font-medium">
                  {category.icon.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-foreground">{category.name}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    category.type === "income"
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {category.type}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
            <span>Icon: {category.icon}</span>
            <span>•</span>
            <span>Color: {category.color}</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(category)}
              className="flex-1 flex items-center justify-center gap-1"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(category.id)}
              disabled={isDeleting[category.id]}
              className="flex-1 flex items-center justify-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {isDeleting[category.id] ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
