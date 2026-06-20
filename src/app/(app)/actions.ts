"use server";

import { db } from "@/lib/db";
import { updateTag } from "next/cache";
import { auth } from "@clerk/nextjs/server";

async function getRequiredSession() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: You must be logged in to perform this action.");
  }
  return userId;
}

export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string;
  const catIdRaw = formData.get("categoryId") as string;
  const categoryId = catIdRaw ? Number(catIdRaw) : null;

  if (!title || !title.trim()) return;
  
  try {
    const userId = await getRequiredSession();
    
    await db.todo.create({
      data: { 
        title: title.trim(),
        userId,
        categoryId: categoryId ? categoryId : null
      },
    });
    updateTag(`todos-${userId}`);
  } catch (error) {
    console.error("Error creating todo:", error);
  }
}

export async function toggleTodo(id: number, completed: boolean) {
  try {
    const userId = await getRequiredSession();
    
    await db.todo.updateMany({
      where: { id: id, userId: userId },
      data: { completed: completed },
    });
    updateTag(`todos-${userId}`);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

export async function deleteTodo(id: number) {
  try {
    const userId = await getRequiredSession();
    
    await db.todo.deleteMany({
      where: { id: id, userId: userId },
    });
    updateTag(`todos-${userId}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

// 5. READ SINGLE RECORD
export async function revalidateCategories() {
  updateTag('categories')
}
