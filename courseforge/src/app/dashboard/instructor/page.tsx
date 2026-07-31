import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { syncUserWithDatabase } from "@/lib/user-sync";
import { getInstructorAnalyticsAction } from "@/app/actions/analytics-actions";
import { AICourseCreatorModal } from "@/components/ai-course-creator-modal";
import { QuizScoreBarChart } from "@/components/analytics/quiz-score-barchart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, BarChart3, Clock, Eye, Sparkles } from "lucide-react";

export default async function InstructorDashboardPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in?redirect_url=/dashboard/instructor");
  }

  // 1. Always run syncUserWithDatabase to ensure dynamic role upgrades for instructors
  const dbUser = await syncUserWithDatabase("INSTRUCTOR");
  const role = dbUser?.role;

  // Strict Role Guard: Unprivileged accounts cannot access Instructor Management Portal
  if (role !== "INSTRUCTOR" && role !== "ADMIN") {
    redirect("/select-role");
  }

  const userId = dbUser!.id;

  // Fetch Analytics & Courses authored by this instructor
  const analyticsData = await getInstructorAnalyticsAction();

  const courses = await prisma.course.findMany({
    where: { instructorId: userId },
    include: {
      lessons: { orderBy: { order: "asc" } },
      enrollments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((acc, c) => acc + c.enrollments.length, 0);
  const totalLessons = courses.reduce((acc, c) => acc + c.lessons.length, 0);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100 space-y-10">
      
      {/* Instructor Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 px-3 py-0.5 text-xs rounded-full font-medium">
              🟦 Instructor Portal
            </Badge>
            <span className="text-xs text-slate-400">Course Author & Content Management</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100">
            Instructor Control Center
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Create academic courses, publish modules, track student performance, and view quiz analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AICourseCreatorModal />

          <Link href="/dashboard/instructor/courses/new">
            <Button variant="brand" className="bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2">
              <BookOpen className="size-4" />
              <span>Create Manual Course</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <Card className="border-slate-800 bg-slate-900/40 p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Authored Courses</span>
            <BookOpen className="size-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100">{totalCourses}</p>
          <p className="text-xs text-slate-500">Published and draft course tracks</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/40 p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Enrolled Students</span>
            <Users className="size-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100">{totalStudents}</p>
          <p className="text-xs text-slate-500">Active student enrollments across all courses</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/40 p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Modules</span>
            <Clock className="size-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100">{totalLessons}</p>
          <p className="text-xs text-slate-500">Curriculum lesson modules created</p>
        </Card>

      </div>

      {/* Authored Courses List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">Your Authored Courses</h2>
          <span className="text-xs text-slate-400">{courses.length} courses total</span>
        </div>

        {courses.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900/20 p-12 text-center space-y-4">
            <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 w-fit mx-auto">
              <BookOpen className="size-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">No Authored Courses Yet</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Use the AI Course Creator or click below to build your first Computer Science course track.
            </p>
            <Link href="/dashboard/instructor/courses/new">
              <Button variant="brand" className="bg-cyan-600 hover:bg-cyan-500 text-white">
                Create First Course
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="border-slate-800 bg-slate-900/50 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={course.published ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs" : "bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs"}>
                      {course.published ? "Published" : "Draft"}
                    </Badge>
                    <span className="text-xs text-slate-400">{course.lessons.length} Modules</span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-100">{course.title}</CardTitle>
                  <CardDescription className="text-slate-400 text-xs line-clamp-2">
                    {course.description || "No description provided."}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {course.enrollments.length} Students Enrolled
                  </span>
                  <div className="flex items-center gap-2">
                    <Link href={`/courses/${course.id}`}>
                      <Button variant="outline" size="sm" className="border-slate-700 text-xs flex items-center gap-1">
                        <Eye className="size-3.5" />
                        <span>Preview</span>
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
