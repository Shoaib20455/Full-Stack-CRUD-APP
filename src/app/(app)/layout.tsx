import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

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
  stats
}: Readonly<{
  children: React.ReactNode;
  stats: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            
            {/* 🚀 FIXED: Main Responsive Grid Wrapper jo dono ko parallel chalaye ga */}
            <main className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Left Side: Todo list (takes 2 columns on desktop) */}
              <div className="md:col-span-2">
                {children}
              </div>

              {/* Right Side: Parallel Stats Widget (takes 1 column) */}
              <div className="w-full">
                {stats}
              </div>

            </main>

          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}