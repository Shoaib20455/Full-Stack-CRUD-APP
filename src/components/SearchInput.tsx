"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";

  // 🔍 URL me search parameters push karne ka logic
  const handleSearch = (text: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (text) {
      params.set("search", text);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  };

  // 🏷️ Category Filter Handling
  const handleCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`?${params.toString()}`);
  };

  const currentCategory = searchParams.get("category") || "all";

  return (
    <div className="space-y-3 w-full">
      {/* 🔍 Input Field */}
      <input
        type="text"
        placeholder="Search tasks by title..."
        defaultValue={currentSearch}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full h-10 bg-background border border-input rounded-md px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
      />

      {/* 🏷️ Category Selection Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {["all", "common", "urgent", "critical"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategory(cat)}
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
    </div>
  );
}