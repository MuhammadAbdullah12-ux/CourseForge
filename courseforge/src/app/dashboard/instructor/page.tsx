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

  const userId = clerkUser.id;
  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`;

  // 1. Resolve live database role for strict authorization
  let dbUser = await prisma.user.findFirst({
    where: {
      OR: [
        { clerkId: userId },
        { email: primaryEmail },
      ],
    },
    select: { id: true, role: true, clerkId: true },
  });

  if (!dbUser) {
    dbUser = await syncUserWithDatabase("INSTRUCTOR");
  }

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
      OR: [
        { instructorId: dbUser?.id },
        { instructor: { clerkId: userId } },
        { instructor: { email: primaryEmail } },
      ],
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

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 px-3 py-0.5 text-xs rounded-full font-medium">
              Instructor Command Center
            </Badge>
            <span className="text-xs text-slate-400">Authenticated Instructor Portal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100">
            Instructor Dashboard
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">
            Manage your published courses, generate AI curriculum modules, and analyze student quiz performance.
          </p>
        </div>

        {/* Quick Actions (AI Modal & Link to New Course) */}
        <div className="flex items-center gap-3">
          <AICourseCreatorModal />

          <Link href="/dashboard/instructor/courses/new">
            <Button className="bg-gradient-to-r from-cyan-500 via-cyan-400 to-teal-400 text-slate-950 font-extrabold hover:from-cyan-400 hover:to-teal-300 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/10">
              <Sparkles className="size-4" />
              <span>Manual Course Builder</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Published Courses</CardTitle>
            <BookOpen className="size-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-100">{totalCourses}</div>
            <p className="text-xs text-slate-400 mt-1">Active courses in catalog</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Student Enrollments</CardTitle>
            <Users className="size-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-100">{totalEnrollments}</div>
            <p className="text-xs text-slate-400 mt-1">Active student subscriptions</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total AI Lessons</CardTitle>
            <BarChart3 className="size-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-100">
              {courses.reduce((sum, c) => sum + c.lessons.length, 0)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Modules generated across courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid (Courses List & Recharts Analytics Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3): Published Courses List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="size-5 text-cyan-400" />
              <span>Your Published Courses</span>
            </h2>
            <Link href="/dashboard/instructor/courses">
              <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-cyan-400">
                View All ({courses.length})
              </Button>
            </Link>
          </div>

          {courses.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/40 py-12 text-center">
              <CardContent className="space-y-3">
                <div className="p-3 bg-slate-800/60 rounded-full text-slate-400 w-fit mx-auto">
                  <BookOpen className="size-6" />
                </div>
                <h3 className="text-base font-bold text-slate-200">No courses published yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click the 1-Click AI Course Creator button to generate your first complete course track in seconds.
                </p>
                <AICourseCreatorModal />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {courses.slice(0, 4).map((course) => (
                <Card key={course.id} className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-all p-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 text-[10px]">
                          {course.published ? "Published" : "Draft"}
                        </Badge>
                        <span className="text-[11px] text-slate-400">
                          {course.lessons.length} Modules • {course.enrollments.length} Students
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-100">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5">
                          <Eye className="size-3.5" />
                          <span>View Details</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1/3): Recharts Analytics Component Previews */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="size-5 text-cyan-400" />
              <span>Live Analytics</span>
            </h2>
            <Link href="/dashboard/instructor/analytics">
              <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-cyan-400">
                Full View
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            {/* Quiz Accuracy Performance Chart Preview */}
            {analyticsData.scoreDistribution && (
              <QuizScoreBarChart data={analyticsData.scoreDistribution} />
            )}
          </div>
        </div>

      </div>

    </main>
  );
}
