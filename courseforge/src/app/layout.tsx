import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

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
  title: "CourseForge | AI-Assisted Computer Science Learning Platform",
  description: "Explore 12 Computer Science degree courses with inline AI tutors and role-gated student, instructor, and admin portals.",
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
      <html lang="en" className="dark scroll-smooth">
        <body
          className={cn(
            "min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300 flex flex-col justify-between",
            inter.variable,
            geistSans.variable,
            geistMono.variable
          )}
        >
          {/* Top Role-Aware Navbar (Suppressed on Home/Select-Role pages) */}
          <Navbar userId={userId} userRole={userRole} />

          {/* Main App Page View Content */}
          <div className="flex-1">
            {children}
          </div>

          {/* Sleek Dark-Mode Footer Component */}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
