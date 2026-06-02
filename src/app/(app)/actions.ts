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
    if (!userId) return []; 

    return await db.todo.findMany({
      where: {
        userId: userId 
      },
      // 🚀 NEW: Prisma ko bolna ke Todo ke sath Category ka data bhi sath lekar aaye
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

// 3. UPDATE: Todo ka completed status badalna (With Security Check)
// 🔥 FIX: id ko 'number' kiya kyunki Prisma Int filter expect kar raha hai
export async function toggleTodo(id: number, completed: boolean) {
  try {
    const userId = await getRequiredSession();
    
    await db.todo.updateMany({
      where: { 
        id: id,      // Ab Prisma ko proper Int/number milega
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
// 🔥 FIX: id ko 'number' kiya
export async function deleteTodo(id: number) {
  try {
    const userId = await getRequiredSession();
    
    await db.todo.deleteMany({
      where: { 
        id: id,      // Ab Prisma ko proper Int/number milega
        userId: userId 
      },
    });
    
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

// 5. READ SINGLE RECORD: Ek specific todo ki detail lane ke liye (With Security Check)
// 🔥 FIX: Pure number injection aur structure clean kiya
export async function getTodoById(id: number) {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    return await db.todo.findFirst({
      where: {
        id: id,
        userId: userId
      },
      // 🚀 NEW: Single record me bhi category include karein
      include: {
        category: true
      } as any
    });
  } catch (error) {
    console.error("Error fetching single todo:", error);
    return null;
  }
}