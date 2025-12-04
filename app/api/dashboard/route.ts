import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const lastN = request.nextUrl.searchParams.get("lastN");
    const limit = lastN ? Math.min(parseInt(lastN, 10) || 10, 100) : 10;

    const [accounts, transactions] = await Promise.all([
      prisma.account.findMany(),
      prisma.transaction.findMany({
        include: {
          category: true,
          account: true,
        },
        orderBy: {
          date: "desc",
        },
        take: limit,
      }),
    ]);

    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const expenseTransactions = transactions.filter((t) => t.type === "expense");

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalIncome = incomeTransactions.reduce(
      (sum, trans) => sum + trans.amount,
      0
    );
    const totalExpense = expenseTransactions.reduce(
      (sum, trans) => sum + trans.amount,
      0
    );

    const [response, status] = apiResponse.success({
      totalBalance: Math.round(totalBalance * 100) / 100,
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpense: Math.round(totalExpense * 100) / 100,
      accounts,
      transactions,
      stats: {
        accountCount: accounts.length,
        transactionCount: transactions.length,
      },
    });

    return NextResponse.json(response, { status });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    const [response, status] = apiResponse.error(
      "Internal server error",
      500
    );
    return NextResponse.json(response, { status });
  }
}
