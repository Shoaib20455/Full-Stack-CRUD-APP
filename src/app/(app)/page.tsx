import { auth } from "@clerk/nextjs/server";
import Hero from "@/components/Hero";

// 🎯 NEXT.JS 15/16 STANDARD: TypeScript interface for dynamic URL query params
interface PageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-md border bg-card text-card-foreground rounded-xl shadow-sm p-8 text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Welcome!</h1>
          <p className="text-muted-foreground text-sm">
            You need to login first to perform CRUD operations.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-6">
      {/* 🎯 Forwarding the search params promise to our Hero component */}
      <Hero searchParams={searchParams} />
    </main>
  );
}