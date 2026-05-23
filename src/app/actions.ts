"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Helper function: Check karta ha ke user logged in ha ya nahi.
 * Agar logged in ho to uski Clerk userId return karta ha, warna error throw karta ha.
 */
async function getRequiredSession() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: You must be logged in to perform this action.");
  }
  return userId;
}

// 1. CREATE: Naya Todo sirf logged-in user ki ID ke sath store hoga
export async function createTodo(title: string) {
  if (!title.trim()) return;
  
  try {
    const userId = await getRequiredSession();
    
    await db.todo.create({
      data: { 
        title,
        userId // Database ke naye userId column me Clerk ID chali jaye gi
      },
    });
    
    revalidatePath("/"); // Frontend UI ko refresh karne ke liye
  } catch (error) {
    console.error("Error creating todo:", error);
  }
}

// 2. READ: Saare web platform ke todos nahi, balkey SIRF is specific user ke todos layega
export async function getTodos() {
  try {
    const { userId } = await auth();
    // Agar user login nahi ha, to database query karne ki zaroorat hi nahi, khali list bhej do
    if (!userId) return []; 

    return await db.todo.findMany({
      where: {
        userId: userId // SQL: WHERE userId = 'current_user_id'
      },
      orderBy: { 
        createdAt: "desc" 
      },
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

// 3. UPDATE: Todo ka completed status badalna (With Security Check)
export async function toggleTodo(id: string, completed: boolean) {
  try {
    const userId = await getRequiredSession();
    
    // updateMany isiliye use kiya taake condition me id aur userId dono check ho sakein
    // Is se koi bhi user URL/ID guess kar ke kisi dusre ke todo ko check/uncheck nahi kar sakta
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

// 4. DELETE: Todo ko khatam karna (With Security Check)
export async function deleteTodo(id: string) {
  try {
    const userId = await getRequiredSession();
    
    // deleteMany se ensure hoga ke sirf wahi todo delete ho jo isi logged-in user ka ho
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
// 5. READ SINGLE RECORD: Ek specific todo ki detail lane ke liye (With Security Check)
export async function getTodoById(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    // findFirst use karenge taake id aur userId dono strictly check hon
    return await db.todo.findFirst({
      where: {
        id: id,
        userId: userId // Ensure ke koi doosra user kisi aur ki ID guess karke access na kare
      },
    });
  } catch (error) {
    console.error("Error fetching single todo:", error);
    return null;
  }
}