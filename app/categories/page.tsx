"use client";

import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast, ToastContainer } from "@/components/ui/Toast";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { CategoryListDesktop, CategoryListMobile } from "@/components/categories/CategoryList";
import { Plus, Tag } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
}

export default function CategoriesPage() {
  const [toasts, setToasts] = useState<Array<any>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    mutate: mutateCategories,
  } = useSWR("/api/categories", fetcher);

  const categories = categoriesData?.data?.categories || [];

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

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      const url = selectedCategory
        ? `/api/categories/${selectedCategory.id}`
        : "/api/categories";

      const method = selectedCategory ? "PUT" : "POST";

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
        throw new Error(result.message || "Failed to save category");
      }

      addToast(
        selectedCategory ? "Category updated successfully" : "Category created successfully",
        "success"
      );

      handleCloseModal();
      mutateCategories();
    } catch (error: any) {
      console.error("Error saving category:", error);
      addToast(error.message || "Failed to save category", "error");
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) return;

    setIsDeleting((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete category");
      }

      addToast("Category deleted successfully", "success");
      mutateCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      addToast(error.message || "Failed to delete category", "error");
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const incomeCategories = categories.filter((cat: Category) => cat.type === "income");
  const expenseCategories = categories.filter((cat: Category) => cat.type === "expense");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage your transaction categories
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Category</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-danger/10 text-danger">
                  Expense
                </span>
                <span className="text-gray-500">({expenseCategories.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isMobile === null ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : isMobile ? (
                <CategoryListMobile
                  categories={expenseCategories}
                  isLoading={categoriesLoading}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              ) : (
                <CategoryListDesktop
                  categories={expenseCategories}
                  isLoading={categoriesLoading}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-success/10 text-success">
                  Income
                </span>
                <span className="text-gray-500">({incomeCategories.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isMobile === null ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : isMobile ? (
                <CategoryListMobile
                  categories={incomeCategories}
                  isLoading={categoriesLoading}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              ) : (
                <CategoryListDesktop
                  categories={incomeCategories}
                  isLoading={categoriesLoading}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          selectedCategory
            ? "Edit Category"
            : "Create New Category"
        }
      >
        <CategoryForm
          category={selectedCategory || undefined}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </DashboardLayout>
  );
}
