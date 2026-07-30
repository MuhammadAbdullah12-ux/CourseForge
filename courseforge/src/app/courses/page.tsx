import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseFilter } from "@/components/course-filter";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export default async function CoursesPage() {
  // 1. Enforce Server-Side Authentication Guard
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/courses");
  }

  // 2. Fetch all published courses from Supabase database
  const courses = await prisma.course.findMany({
    where: {
      published: true,
    },
    include: {
      instructor: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-xs rounded-full">
              Live Database Catalog
            </Badge>
            <span className="text-xs text-slate-400">Prisma 7 + Supabase</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 flex items-center gap-2">
            <BookOpen className="size-8 text-emerald-400" />
            <span>Explore Learning Tracks</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">
            Discover courses built by top instructors with lesson-scoped AI tutors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full w-fit">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{courses.length} Active Courses Available</span>
        </div>
      </div>

      {/* Filterable Course Grid */}
      <CourseFilter courses={courses} />

    </main>
  );
}
