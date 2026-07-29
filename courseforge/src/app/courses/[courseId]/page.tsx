import React from 'react';
import Link from 'next/link';
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { enrollInCourseAction } from "@/app/actions/course-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, BookOpen, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
  searchParams?: Promise<{
    enrolled?: string;
  }>;
}

export default async function CourseDetailPage({ params, searchParams }: PageProps) {
  const { courseId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isEnrolledParam = resolvedSearchParams.enrolled === "true";

  // 1. Search our live Supabase database for the matching ID, including the instructor relation
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      instructor: true,
    },
  });

  // If the course isn't found, trigger Next.js's native 404 handler
  if (!course) {
    notFound();
  }

  // 2. Check server-side if the currently logged-in user is already enrolled
  const { userId } = await auth();
  let isEnrolled = isEnrolledParam;

  if (userId && !isEnrolled) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (dbUser) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: dbUser.id,
            courseId: course.id,
          },
        },
      });

      isEnrolled = !!enrollment;
    }
  }

  // 3. Bind the current course ID to the Server Action for explicit payload serialization
  const enrollAction = enrollInCourseAction.bind(null, course.id);

  // Format creation date
  const formattedDate = new Date(course.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Truncate email to display as user name
  const instructorName = course.instructor.email.split("@")[0];

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-200">
      
      {/* Back Button */}
      <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors mb-8">
        <ArrowLeft className="size-4" />
        <span>Back to Catalog</span>
      </Link>

      {/* Main Grid: 2/3 Content on Left, 1/3 Sidebar Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Course Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                Self-Paced
              </Badge>
              <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                Beginner Friendly
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
              {course.title}
            </h1>

            {/* Metadata Bar */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-400 pt-2 pb-4 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <User className="size-4 text-emerald-400" />
                <span>Instructor: <strong className="capitalize">{instructorName}</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 text-emerald-400" />
                <span>Published: <strong>{formattedDate}</strong></span>
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-200">Course Overview</h2>
            <p className="text-slate-300 leading-relaxed text-base">
              {course.description}
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              This course is structured with inline AI tutor assistance. As you read through each lesson, 
              you can interact with the AI assistant directly inside the workspace to ask clarifying 
              questions, generate outline summaries, or get tested with automated mini-quizzes.
            </p>
          </div>

          {/* Mock Curriculum Outlines */}
          <div className="space-y-4 pt-6">
            <h2 className="text-xl font-bold text-slate-200">Syllabus Curriculum</h2>
            <div className="space-y-3 border-l-2 border-slate-800 pl-4 ml-2">
              <div className="relative pl-4">
                <div className="absolute -left-[23px] top-1.5 size-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-semibold text-slate-200">Lesson 1: Introduction & Environment Setup</h3>
                <p className="text-xs text-slate-400 mt-1">Understanding core prerequisites, configuring IDE systems, and folder layout blueprints.</p>
              </div>
              <div className="relative pl-4">
                <div className="absolute -left-[23px] top-1.5 size-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-semibold text-slate-200">Lesson 2: Core Architectural Principles</h3>
                <p className="text-xs text-slate-400 mt-1">Deep-dive into component design, props pipelines, and local data states flow boundaries.</p>
              </div>
              <div className="relative pl-4">
                <div className="absolute -left-[23px] top-1.5 size-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-semibold text-slate-200">Lesson 3: Building Interactive Interfaces</h3>
                <p className="text-xs text-slate-400 mt-1">Handling events dynamically, managing complex lists mapping keys, and layout flex grids.</p>
              </div>
              <div className="relative pl-4">
                <div className="absolute -left-[23px] top-1.5 size-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-semibold text-slate-200">Lesson 4: Deployments & Optimization</h3>
                <p className="text-xs text-slate-400 mt-1">Configuring variables, production compiler build tasks, and CD hosting edge deployments.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Enrollment Card Sidebar */}
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/40 sticky top-24">
            <CardHeader>
              <CardTitle className="text-slate-100">Enrollment Details</CardTitle>
              <CardDescription className="text-slate-400">Join this course for free</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2.5 text-sm text-slate-300">
                <Clock className="size-4 text-emerald-400" />
                <span>Estimated Time: <strong>4-6 hours</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-300">
                <BookOpen className="size-4 text-emerald-400" />
                <span>Lessons: <strong>4 Modules</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-300">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>Includes: <strong>Interactive AI Tutor</strong></span>
              </div>
            </CardContent>
            
            {/* Dynamic Enrollment Action Footer */}
            <CardFooter className="flex flex-col gap-3">
              {isEnrolled ? (
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-sm font-semibold">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>You are Enrolled in this Course</span>
                  </div>
                  <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:text-white">
                    Access Course Content
                  </Button>
                </div>
              ) : (
                <form action={enrollAction} className="w-full">
                  <Button type="submit" variant="brand" className="w-full h-11 text-base">
                    Enroll in Course
                  </Button>
                </form>
              )}
              <span className="text-center text-[11px] text-slate-500">
                {isEnrolled
                  ? "Your enrollment is active and saved in Supabase database."
                  : "Clicking enroll saves a relational enrollment record in Supabase PostgreSQL."}
              </span>
            </CardFooter>
          </Card>
        </div>
        
      </div>
    </main>
  );
}
