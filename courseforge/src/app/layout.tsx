import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
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
  // 1. Resolve authenticated user session
  const { userId, sessionClaims } = await auth();

  let userRole: string | undefined = undefined;

  // 2. Fetch live database role directly from Supabase PostgreSQL for 100% instant dynamic updates
  if (userId) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { role: true },
      });
      if (dbUser?.role) {
        userRole = dbUser.role;
      }
    } catch {
      userRole = undefined;
    }
  }

  // Fallback to JWT Claims metadata if database record is pending creation
  if (!userRole && sessionClaims && typeof sessionClaims === "object") {
    const metadata = (sessionClaims as Record<string, any>).metadata;
    if (metadata && typeof metadata === "object") {
      userRole = metadata.role;
    }
  }

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      >
        <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
          
          {/* Shared Responsive Header Navigation Component */}
          <Navbar userId={userId} userRole={userRole} />

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
                  <li><Link href="/dashboard/admin" className="hover:text-purple-400 transition-colors">Admin Portal</Link></li>
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
