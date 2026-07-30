import React from "react";
import { setUserRoleAction } from "@/app/actions/user-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function SelectRolePage() {
  const selectStudentRole = setUserRoleAction.bind(null, "STUDENT");
  const selectInstructorRole = setUserRoleAction.bind(null, "INSTRUCTOR");
  const selectAdminRole = setUserRoleAction.bind(null, "ADMIN");

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 font-sans text-slate-100 min-h-[85vh] flex flex-col justify-center">
      
      {/* Header Title Section */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs rounded-full inline-flex items-center gap-1">
          <Sparkles className="size-3.5 text-emerald-400" />
          <span>Interactive Onboarding & Role Switcher</span>
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-100 tracking-tight">
          Choose Your Access Mode on <span className="text-emerald-400">CourseForge</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Select your primary access mode below. You can switch roles at any time from your header navigation bar.
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
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
              <GraduationCap className="size-7" />
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
            <form action={selectStudentRole}>
              <Button type="submit" variant="brand" className="w-full h-10 text-xs flex items-center justify-center gap-2">
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
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl w-fit text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
              <Briefcase className="size-7" />
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
            <form action={selectInstructorRole}>
              <Button
                type="submit"
                className="w-full h-10 text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-cyan-400 to-teal-400 text-slate-950 font-extrabold hover:from-cyan-400 hover:to-teal-300"
              >
                <span>Continue as Instructor</span>
                <ArrowRight className="size-3.5" />
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
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl w-fit text-purple-400 mb-3 group-hover:scale-105 transition-transform">
              <ShieldCheck className="size-7" />
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
            <form action={selectAdminRole}>
              <Button type="submit" className="w-full h-10 text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-400 text-slate-950 font-extrabold hover:from-purple-400 hover:to-indigo-300">
                <span>Continue as Admin</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </form>
          </div>
        </Card>

      </div>

    </main>
  );
}
