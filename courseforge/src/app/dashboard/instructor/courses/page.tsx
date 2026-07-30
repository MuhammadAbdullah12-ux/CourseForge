import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, Eye, PlusCircle, ArrowLeft } from "lucide-react";

export default async function InstructorPublishedCoursesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Live PostgreSQL Role Verification
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (dbUser?.role === "STUDENT") {
    redirect("/dashboard/student");
  }

  // Fetch courses created by this instructor
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

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/instructor" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              <ArrowLeft className="size-3" />
              <span>Instructor Portal</span>
            </Link>
            <span className="text-slate-600">/</span>
            <Badge className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-3 py-0.5 text-xs rounded-full font-medium">
              Published Courses
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <BookOpen className="size-8 text-cyan-400" />
            <span>My Published Courses</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your created courses, module structures, and enrolled student rosters.
          </p>
        </div>

        <Link href="/dashboard/instructor/courses/new">
          <Button className="bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold hover:from-cyan-400 hover:to-teal-300 flex items-center gap-2">
            <PlusCircle className="size-4" />
            <span>+ Create AI Course</span>
          </Button>
        </Link>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900/40 py-12 text-center">
          <CardContent className="space-y-3">
            <div className="p-3 bg-slate-800/60 rounded-full text-slate-400 w-fit mx-auto">
              <BookOpen className="size-6" />
            </div>
            <h3 className="text-base font-bold text-slate-200">No courses created yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Use our 1-Click AI Authoring Studio to instantly draft and publish your first course.
            </p>
            <Link href="/dashboard/instructor/courses/new">
              <Button variant="outline" size="sm" className="mt-2 border-cyan-500/40 text-cyan-300">
                Open AI Authoring Studio
              </Button>
            </Link>
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
                    <span>View Public Page</span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

    </main>
  );
}
