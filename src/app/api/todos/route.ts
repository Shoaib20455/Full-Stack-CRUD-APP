import { NextRequest, NextResponse } from "next/server";
// Apne project ke mutabiq prisma client ka path exact check kar lein (e.g., @/lib/prisma ya jahan bhi db instance hai)
import { db } from "@/lib/db"; 

export async function GET(request: NextRequest) {
  try {
    // 1. URL se search query aur category parameters nikalna
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const categorySlug = searchParams.get("category");

    // 2. Dynamic filter object banana
    const whereClause: any = {};

    // 🔍 TEXT SEARCH LOGIC: Title me text dhoondo (Case-Insensitive)
    if (search) {
      whereClause.title = {
        contains: search,
        mode: "insensitive", 
      };
    }

    // 🏷️ CATEGORY FILTER LOGIC: Category table ke slug se match karo
    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    // 3. Database se filtering data select karna Prisma ke through
    const todos = await db.todo.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Taake naye tasks hamesha top par dikhein
      },
    });

    return NextResponse.json({ success: true, data: todos }, { status: 200 });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}