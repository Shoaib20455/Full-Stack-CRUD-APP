// src/components/Hero.tsx
import React, { Suspense } from 'react';
import { createTodo } from "@/app/(app)/actions";
import SearchInput from './SearchInput';
import TodoListInner, { TodoListSkeleton } from './TodoListInner'; 
import { getCategories } from '@/lib/data/todos';

interface HeroProps {
  searchParams?: Promise<{ search?: string; category?: string; page?: string }>;
}

// Simple placeholder loader for the search box
const SearchInputSkeleton = () => (
  <div className="h-10 w-full bg-muted/50 border rounded-md animate-pulse" />
);

const Hero = async ({ searchParams }: HeroProps) => {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";
  const categorySlug = resolvedParams?.category || "";
  const page = Number(resolvedParams?.page) || 1;
  const limit = 5;
 
  const categories = await getCategories();

  return (
    <div className="w-full max-w-2xl bg-card text-card-foreground rounded-xl shadow-sm border p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight font-sans">Task Manager Dashboard</h1>
        <p className="text-muted-foreground text-sm font-mono">Full-Stack CRUD • Neon DB • Server Actions</p>
      </div>

      <div className="h-[1px] bg-border w-full" />
      
      {/* 🚀 FIX: Wrap SearchInput inside Suspense because it reads dynamic URL Search Params */}
      <Suspense fallback={<SearchInputSkeleton />}>
        <SearchInput />
      </Suspense>

      {/* CREATE Form */}
      <form action={createTodo} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          name="title"
          placeholder="Write a new task..."
          required
          className="flex-1 h-10 bg-background border border-input rounded-md px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <select
          name="categoryId"
          className="h-10 bg-background border border-input rounded-md px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          <option value="">No Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button type="submit" className="h-10 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow">
          Add Task
        </button>
      </form>

      {/* Beautifully Isolated Suspense Boundary */}
      <Suspense key={`${search}-${categorySlug}-${page}`} fallback={<TodoListSkeleton />}>
        <TodoListInner 
          search={search} 
          categorySlug={categorySlug} 
          page={page} 
          limit={limit} 
        />
      </Suspense>
    </div>
  );
}

export default Hero;