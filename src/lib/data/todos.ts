//This file is all about prisma Queries which Hero section will be using.

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { auth } from '@clerk/nextjs/server'; // Import your Clerk auth

interface GetTodosArgs {
  search?: string;
  categorySlug?: string;
  page?: number;
  limit?: number;
}

export async function getCategories() {
  return await db.category.findMany({
    orderBy: { name: "asc" }
  });
}

export async function getFilteredTodos({ search, categorySlug, page = 1, limit = 5 }: GetTodosArgs) {
  // 1. Enforce Multi-Tenant Isolation
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized access attempt.");
  }

  const skip = (page - 1) * limit;

  // 2. Strict Type Safety (No 'any')
  const whereClause: Prisma.TodoWhereInput = {
    userId: userId // 🛡️ Lock queries down to the logged-in user only
  };

  if (search) {
    whereClause.title = { contains: search, mode: "insensitive" };
  }
  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }

  return await db.todo.findMany({
    where: whereClause,
    take: limit,
    skip: skip,
    include: {
      category: {
        select: { name: true, slug: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}