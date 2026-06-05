// src/app/(app)/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My CRUD App",
  description: "Learning CRUD operations with PostgreSQL",
};

export default function RootLayout({
  children,
  stats,
}: Readonly<{
  children: React.ReactNode;
  stats: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 🚀 FIX 1: Added 'dynamic' attribute for Next.js 15 PPR compilation safety */}
        <ClerkProvider dynamic>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />

            {/* 🚀 FIX 2: Main outer Suspense wrapper to handle runtime session reads safely */}
            <Suspense fallback={
              <div className="max-w-6xl mx-auto p-4 md:p-6 text-center font-mono text-sm text-muted-foreground">
                Loading Application Shell...
              </div>
            }>
              <main className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Left Side: Todo list (takes 2 columns on desktop) */}
                <div className="md:col-span-2">
                  {children}
                </div>

                {/* Right Side: Parallel Stats Widget (takes 1 column) */}
                <Suspense
                  fallback={
                    <div className="w-full max-w-md h-44 bg-muted/40 animate-pulse rounded-xl border border-muted" />
                  }
                >
                  {stats}
                </Suspense>
              </main>
            </Suspense>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}