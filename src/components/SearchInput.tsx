"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";
  
  // URL se current active page nikalna (Default = 1)
  const currentPage = Number(searchParams.get("page")) || 1;

  // Helper function for global URL parameter changes
  const updateURL = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // 🚨 RESET RULE: Agar user search ya category badle, to page hamesha 1 par reset ho jaye
    if (key !== "page") {
      params.set("page", "1"); 
    }

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4 w-full">
      {/* 🔍 Input Field */}
      <input
        type="text"
        placeholder="Search tasks by title..."
        defaultValue={currentSearch}
        onChange={(e) => updateURL("search", e.target.value || null)}
        className="w-full h-10 bg-background border border-input rounded-md px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
      />

      {/* 🏷️ Category Selection Tabs & Pagination Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left Side: Category Buttons */}
        <div className="flex gap-1.5 flex-wrap">
          {["all", "common", "urgent", "critical"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => updateURL("category", cat === "all" ? null : cat)}
              className={`px-3 py-1 rounded-md text-xs font-mono font-medium uppercase transition-colors ${
                currentCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Side: 📄 Compact Pagination Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => updateURL("page", String(currentPage - 1))}
            className="h-8 px-3 text-xs font-mono font-medium rounded border border-input bg-background text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-background transition-all"
          >
            ← Prev
          </button>
          
          <span className="text-xs font-mono text-muted-foreground px-1">
            Page {currentPage}
          </span>

          <button
            type="button"
            // Note: Server Components list limits directly sync automatically, 
            // We just forward increments or decrements here safely.
            onClick={() => updateURL("page", String(currentPage + 1))}
            className="h-8 px-3 text-xs font-mono font-medium rounded border border-input bg-background text-foreground hover:bg-muted transition-all"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}