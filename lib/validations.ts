import { z } from "zod";

export const createTransactionSchema = z.object({
  description: z.string().min(1, "Description is required").max(255),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"], { message: "Type must be income or expense" }),
  date: z.string().datetime("Invalid date format").or(z.date()),
  categoryId: z.string().min(1, "Category ID is required"),
  accountId: z.string().min(1, "Account ID is required"),
});

export const updateTransactionSchema = z.object({
  description: z.string().min(1, "Description is required").max(255).optional(),
  amount: z.number().positive("Amount must be positive").optional(),
  type: z.enum(["income", "expense"]).optional(),
  date: z.string().datetime().or(z.date()).optional(),
  categoryId: z.string().min(1, "Category ID is required").optional(),
});

export const transactionFiltersSchema = z.object({
  type: z.enum(["income", "expense"]).optional(),
  categoryId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().positive().max(100).default(20),
  offset: z.coerce.number().nonnegative().default(0),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(255),
  type: z.enum(["income", "expense"]).default("expense"),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, "Invalid color format").default("#3b82f6"),
  icon: z.string().default("tag"),
});

export const createAccountSchema = z.object({
  name: z.string().min(1, "Account name is required").max(255),
  type: z.enum(["checking", "savings", "credit"]).default("checking"),
  currency: z.string().length(3).default("USD"),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionFiltersInput = z.infer<typeof transactionFiltersSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
