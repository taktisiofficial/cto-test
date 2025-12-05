"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

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

const DATE_PRESETS = [
  { label: "Today", getValue: () => new Date().toISOString().split("T")[0] },
  {
    label: "This Week",
    getValue: () => {
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      return start.toISOString().split("T")[0];
    },
  },
  {
    label: "This Month",
    getValue: () => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return start.toISOString().split("T")[0];
    },
  },
  {
    label: "Last 30 Days",
    getValue: () => {
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - 30);
      return start.toISOString().split("T")[0];
    },
  },
];

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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filteredCategories = categories.filter((cat) => !type || cat.type === type);

  const hasFilters = type || categoryId || startDate || endDate;

  const categoryOptions = filteredCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const typeOptions = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

  const applyPreset = (getValue: () => string) => {
    onStartDateChange(getValue());
    onEndDateChange(new Date().toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-4">
      {/* Quick Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {type && (
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--secondary-100)] px-3 py-1.5 text-sm font-medium text-[var(--secondary-900)]">
            {type === "income" ? "Income" : "Expense"}
            <button
              onClick={() => onTypeChange(null)}
              className="ml-1 hover:opacity-70 transition-opacity"
              aria-label="Remove type filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        {categoryId && (
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-100)] px-3 py-1.5 text-sm font-medium text-[var(--accent-700)]">
            {categories.find((c) => c.id === categoryId)?.name}
            <button
              onClick={() => onCategoryChange(null)}
              className="ml-1 hover:opacity-70 transition-opacity"
              aria-label="Remove category filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        {startDate && (
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--info-100)] px-3 py-1.5 text-sm font-medium text-[var(--info-700)]">
            From {new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            <button
              onClick={() => onStartDateChange(null)}
              className="ml-1 hover:opacity-70 transition-opacity"
              aria-label="Remove start date filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        {endDate && (
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--warning-100)] px-3 py-1.5 text-sm font-medium text-[var(--warning-700)]">
            To {new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            <button
              onClick={() => onEndDateChange(null)}
              className="ml-1 hover:opacity-70 transition-opacity"
              aria-label="Remove end date filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Filters */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Select
          label="Type"
          options={[{ value: "", label: "All Types" }, ...typeOptions]}
          value={type || ""}
          onChange={(e) => onTypeChange((e.target.value as "income" | "expense") || null)}
          placeholder="Select type"
        />

        <Select
          label="Category"
          options={[{ value: "", label: "All Categories" }, ...categoryOptions]}
          value={categoryId || ""}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          placeholder="Select category"
          disabled={!type && categoryOptions.length === 0}
        />

        <div className="flex items-end gap-2">
          {hasFilters && (
            <Button
              variant="outline"
              size="md"
              onClick={onReset}
              className="flex-1"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-2.5 rounded-[var(--radius-md)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-1)] transition-colors min-h-[44px] flex items-center justify-center gap-1"
            aria-expanded={showAdvanced}
            aria-label="Toggle advanced filters"
          >
            <span className="text-sm font-medium hidden sm:inline">Advanced</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 p-4 rounded-[var(--radius-lg)] bg-[var(--surface-1)] border border-[var(--border-default)] animate-in fade-in duration-200">
          {/* Date Presets */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Quick Ranges
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset.getValue)}
                  className="px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              type="date"
              label="Start Date"
              value={startDate || ""}
              onChange={(e) => onStartDateChange(e.target.value || null)}
              helperText="Filter from this date"
            />
            <Input
              type="date"
              label="End Date"
              value={endDate || ""}
              onChange={(e) => onEndDateChange(e.target.value || null)}
              helperText="Filter until this date"
            />
          </div>
        </div>
      )}
    </div>
  );
}
