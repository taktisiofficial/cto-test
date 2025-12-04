import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { createCategorySchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type");

    const where = type ? { type: type as "income" | "expense" } : undefined;

    const categories = await prisma.category.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    const [response, status] = apiResponse.success({
      categories,
      count: categories.length,
    });

    return NextResponse.json(response, { status });
  } catch (error) {
    console.error("GET /api/categories error:", error);
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

    const existing = await prisma.category.findFirst({
      where: {
        name,
        type,
      },
    });

    if (existing) {
      const [response, status] = apiResponse.validationError({
        name: [`A ${type} category with this name already exists`],
      });
      return NextResponse.json(response, { status });
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        color,
        icon,
      },
    });

    const [response, statusCode] = apiResponse.success(category, 201);
    return NextResponse.json(response, { status: statusCode });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    const [response, status] = apiResponse.error(
      "Internal server error",
      500
    );
    return NextResponse.json(response, { status });
  }
}
