import React from 'react'
import { createTodo, deleteTodo, toggleTodo } from "@/app/(app)/actions";
import Link from 'next/link';
import SearchInput from './SearchInput';
import { db } from '@/lib/db';

interface HeroProps {
  searchParams?: Promise<{ search?: string; category?: string }>;
}

const Hero = async ({ searchParams }: HeroProps) => {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";
  const categorySlug = resolvedParams?.category || "";

  // 1. Fetch Categories for the Dropdown (Dynamic Option)
  const categories = await db.category.findMany({
    orderBy: { name: "asc" }
  });

  // 2. Fetch Filtered Todos based on Search and Tabs
  const whereClause: any = {};
  if (search) {
    whereClause.title = { contains: search, mode: "insensitive" };
  }
  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }

  const todos = await db.todo.findMany({
    where: whereClause,
    include: {
      category: {
        select: { name: true, slug: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // 3. Server Action Handler inside Form
  async function handleCreate(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const catIdRaw = formData.get("categoryId") as string;
    
    // Convert string category ID to number for Prisma relation
    const categoryId = catIdRaw ? Number(catIdRaw) : null;
    
    await createTodo(title, categoryId);
  }

  return (
    <div className="w-full max-w-2xl bg-card text-card-foreground rounded-xl shadow-sm border p-6 md:p-8 space-y-6">
      
      {/* Header / Hero Title */}
      <div className="text-center space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight font-sans">
          Task Manager Dashboard
        </h1>
        <p className="text-muted-foreground text-sm font-mono">
          Full-Stack CRUD • Neon DB • Server Actions
        </p>
      </div>

      <div className="h-[1px] bg-border w-full" />

      {/* Advanced Filtering Search Inputs */}
      <SearchInput />

      {/* 🚀 1. CREATE Operation: Input Form + Dropdown Category Selection */}
      <form action={handleCreate} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          name="title"
          placeholder="Write a new task..."
          required
          className="flex-1 h-10 bg-background border border-input rounded-md px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
        />

        {/* 🏷️ Dynamic Category Selection Dropdown */}
        <select
          name="categoryId"
          className="h-10 bg-background border border-input rounded-md px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono transition-colors cursor-pointer"
        >
          <option value="">No Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="h-10 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow transition-colors duration-200 whitespace-nowrap"
        >
          Add Task
        </button>
      </form>

      {/* 2. READ & UPDATE/DELETE Operations: Task List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground font-mono">
            Your Tasks ({todos.length})
          </h2>
        </div>

        {todos.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground border border-dashed rounded-lg bg-muted/20">
            No tasks found. Try changing your search keywords or category tags!
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {todos.map((todo) => (
              <div
                key={Number(todo.id)}
                className="flex items-center justify-between bg-muted/30 border border-border/60 p-4 rounded-lg hover:bg-muted/50 transition-all duration-150"
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* 3. UPDATE: Toggle Checkbox */}
                  <form
                    action={async () => {
                      "use server";
                      await toggleTodo(Number(todo.id), !todo.completed);
                    }}
                  >
                    <button
                      type="submit"
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        todo.completed
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-input bg-background hover:border-primary"
                      }`}
                    >
                      {todo.completed && (
                        <svg className="w-3 h-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </form>

                  {/* Title & Category Display */}
                  <div className="flex flex-col items-start gap-0.5">
                    <Link 
                      href={`/todo/${Number(todo.id)}`} 
                      className={`text-sm font-medium transition-all hover:underline hover:text-primary ${
                        todo.completed ? "line-through text-muted-foreground/70" : "text-foreground"
                      }`}
                    >
                      {todo.title}
                    </Link>
                    
                    {/* UI Tag showing which category is selected */}
                    {todo.category && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-mono rounded">
                        {todo.category.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* 4. DELETE: Remove Button */}
                <form
                  action={async () => {
                    "use server";
                    await deleteTodo(Number(todo.id));
                  }}
                >
                  <button
                    type="submit"
                    className="text-muted-foreground hover:text-destructive p-1.5 rounded-md hover:bg-destructive/10 transition-colors duration-150"
                    title="Delete Task"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Hero;