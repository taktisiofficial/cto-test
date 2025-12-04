import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import {
  createTransactionSchema,
  transactionFiltersSchema,
} from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = Object.fromEntries(searchParams.entries());

    const parsed = transactionFiltersSchema.safeParse(params);
    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      parsed.error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (!errors[path]) errors[path] = [];
        errors[path].push(err.message);
      });
      const [response, status] = apiResponse.validationError(errors);
      return NextResponse.json(response, { status });
    }

    const { type, categoryId, startDate, endDate, search, limit, offset } =
      parsed.data;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    if (search) {
      where.description = {
        contains: search,
      };
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: true,
          account: true,
        },
        orderBy: {
          date: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.transaction.count({ where }),
    ]);

    const [response, status] = apiResponse.success({
      transactions,
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit),
      },
    });

    return NextResponse.json(response, { status });
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    const [response, status] = apiResponse.error(
      "Internal server error",
      500
    );
    return NextResponse.json(response, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createTransactionSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      parsed.error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (!errors[path]) errors[path] = [];
        errors[path].push(err.message);
      });
      const [response, status] = apiResponse.validationError(errors);
      return NextResponse.json(response, { status });
    }

    const { description, amount, type, date, categoryId, accountId } =
      parsed.data;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      const [response, status] = apiResponse.error(
        "Category not found",
        404
      );
      return NextResponse.json(response, { status });
    }

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      const [response, status] = apiResponse.error(
        "Account not found",
        404
      );
      return NextResponse.json(response, { status });
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount,
        type,
        date: new Date(date),
        categoryId,
        accountId,
      },
      include: {
        category: true,
        account: true,
      },
    });

    const newBalance =
      type === "income"
        ? account.balance + amount
        : account.balance - amount;

    await prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });

    const [response, status] = apiResponse.success(transaction, 201);
    return NextResponse.json(response, { status });
  } catch (error) {
    console.error("POST /api/transactions error:", error);
    const [response, status] = apiResponse.error(
      "Internal server error",
      500
    );
    return NextResponse.json(response, { status });
  }
}
