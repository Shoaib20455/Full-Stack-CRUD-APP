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

// 🎯 PRO REFIND: Accepts FormData directly from the HTML form now
export async function createTodo(formData: FormData) {
  // 🚀 Native Web API standard extraction
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
        // Agar dropdown se id aayi hai to map karega, warna null chorega
        categoryId: categoryId ? categoryId : null
      },
    });
    
    revalidatePath("/"); // Frontend UI ko refresh karne ke liye
  } catch (error) {
    console.error("Error creating todo:", error);
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