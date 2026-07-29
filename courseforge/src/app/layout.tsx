import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CourseForge | AI-Assisted Learning Platform",
  description: "Learn and teach with AI-assisted lesson tutors and course creation tools.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Resolve user session and role claims on the server
  const { userId, sessionClaims } = await auth();
  const userRole = sessionClaims?.metadata?.role;

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      >
        <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
          {/* Shared Header Navigation Bar */}
          <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50 transition-all">
            <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              
              {/* Logo / Brand Name */}
              <Link href="/" className="font-extrabold text-xl text-emerald-400 tracking-tight hover:opacity-90 transition-opacity flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg text-xs border border-emerald-500/30">
                  CF
                </span>
                <span>CourseForge</span>
              </Link>
              
              {/* Navigation Links with Hover Animations */}
              <div className="flex gap-2 sm:gap-3 items-center">
                <Link 
                  href="/" 
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
                >
                  About
                </Link>
                <Link 
                  href="/courses" 
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
                >
                  Courses
                </Link>

                {/* Render Instructor Dashboard link if user is an Instructor */}
                {userId && userRole === "INSTRUCTOR" && (
                  <Link 
                    href="/dashboard/instructor" 
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Render Permanent Select Role Button (Works for both Guests and Logged-in Users) */}
                <Link 
                  href="/select-role" 
                  title="Choose or switch between Student and Instructor access modes"
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-200 flex items-center gap-1.5"
                >
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {userId 
                      ? (userRole === "INSTRUCTOR" ? "Instructor Mode" : "Student Mode") 
                      : "Select Role"}
                  </span>
                  <span className="text-[10px] text-slate-400 underline decoration-slate-600">
                    {userId ? "Switch" : "Choose"}
                  </span>
                </Link>

                {/* Auth Controls */}
                {!userId ? (
                  <div className="flex items-center gap-2 ml-2">
                    <Link 
                      href="/sign-in" 
                      className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/sign-up" 
                      className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all duration-200"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="ml-2 flex items-center">
                    <UserButton />
                  </div>
                )}
              </div>
            </nav>
          </header>

          {/* Page Content */}
          <div className="flex-1">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
