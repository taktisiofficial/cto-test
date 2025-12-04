import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { createCategorySchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      const [response, status] = apiResponse.error("Category not found", 404);
      return NextResponse.json(response, { status });
    }

    const [response, statusCode] = apiResponse.success(category);
    return NextResponse.json(response, { status: statusCode });
  } catch (error) {
    console.error(`GET /api/categories/${id} error:`, error);
    const [response, status] = apiResponse.error(
      "Internal server error",
      500
    );
    return NextResponse.json(response, { status });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      const [response, status] = apiResponse.error("Category not found", 404);
      return NextResponse.json(response, { status });
    }

    const body = await request.json();

    const parsed = createCategorySchema.safeParse(body);
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

    const { name, type, color, icon } = parsed.data;

    // Check for duplicate name+type combination (excluding current category)
    const existing = await prisma.category.findFirst({
      where: {
        name,
        type,
        NOT: {
          id,
        },
      },
    });

    if (existing) {
      const [response, status] = apiResponse.validationError({
        name: [`A ${type} category with this name already exists`],
      });
      return NextResponse.json(response, { status });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        type,
        color,
        icon,
      },
    });

    const [response, statusCode] = apiResponse.success(updatedCategory);
    return NextResponse.json(response, { status: statusCode });
  } catch (error) {
    console.error(`PUT /api/categories/${id} error:`, error);
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
  const { id } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!category) {
      const [response, status] = apiResponse.error("Category not found", 404);
      return NextResponse.json(response, { status });
    }

    // Check if category has transactions
    if (category._count.transactions > 0) {
      const [response, status] = apiResponse.error(
        `Cannot delete category with ${category._count.transactions} transaction(s). Please reassign or delete transactions first.`,
        400
      );
      return NextResponse.json(response, { status });
    }

    await prisma.category.delete({
      where: { id },
    });

    const [response, statusCode] = apiResponse.success(
      { message: "Category deleted successfully" },
      200
    );
    return NextResponse.json(response, { status: statusCode });
  } catch (error) {
    console.error(`DELETE /api/categories/${id} error:`, error);
    const [response, status] = apiResponse.error(
      "Internal server error",
      500
    );
    return NextResponse.json(response, { status });
  }
}
