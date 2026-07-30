import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { enrollInCourseAction } from "@/app/actions/course-actions";
import { UnenrollButton } from "@/components/unenroll-button";
import { AITutorWidget } from "@/components/ai-tutor-widget";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Calendar, Clock, ShieldCheck, PlayCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

interface CourseDetailsPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { courseId } = await params;

  // Fetch authentic relational course details & lessons from Supabase cloud database
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      instructor: true,
      lessons: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Check if current authenticated student is already enrolled in this course
  const { userId } = await auth();
  let isEnrolled = false;

  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (dbUser) {
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: dbUser.id,
            courseId: course.id,
          },
        },
      });

      if (existingEnrollment) {
        isEnrolled = true;
      }
    }
  }

  // Pre-bind Server Action to current course ID
  const enrollAction = enrollInCourseAction.bind(null, course.id);

  const formattedDate = new Date(course.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const instructorName = course.instructor.email.split("@")[0];
  const firstLesson = course.lessons[0];

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100">
      
      {/* Back to Catalog Breadcrumb */}
      <Link href="/courses" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 mb-6 transition-colors">
        <ArrowLeft className="size-3.5" />
        <span>Back to Course Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Course Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs rounded-full">
                Interactive Learning Track
              </Badge>
              {isEnrolled && (
                <Badge className="bg-emerald-500 text-slate-950 font-bold px-2.5 py-0.5 text-xs rounded-full flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  <span>Enrolled</span>
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
              {course.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 border-b border-slate-800 pb-4">
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
          </div>

          {/* Live AI Tutor Widget Component */}
          <AITutorWidget lessonTitle={course.title} />

          {/* Syllabus Curriculum Outlines linked to real relational lesson routes */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xl font-bold text-slate-200">Syllabus Curriculum ({course.lessons.length} Modules)</h2>
            <div className="space-y-3 border-l-2 border-slate-800 pl-4 ml-2">
              {course.lessons.map((lesson) => (
                <Link key={lesson.id} href={`/courses/${course.id}/lessons/${lesson.id}`} className="block group">
                  <div className="relative pl-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/70 transition-all duration-200">
                    <div className="absolute -left-[23px] top-4 size-2.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-200 text-sm group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                        <span>{lesson.title}</span>
                      </h3>
                      <PlayCircle className="size-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {lesson.content.slice(0, 120)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Enrollment Card Sidebar */}
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/40 sticky top-24 backdrop-blur-md">
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
                <span>Lessons: <strong>{course.lessons.length} Modules</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-300">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>Includes: <strong>Interactive AI Tutor</strong></span>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-3">
              {isEnrolled ? (
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-sm font-semibold">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>You are Enrolled in this Course</span>
                  </div>
                  {firstLesson && (
                    <Link href={`/courses/${course.id}/lessons/${firstLesson.id}`} className="w-full">
                      <Button variant="brand" className="w-full h-11 text-base flex items-center justify-center gap-2">
                        <PlayCircle className="size-5" />
                        <span>Start Lesson 1</span>
                      </Button>
                    </Link>
                  )}
                  <UnenrollButton courseId={course.id} className="w-full justify-center h-9" />
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
