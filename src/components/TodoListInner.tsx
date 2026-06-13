// src/components/TodoListInner.tsx
import React from 'react';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server'; // 🎯 Clerk core function import
import { toggleTodo, deleteTodo } from "@/app/(app)/actions";
import { getFilteredTodos } from '@/lib/data/todos';

interface TodoListInnerProps {
  search: string;
  categorySlug: string;
  page: number;
  limit: number;
}

export const TodoListSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-4 w-28 bg-muted rounded px-1" />
    <div className="space-y-2 max-h-72 overflow-hidden pr-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[74px] bg-muted/40 border border-muted rounded-lg" />
      ))}
    </div>
  </div>
);

const TodoListInner = async ({ search, categorySlug, page, limit }: TodoListInnerProps) => {
  // 🎯 Fetch dynamic session info outside the cached scope
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized access attempt.");
  }

  // 🎯 Extracted userId explicitly sent inside arguments wrapper
  const todos = await getFilteredTodos({ userId, search, categorySlug, page, limit });

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground font-mono px-1">
        Your Tasks ({todos.length})
      </h2>

      {todos.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground border border-dashed rounded-lg bg-muted/20">
          No tasks found for this page. Go back or change filters!
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {todos.map((todo) => {
            const toggleWithId = toggleTodo.bind(null, Number(todo.id), !todo.completed);
            const deleteWithId = deleteTodo.bind(null, Number(todo.id));

            return (
              <div key={Number(todo.id)} className="flex items-center justify-between bg-muted/30 border p-4 rounded-lg hover:bg-muted/50 transition-all">
                <div className="flex items-center gap-3 flex-1">
                  <form action={toggleWithId}>
                    <button
                      type="submit"
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        todo.completed ? "bg-primary border-primary text-primary-foreground" : "border-input bg-background"
                      }`}
                    >
                      {todo.completed && (
                        <svg className="w-3 h-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </form>

                  <div className="flex flex-col items-start gap-0.5">
                    <Link href={`/todo/${Number(todo.id)}`} className={`text-sm font-medium hover:underline ${todo.completed ? "line-through text-muted-foreground/70" : ""}`}>
                      {todo.title}
                    </Link>
                    {todo.category && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-mono rounded">
                        {todo.category.name}
                      </span>
                    )}
                  </div>
                </div>

                <form action={deleteWithId}>
                  <button type="submit" className="text-muted-foreground hover:text-destructive p-1.5 rounded-md hover:bg-destructive/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TodoListInner;