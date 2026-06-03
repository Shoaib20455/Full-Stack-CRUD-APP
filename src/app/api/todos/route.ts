import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; 

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const categorySlug = searchParams.get("category");
    
    // 📄 PAGINATION PARAMS: URL se page number nikalna (Default page = 1)
    const page = Number(searchParams.get("page")) || 1;
    const limit = 5; // Ek page par sirf 5 tasks dikhein ge (Performance Boost)
    const skip = (page - 1) * limit; // Kitne records chorney hain

    const whereClause: any = {};

    if (search) {
      whereClause.title = {
        contains: search,
        mode: "insensitive", 
      };
    }

    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    // 🚀 PERFORMANCE OPTIMIZATION: 
    // 1. Total filtered tasks count karna (Pagination metadata ke liye)
    const totalTodos = await db.todo.count({ where: whereClause });

    // 2. Database se sirf specific chunk mangwana using take & skip
    const todos = await db.todo.findMany({
      where: whereClause,
      take: limit, // Sirf 5 records uthao
      skip: skip,  // Shuruati records skip karo based on page number
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Metadata ke sath total pages calculate karna
    const totalPages = Math.ceil(totalTodos / limit);

    return NextResponse.json({ 
      success: true, 
      data: todos,
      pagination: {
        currentPage: page,
        totalPages,
        totalTodos,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}