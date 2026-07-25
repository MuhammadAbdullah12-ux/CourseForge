import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CourseForge",
  description: "AI-Assisted Learning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col">
        {/* Shared Navigation Bar */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-emerald-400 tracking-wide hover:opacity-90">
              CourseForge
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/courses" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Courses
              </Link>
            </div>
          </nav>
        </header>

        {/* Page Content Slots */}
        <div className="flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
