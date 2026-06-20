export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-2xl border bg-card text-card-foreground rounded-xl shadow-sm p-6 md:p-8 space-y-6">
        <div className="space-y-2 text-center">
          <div className="h-8 w-64 max-w-full bg-muted rounded-md mx-auto animate-pulse" />
          <div className="h-4 w-80 max-w-full bg-muted/70 rounded-md mx-auto animate-pulse" />
        </div>

        <div className="h-px bg-border w-full" />

        <div className="h-10 w-full bg-muted/50 border rounded-md animate-pulse" />

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="h-10 flex-1 bg-muted/50 border rounded-md animate-pulse" />
          <div className="h-10 w-full sm:w-36 bg-muted/50 border rounded-md animate-pulse" />
          <div className="h-10 w-full sm:w-24 bg-primary/20 rounded-md animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-28 bg-muted rounded animate-pulse" />
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[74px] bg-muted/40 border border-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
