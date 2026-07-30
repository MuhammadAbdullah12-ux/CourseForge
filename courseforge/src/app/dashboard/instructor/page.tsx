import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getInstructorAnalyticsAction } from "@/app/actions/analytics-actions";
import { AICourseCreatorModal } from "@/components/ai-course-creator-modal";
import { QuizScoreBarChart } from "@/components/analytics/quiz-score-barchart";
import { EnrollmentLineChart } from "@/components/analytics/enrollment-linechart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, BarChart3, Clock, Eye, Sparkles } from "lucide-react";

export default async function InstructorDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 1. Resolve live database role for strict authorization
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  const role = dbUser?.role;

  // Strict Role Guard: Students cannot access Instructor Management Portal
  if (role === "STUDENT") {
    redirect("/dashboard/student");
  }

  if (!role) {
    redirect("/select-role");
  }

  // 2. Fetch courses created by this instructor from Supabase database
  const courses = await prisma.course.findMany({
    where: {
      instructor: {
        clerkId: userId,
      },
    },
    include: {
      enrollments: true,
      lessons: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 3. Fetch pre-aggregated analytics metrics from Supabase PostgreSQL
  const analyticsData = await getInstructorAnalyticsAction();

  // Calculate high-level analytics
  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollments.length, 0);
  const totalLessons = courses.reduce((sum, course) => sum + course.lessons.length, 0);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100">
      
      {/* Page Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-3 py-0.5 text-xs rounded-full font-medium">
              Instructor Portal
            </Badge>
            <span className="text-xs text-slate-400">Role-Secured Route</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100">
            Instructor Management Dashboard
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">
            Manage your courses, track student analytics, and build new learning paths with AI assistance.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/courses">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
              View Public Catalog
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Created Courses</CardTitle>
            <BookOpen className="size-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-100">{totalCourses}</div>
            <p className="text-xs text-slate-400 mt-1">Published on CourseForge</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Student Enrollments</CardTitle>
            <Users className="size-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-100">{totalEnrollments}</div>
            <p className="text-xs text-slate-400 mt-1">Active student learners</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Curriculum Modules</CardTitle>
            <BarChart3 className="size-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-100">{totalLessons}</div>
            <p className="text-xs text-slate-400 mt-1">Total active lessons</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Visualization Suite Section */}
      <div className="space-y-4 mb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="size-5 text-cyan-400" />
            <span>Interactive Analytics Charts</span>
          </h2>
          <Badge className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs">
            Recharts Visual Engine
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuizScoreBarChart data={analyticsData.scoreDistribution} />
          <EnrollmentLineChart data={analyticsData.courseEngagement} />
        </div>
      </div>

      {/* 1-Click AI Course Creator Component */}
      <div className="mb-12">
        <AICourseCreatorModal />
      </div>

      {/* Published Courses Grid Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Your Published Courses</h2>
            <p className="text-xs text-slate-400">Real-time status of your course catalog</p>
          </div>
        </div>

        {courses.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900/40 py-12 text-center">
            <CardContent className="space-y-3">
              <div className="p-3 bg-slate-800/60 rounded-full text-slate-400 w-fit mx-auto">
                <BookOpen className="size-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200">No courses created yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Use the 1-Click AI Assistant above to instantly draft and publish your first course.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-all flex flex-col justify-between">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <Badge className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-[10px]">
                      Published
                    </Badge>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(course.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-100 line-clamp-1">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="py-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5 text-cyan-400" />
                      <strong>{course.enrollments.length}</strong> enrolled
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="size-3.5 text-cyan-400" />
                      <strong>{course.lessons.length}</strong> modules
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Link href={`/courses/${course.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full border-slate-800 hover:border-cyan-500/40 flex items-center justify-center gap-1.5 text-xs">
                      <Eye className="size-3.5" />
                      <span>View Course Page</span>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
