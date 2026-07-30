import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Code2, Database, Shield, Zap } from "lucide-react";

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
  // 1. Resolve user session safely
  const { userId, sessionClaims } = await auth();

  let userRole: string | undefined = undefined;
  try {
    if (sessionClaims && typeof sessionClaims === "object") {
      const metadata = (sessionClaims as Record<string, any>).metadata;
      if (metadata && typeof metadata === "object") {
        userRole = metadata.role;
      }
    }
  } catch {
    userRole = undefined;
  }

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      >
        <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
          {/* Shared Header Navigation Bar */}
          <header className="border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl sticky top-0 z-50 transition-all">
            <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              
              {/* Logo / Brand Name */}
              <Link href="/" className="font-extrabold text-xl text-emerald-400 tracking-tight hover:scale-105 hover:opacity-95 transition-all flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-xl text-xs border border-emerald-500/30 shadow-inner">
                  CF
                </span>
                <span>CourseForge</span>
              </Link>
              
              {/* Navigation Links with Popping Animations & Color Grading */}
              <div className="flex gap-2 sm:gap-3 items-center">
                <Link 
                  href="/" 
                  className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-slate-950 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-teal-300 hover:font-bold hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 ease-out"
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-slate-950 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-teal-300 hover:font-bold hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 ease-out"
                >
                  About
                </Link>
                <Link 
                  href="/courses" 
                  className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-slate-950 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-teal-300 hover:font-bold hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 ease-out"
                >
                  Courses
                </Link>

                {/* Render Dashboard link for signed-in users */}
                {userId && (
                  <Link 
                    href={userRole === "INSTRUCTOR" ? "/dashboard/instructor" : "/dashboard/student"} 
                    className="px-3.5 py-1.5 rounded-xl text-sm font-bold text-emerald-400 hover:text-slate-950 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-teal-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 ease-out"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Render Permanent Select Role Button */}
                <Link 
                  href="/select-role" 
                  title="Choose or switch between Student and Instructor access modes"
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-400 hover:text-slate-950 hover:border-emerald-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 ease-out flex items-center gap-1.5"
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
                      className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 ease-out"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/sign-up" 
                      className="px-4 py-1.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 ease-out"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="ml-2 flex items-center hover:scale-105 transition-transform">
                    <UserButton />
                  </div>
                )}
              </div>
            </nav>
          </header>

          {/* Main Page Content Slot */}
          <div className="flex-1">
            {children}
          </div>

          {/* Shared Sleek Dark-Mode Footer */}
          <footer className="border-t border-slate-800 bg-slate-950/90 text-slate-400 py-12 text-sm mt-16">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Column 1: Brand Info */}
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center gap-2 font-bold text-slate-100 text-lg">
                  <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg text-xs border border-emerald-500/30">
                    CF
                  </span>
                  <span>CourseForge</span>
                </div>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  An adaptive learning platform connecting students with expert instructors, lesson-scoped AI tutors, and real-time database persistence.
                </p>
                <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Zap className="size-3 text-emerald-400" /> Next.js 16</span>
                  <span className="flex items-center gap-1"><Database className="size-3 text-emerald-400" /> Supabase</span>
                  <span className="flex items-center gap-1"><Shield className="size-3 text-emerald-400" /> Clerk</span>
                  <span className="flex items-center gap-1"><Code2 className="size-3 text-emerald-400" /> Prisma 7</span>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Navigation</h4>
                <ul className="space-y-1.5 text-xs">
                  <li><Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
                  <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About</Link></li>
                  <li><Link href="/courses" className="hover:text-emerald-400 transition-colors">Courses Catalog</Link></li>
                  <li><Link href="/select-role" className="hover:text-emerald-400 transition-colors">Role Onboarding</Link></li>
                </ul>
              </div>

              {/* Column 3: Portals & GitHub */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Platform</h4>
                <ul className="space-y-1.5 text-xs">
                  <li><Link href="/dashboard/student" className="hover:text-emerald-400 transition-colors">Student Dashboard</Link></li>
                  <li><Link href="/dashboard/instructor" className="hover:text-emerald-400 transition-colors">Instructor Portal</Link></li>
                  <li>
                    <a 
                      href="https://github.com/MuhammadAbdullah12-ux/CourseForge" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 mt-2 text-slate-300"
                    >
                      <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      <span>GitHub Repository</span>
                    </a>
                  </li>
                </ul>
              </div>

            </div>

            <div className="max-w-6xl mx-auto px-6 border-t border-slate-800/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
              <p>© {new Date().getFullYear()} CourseForge Platform. All rights reserved.</p>
              <p>Built with Next.js 16, Tailwind CSS & Supabase PostgreSQL.</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
