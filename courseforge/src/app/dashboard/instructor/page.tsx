import React from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PlusCircle, Users, DollarSign, BarChart3, Clock, Eye } from "lucide-react";

export default async function InstructorDashboardPage() {
  const { userId } = await auth();

  // Fetch courses created by this instructor from Supabase database
  const courses = await prisma.course.findMany({
    where: {
      instructor: {
        clerkId: userId || "",
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
            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-0.5 text-xs rounded-full font-medium">
              Instructor Portal
            </Badge>
            <span className="text-xs text-slate-400">Role-Based Secured Route</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100">
            Instructor Management Dashboard
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">
            Manage your courses, track student analytics, and build new learning paths.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-3">
          <Link href="/courses">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
              View Public Catalog
            </Button>
          </Link>
          <Button variant="brand" className="flex items-center gap-2">
            <PlusCircle className="size-4" />
            <span>Create New Course</span>
          </Button>
        </div>
      </div>

      {/* Analytics Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Stat Card 1: Total Courses */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Courses</CardTitle>
            <BookOpen className="size-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{totalCourses}</div>
            <p className="text-xs text-slate-500 mt-1">Published on platform</p>
          </CardContent>
        </Card>

        {/* Stat Card 2: Enrolled Students */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Enrolled</CardTitle>
            <Users className="size-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{totalEnrollments}</div>
            <p className="text-xs text-slate-500 mt-1">Active student learners</p>
          </CardContent>
        </Card>

        {/* Stat Card 3: Total Curriculum Lessons */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Lessons</CardTitle>
            <Clock className="size-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{totalLessons}</div>
            <p className="text-xs text-slate-500 mt-1">Curriculum modules</p>
          </CardContent>
        </Card>

        {/* Stat Card 4: Estimated Earnings */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Estimated Revenue</CardTitle>
            <DollarSign className="size-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">$0.00</div>
            <p className="text-xs text-slate-500 mt-1">Stripe Connect integration</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Management Table / Grid Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
            <BarChart3 className="size-5 text-emerald-400" />
            <span>Your Managed Courses</span>
          </h2>
          <span className="text-xs text-slate-400">Showing {courses.length} courses</span>
        </div>

        {courses.length === 0 ? (
          // Clean Empty State when instructor has no courses yet
          <Card className="border-slate-800 bg-slate-900/30 py-12 text-center">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-slate-800/60 rounded-full text-emerald-400">
                <BookOpen className="size-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-lg font-semibold text-slate-200">No courses created yet</h3>
                <p className="text-sm text-slate-400 mt-1">
                  You are authorized as an Instructor. Start building your first course module to share knowledge with students.
                </p>
              </div>
              <Button variant="brand" className="flex items-center gap-2">
                <PlusCircle className="size-4" />
                <span>Create Your First Course</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Course Cards Grid
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant={course.published ? "default" : "secondary"} className={course.published ? "bg-emerald-500/15 text-emerald-400" : ""}>
                      {course.published ? "Published" : "Draft"}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      ID: {course.id}
                    </span>
                  </div>
                  <CardTitle className="text-lg text-slate-200 mt-2">{course.title}</CardTitle>
                  <CardDescription className="text-sm text-slate-400 line-clamp-2 mt-1">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="border-t border-slate-800/80 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5 text-emerald-400" />
                      <span>{course.enrollments.length} Students</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5 text-emerald-400" />
                      <span>{course.lessons.length} Lessons</span>
                    </span>
                  </div>
                  <Link href={`/courses/${course.id}`}>
                    <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 text-slate-300 hover:text-white">
                      <Eye className="size-3.5" />
                      <span>Preview</span>
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
