import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { createAccountSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const accounts = await prisma.account.findMany({
      include: {
        transactions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const [response, status] = apiResponse.success({
      accounts: accounts.map((acc) => ({
        ...acc,
        transactionCount: acc.transactions.length,
        transactions: undefined,
      })),
      count: accounts.length,
    });

    return NextResponse.json(response, { status });
  } catch (error) {
    console.error("GET /api/accounts error:", error);
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

    const parsed = createAccountSchema.safeParse(body);
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

    const { name, type, currency } = parsed.data;

    const account = await prisma.account.create({
      data: {
        name,
        type,
        currency,
        balance: 0,
      },
    });

    const [response, statusCode] = apiResponse.success(account, 201);
    return NextResponse.json(response, { status: statusCode });
  } catch (error) {
    console.error("POST /api/accounts error:", error);
    const [response, status] = apiResponse.error(
      "Internal server error",
      500
    );
    return NextResponse.json(response, { status });
  }
}
