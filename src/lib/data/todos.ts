//This file is all about prisma Queries which Hero section will be using.

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { cacheTag } from 'next/cache';

interface GetTodosArgs {
  userId: string;
  search?: string;
  categorySlug?: string;
  page?: number;
  limit?: number;
}

export async function getCategories() {
  "use cache"
  cacheTag('categories')
  return await db.category.findMany({
    orderBy: { name: "asc" }
  });
}

export async function getFilteredTodos({ userId, search, categorySlug, page = 1, limit = 5 }: GetTodosArgs) {
  "use cache"

  cacheTag(`todos-${userId}`); // Cache tag for user-specific todos

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

export async function getTodoStats(userId: string) {
  "use cache";
  
  // Tag bilkul wahi rakhna hai jo create/delete actions mein clear ho raha hai
  cacheTag(`todos-${userId}`);

  const allTodos = await db.todo.findMany({
    where: { userId },
    select: { completed: true } // Optimization: Sirf status uthao, poora data nahi
  });

  const completedCount = allTodos.filter(t => t.completed).length;
  const pendingCount = allTodos.length - completedCount;

  return {
    totalCount: allTodos.length,
    completedCount,
    pendingCount
  };
}