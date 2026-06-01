import { getTodoById } from "../../actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ShieldCheck, Tag } from "lucide-react";

interface TodoDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TodoDetailPage({ params }: TodoDetailPageProps) {
  const { id } = await params;
  // 🔥 FIX: id ko Number mein convert kiya kyunki hamara database ab Int accept karta hai
  const todoId = Number(id);

  // Agar URL mein integer na ho (e.g. /todo/abc), to direct 404 dikhao
  if (isNaN(todoId)) {
    notFound();
  }
  // Database se us specific ID ka data fetch kar rahe hain
  const todo = await getTodoById(todoId);

  // Agar task database mein nahi mila ya user ka apna nahi hai to direct 404 page dikhao
  if (!todo) {
    notFound();
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-xl border bg-card text-card-foreground rounded-xl shadow-sm p-6 md:p-8 space-y-6">
        
        {/* Back Link Button */}
        <div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="h-[1px] bg-border w-full" />

        {/* Task Title / Status Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
              todo.completed 
                ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
            }`}>
              {todo.completed ? "Completed" : "Pending"}
            </span>
          </div>
          
          <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${
            todo.completed ? "line-through text-muted-foreground/70" : "text-foreground"
          }`}>
            {todo.title}
          </h1>
        </div>

        {/* Database Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 border border-border/40 rounded-lg p-4 font-sans text-sm">
          
          <div className="flex items-start gap-2.5 text-muted-foreground">
            <Tag className="w-4 h-4 mt-0.5 text-primary" />
            <div>
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">Task ID</p>
              <p className="font-mono text-xs break-all text-muted-foreground/90 mt-0.5">{todo.id}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-muted-foreground">
            <Calendar className="w-4 h-4 mt-0.5 text-primary" />
            <div>
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">Created At</p>
              <p className="text-xs text-muted-foreground/90 mt-0.5">
                {new Date(todo.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-muted-foreground sm:col-span-2 border-t border-border/40 pt-3 mt-1">
            <ShieldCheck className="w-4 h-4 mt-0.5 text-primary" />
            <div>
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">Owner Identity (Clerk ID)</p>
              <p className="font-mono text-xs break-all text-muted-foreground/90 mt-0.5">{todo.userId}</p>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}