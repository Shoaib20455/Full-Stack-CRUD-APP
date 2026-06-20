"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md border bg-card text-card-foreground rounded-xl shadow-sm p-8 text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground">
            The dashboard hit a temporary problem. Try again to reload this
            section.
          </p>
        </div>

        <button
          type="button"
          onClick={() => unstable_retry()}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
