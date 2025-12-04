import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { updateTransactionSchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        account: true,
      },
    });

    if (!transaction) {
      const [response, status] = apiResponse.error(
        "Transaction not found",
        404
      );
      return NextResponse.json(response, { status });
    }

    const body = await request.json();
    const parsed = updateTransactionSchema.safeParse(body);

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

    const { description, amount, type, date, categoryId } = parsed.data;

    if (categoryId) {
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
    }

    const updateData: any = {};
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (date !== undefined) updateData.date = new Date(date);
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    let newBalance = transaction.account.balance;

    if (amount !== undefined && amount !== transaction.amount) {
      const amountDifference = amount - transaction.amount;

      if (updateData.type === undefined && transaction.type === "income") {
        newBalance += amountDifference;
      } else if (
        updateData.type === undefined &&
        transaction.type === "expense"
      ) {
        newBalance -= amountDifference;
      } else if (updateData.type === "income") {
        newBalance = newBalance - transaction.amount + amount;
      } else if (updateData.type === "expense") {
        newBalance = newBalance + transaction.amount - amount;
      }

      updateData.amount = amount;
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        account: true,
      },
    });

    if (newBalance !== transaction.account.balance) {
      await prisma.account.update({
        where: { id: transaction.accountId },
        data: { balance: newBalance },
      });
    }

    const [response, status] = apiResponse.success(updated);
    return NextResponse.json(response, { status });
  } catch (error) {
    console.error("PATCH /api/transactions/[id] error:", error);
    const [response, status] = apiResponse.error(
      "Internal server error",
      500
    );
    return NextResponse.json(response, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        account: true,
      },
    });

    if (!transaction) {
      const [response, status] = apiResponse.error(
        "Transaction not found",
        404
      );
      return NextResponse.json(response, { status });
    }

    const accountId = transaction.accountId;
    const accountType = transaction.type;
    const amount = transaction.amount;

    await prisma.transaction.delete({
      where: { id },
    });

    const newBalance =
      accountType === "income"
        ? transaction.account.balance - amount
        : transaction.account.balance + amount;

    await prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });

    const [response, status] = apiResponse.success(
      { message: "Transaction deleted successfully" },
      200
    );
    return NextResponse.json(response, { status });
  } catch (error) {
    console.error("DELETE /api/transactions/[id] error:", error);
    const [response, status] = apiResponse.error(
      "Internal server error",
      500
    );
    return NextResponse.json(response, { status });
  }
}
