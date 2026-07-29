import React from "react";
import { setUserRoleAction } from "@/app/actions/user-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function SelectRolePage() {
  const selectStudentRole = setUserRoleAction.bind(null, "STUDENT");
  const selectInstructorRole = setUserRoleAction.bind(null, "INSTRUCTOR");

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 font-sans text-slate-100 min-h-[85vh] flex flex-col justify-center">
      
      {/* Header Title Section */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs rounded-full inline-flex items-center gap-1">
          <Sparkles className="size-3.5 text-emerald-400" />
          <span>Interactive Onboarding</span>
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-100 tracking-tight">
          How do you want to use <span className="text-emerald-400">CourseForge</span>?
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Select your primary mode below. You can easily switch between Student and Instructor modes at any time from your header profile bar.
        </p>
      </div>

      {/* Role Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Option 1: Student Mode */}
        <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-xl">
          <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-emerald-500/20 transition-colors">
            <GraduationCap className="size-28 -mr-6 -mt-6" />
          </div>

          <CardHeader className="relative z-10 pb-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
              <GraduationCap className="size-7" />
            </div>
            <CardTitle className="text-2xl text-slate-100 font-bold">Learn as a Student</CardTitle>
            <CardDescription className="text-slate-400 text-sm mt-1">
              Explore courses, build skills, and learn with AI assistance.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 space-y-3 pb-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Browse full course catalog & syllabus</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>1-Click course enrollment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Lesson-scoped interactive AI tutors</span>
            </div>
          </CardContent>

          <div className="p-6 pt-0 relative z-10">
            <form action={selectStudentRole}>
              <Button type="submit" variant="brand" className="w-full h-11 text-base flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-emerald-500/20">
                <span>Continue as Student</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Option 2: Instructor Mode */}
        <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-xl">
          <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-emerald-500/20 transition-colors">
            <Briefcase className="size-28 -mr-6 -mt-6" />
          </div>

          <CardHeader className="relative z-10 pb-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
              <Briefcase className="size-7" />
            </div>
            <CardTitle className="text-2xl text-slate-100 font-bold">Teach as an Instructor</CardTitle>
            <CardDescription className="text-slate-400 text-sm mt-1">
              Create curriculum, publish courses, and manage students.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 space-y-3 pb-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Access Instructor Management Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Build and publish new courses</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>Track student enrollment analytics</span>
            </div>
          </CardContent>

          <div className="p-6 pt-0 relative z-10">
            <form action={selectInstructorRole}>
              <Button type="submit" variant="brand" className="w-full h-11 text-base flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-emerald-500/20">
                <span>Continue as Instructor</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </Card>

      </div>
    </main>
  );
}
