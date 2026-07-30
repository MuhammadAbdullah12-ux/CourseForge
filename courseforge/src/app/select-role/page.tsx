import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { setUserRoleAction } from "@/app/actions/user-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Lock, Check } from "lucide-react";

export default async function SelectRolePage() {
  const { userId } = await auth();

  // Determine current active database role for the logged-in user
  let currentRole = "UNAUTHENTICATED";
  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });
    if (dbUser?.role) {
      currentRole = dbUser.role;
    }
  }

  const isAdmin = currentRole === "ADMIN";
  const isInstructor = currentRole === "INSTRUCTOR";
  const isStudent = currentRole === "STUDENT";

  // Server Action Handlers with Strict Role Permission Matrix
  const handleStudentSelect = async () => {
    "use server";
    const { userId: activeUserId } = await auth();
    if (!activeUserId) {
      redirect("/sign-in?redirect_url=/dashboard/student");
    }
    await setUserRoleAction("STUDENT");
    redirect("/dashboard/student");
  };

  const handleInstructorSelect = async () => {
    "use server";
    const { userId: activeUserId } = await auth();

    if (!activeUserId) {
      redirect("/sign-in?redirect_url=/dashboard/instructor");
    }

    const userInDb = await prisma.user.findUnique({
      where: { clerkId: activeUserId },
      select: { role: true },
    });

    // Admin or Instructor can access Instructor Portal directly
    if (userInDb?.role === "ADMIN" || userInDb?.role === "INSTRUCTOR") {
      await setUserRoleAction("INSTRUCTOR");
      redirect("/dashboard/instructor");
    } else {
      // Student attempting to access Instructor mode must log in with an Instructor account
      redirect("/sign-in?redirect_url=/dashboard/instructor");
    }
  };

  const handleAdminSelect = async () => {
    "use server";
    const { userId: activeUserId } = await auth();

    if (!activeUserId) {
      redirect("/sign-in?redirect_url=/dashboard/admin");
    }

    const userInDb = await prisma.user.findUnique({
      where: { clerkId: activeUserId },
      select: { role: true },
    });

    // ONLY Admin can access Admin Portal directly
    if (userInDb?.role === "ADMIN") {
      await setUserRoleAction("ADMIN");
      redirect("/dashboard/admin");
    } else {
      // Student or Instructor attempting to access Admin mode must log in with an Admin account
      redirect("/sign-in?redirect_url=/dashboard/admin");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 font-sans text-slate-100 min-h-[85vh] flex flex-col justify-center">
      
      {/* Header Title Section */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs rounded-full inline-flex items-center gap-1">
            <Sparkles className="size-3.5 text-emerald-400" />
            <span>Role Permission Control Matrix</span>
          </Badge>
          {isAdmin && (
            <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs px-2.5 py-0.5 font-bold">
              👑 Admin Universal Access Active
            </Badge>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-100 tracking-tight">
          Choose Your Access Mode on <span className="text-emerald-400">CourseForge</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          {isAdmin
            ? "As an Admin, you have universal super-user access to test all 3 role portals seamlessly."
            : "Select your desired access mode. Entering higher-privileged portals will prompt you to log into an authorized account."}
        </p>
      </div>

      {/* Role Selection Grid (3 Options: Student, Instructor, Admin) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Option 1: Student Mode (Emerald Green) */}
        <Card className="border-emerald-500/30 bg-slate-900/50 hover:bg-slate-900/80 hover:border-emerald-500/70 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-xl">
          <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-emerald-500/20 transition-colors">
            <GraduationCap className="size-28 -mr-6 -mt-6" />
          </div>

          <CardHeader className="relative z-10 pb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-105 transition-transform">
                <GraduationCap className="size-7" />
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                {isAdmin || isInstructor || isStudent ? "1-Click Access" : "Sign In Required"}
              </Badge>
            </div>
            <CardTitle className="text-xl text-slate-100 font-bold">Student Mode</CardTitle>
            <CardDescription className="text-slate-400 text-xs mt-1">
              Explore courses, build skills, and learn with AI assistance.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 space-y-2.5 pb-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
              <span>Browse full course catalog</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
              <span>1-Click course enrollment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
              <span>Lesson-scoped interactive AI tutors</span>
            </div>
          </CardContent>

          <div className="p-6 pt-0 relative z-10">
            <form action={handleStudentSelect}>
              <Button type="submit" variant="brand" className="w-full h-10 text-xs flex items-center justify-center gap-2 font-bold">
                <span>Continue as Student</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Option 2: Instructor Mode (Cyan / Teal) */}
        <Card className="border-cyan-500/40 bg-slate-900/50 hover:bg-slate-900/80 hover:border-cyan-500/70 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-xl">
          <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-cyan-500/20 transition-colors">
            <Briefcase className="size-28 -mr-6 -mt-6" />
          </div>

          <CardHeader className="relative z-10 pb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 group-hover:scale-105 transition-transform">
                <Briefcase className="size-7" />
              </div>
              <Badge className={isAdmin || isInstructor ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px]" : "bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px]"}>
                {isAdmin || isInstructor ? "1-Click Access" : "Requires Instructor Log In"}
              </Badge>
            </div>
            <CardTitle className="text-xl text-slate-100 font-bold">Instructor Mode</CardTitle>
            <CardDescription className="text-slate-400 text-xs mt-1">
              Create curriculum, publish courses, and track analytics.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 space-y-2.5 pb-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-cyan-400 shrink-0" />
              <span>Instructor Management Portal</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-cyan-400 shrink-0" />
              <span>1-Click AI Course Creator</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-cyan-400 shrink-0" />
              <span>Recharts analytics visual suite</span>
            </div>
          </CardContent>

          <div className="p-6 pt-0 relative z-10">
            <form action={handleInstructorSelect}>
              <Button
                type="submit"
                className="w-full h-10 text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-cyan-400 to-teal-400 text-slate-950 font-extrabold hover:from-cyan-400 hover:to-teal-300"
              >
                <span>Continue as Instructor</span>
                {isAdmin || isInstructor ? <ArrowRight className="size-3.5" /> : <Lock className="size-3.5" />}
              </Button>
            </form>
          </div>
        </Card>

        {/* Option 3: Admin Mode (Royal Purple) */}
        <Card className="border-purple-500/40 bg-slate-900/50 hover:bg-slate-900/80 hover:border-purple-500/70 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-xl">
          <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-purple-500/20 transition-colors">
            <ShieldCheck className="size-28 -mr-6 -mt-6" />
          </div>

          <CardHeader className="relative z-10 pb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 group-hover:scale-105 transition-transform">
                <ShieldCheck className="size-7" />
              </div>
              <Badge className={isAdmin ? "bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px]" : "bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px]"}>
                {isAdmin ? "1-Click Access (Admin)" : "Requires Admin Log In"}
              </Badge>
            </div>
            <CardTitle className="text-xl text-slate-100 font-bold flex items-center gap-1.5">
              <span>Admin Mode</span>
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs mt-1">
              Super-user access to users, courses, and platform telemetry.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 space-y-2.5 pb-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-purple-400 shrink-0" />
              <span>Full user role management & deletion</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-purple-400 shrink-0" />
              <span>Platform-wide course moderation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-purple-400 shrink-0" />
              <span>Universal access to Student & Instructor portals</span>
            </div>
          </CardContent>

          <div className="p-6 pt-0 relative z-10">
            <form action={handleAdminSelect}>
              <Button type="submit" className="w-full h-10 text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-400 text-slate-950 font-extrabold hover:from-purple-400 hover:to-indigo-300">
                <span>Continue as Admin</span>
                {isAdmin ? <ArrowRight className="size-3.5" /> : <Lock className="size-3.5" />}
              </Button>
            </form>
          </div>
        </Card>

      </div>

    </main>
  );
}
