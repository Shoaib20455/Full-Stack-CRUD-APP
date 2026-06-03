"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Helper function: Check karta ha ke user logged in ha ya nahi.
 */
async function getRequiredSession() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: You must be logged in to perform this action.");
  }
  return userId;
}

// 🎯 UPDATED: Ab yeh function 'categoryId' bhi accept karega (optional)
export async function createTodo(title: string, categoryId?: number | null) {
  if (!title.trim()) return;
  
  try {
    const userId = await getRequiredSession();
    
    await db.todo.create({
      data: { 
        title,
        userId,
        // 🚀 NEW: Agar dropdown se id aayi hai to map karega, warna null chorega
        categoryId: categoryId ? categoryId : null
      },
    });
    
    revalidatePath("/"); // Frontend UI ko refresh karne ke liye
  } catch (error) {
    console.error("Error creating todo:", error);
  }
}

// 2. READ: SIRF is specific user ke todos layega
export async function getTodos() {
  try {
    const { userId } = await auth();
    if (!userId) return []; 

    return await db.todo.findMany({
      where: {
        userId: userId 
      },
      include: {
        category: true 
      } as any,
      orderBy: { 
        createdAt: "desc" 
      },
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

// 3. UPDATE: Todo ka completed status badalna
export async function toggleTodo(id: number, completed: boolean) {
  try {
    const userId = await getRequiredSession();
    
    await db.todo.updateMany({
      where: { 
        id: id,      
        userId: userId 
      },
      data: { 
        completed: completed 
      },
    });
    
    revalidatePath("/");
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

// 4. DELETE: Todo ko khatam karna
export async function deleteTodo(id: number) {
  try {
    const userId = await getRequiredSession();
    
    await db.todo.deleteMany({
      where: { 
        id: id,      
        userId: userId 
      },
    });
    
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

// 5. READ SINGLE RECORD
export async function getTodoById(id: number) {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    return await db.todo.findFirst({
      where: {
        id: id,
        userId: userId
      },
      include: {
        category: true
      } as any
    });
  } catch (error) {
    console.error("Error fetching single todo:", error);
    return null;
  }
}