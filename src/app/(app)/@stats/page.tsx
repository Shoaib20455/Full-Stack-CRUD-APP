// src/app/(app)/@stats/page.tsx
import { auth } from "@clerk/nextjs/server";
import { User, CheckCircle2, Circle } from "lucide-react";
import { getTodoStats } from "@/lib/data/todos"; // 🎯 Clean data layer function import kiya

export default async function StatsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  // 🎯 FIX: Direct db call khatam! Ab optimized cached function se saara data load hoga
  const { completedCount, pendingCount } = await getTodoStats(userId);

  return (
    <div className="w-full max-w-md border bg-card text-card-foreground rounded-xl shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <User className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold">User Analytics (Parallel)</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Completed Stats Card */}
        <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20 text-center">
          <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-mono font-bold text-green-500">{completedCount}</p>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Completed</p>
        </div>

        {/* Pending Stats Card */}
        <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20 text-center">
          <Circle className="w-6 h-6 text-amber-500 mx-auto mb-1" />
          <p className="text-2xl font-mono font-bold text-amber-500">{pendingCount}</p>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Pending Tasks</p>
        </div>
      </div>
    </div>
  );
}