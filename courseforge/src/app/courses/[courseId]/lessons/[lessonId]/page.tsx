import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AITutorWidget } from "@/components/ai-tutor-widget";
import { AIQuizWidget } from "@/components/ai-quiz-widget";
import { LiveCodeSandbox } from "@/components/live-code-sandbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonWorkspacePage({ params }: PageProps) {
  const { courseId, lessonId } = await params;

  // 1. Fetch current lesson from Supabase PostgreSQL, including parent course and all sibling lessons
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });

  if (!lesson || lesson.courseId !== courseId) {
    notFound();
  }

  const allLessons = lesson.course.lessons;
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 md:py-12 font-sans text-slate-200">
      
      {/* Breadcrumb Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to {lesson.course.title} Overview</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-xs">
            Lesson {lesson.order} of {allLessons.length}
          </Badge>
          <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-xs">
            Interactive Workspace
          </Badge>
        </div>
      </div>

      {/* Main Dual-Pane Classroom Grid: 2/3 Content Reader on Left, 1/3 AI Tutor Sidebar on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Pane (2/3): Lesson Reader, Live Sandbox & AI Quiz Widget */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              {lesson.title}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-emerald-400" />
              <span>Part of course: <strong className="text-slate-300">{lesson.course.title}</strong></span>
            </p>
          </div>

          {/* Lesson Content Body Card */}
          <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl">
            <CardHeader className="border-b border-slate-800/80 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span>Lesson Reading Material</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <div className="prose prose-invert max-w-none text-slate-300 space-y-4 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {lesson.content}
              </div>
            </CardContent>
          </Card>

          {/* Live Executable Code Sandbox Component */}
          <LiveCodeSandbox lessonTitle={lesson.title} />

          {/* Interactive AI Knowledge Check Quiz Component */}
          <AIQuizWidget lessonId={lesson.id} lessonTitle={lesson.title} />

          {/* Previous & Next Lesson Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 gap-4 mt-8">
            {prevLesson ? (
              <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-slate-800 hover:border-emerald-500/40">
                  <ChevronLeft className="size-4" />
                  <span>Previous: {prevLesson.title.split(":")[0]}</span>
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                <Button variant="brand" size="sm" className="flex items-center gap-1.5">
                  <span>Next: {nextLesson.title.split(":")[0]}</span>
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
            ) : (
              <Link href={`/courses/${courseId}`}>
                <Button variant="brand" size="sm" className="flex items-center gap-1.5">
                  <span>Complete Course Track</span>
                  <CheckCircle2 className="size-4" />
                </Button>
              </Link>
            )}
          </div>

        </div>

        {/* Right Pane (1/3): Scoped AI Tutor Widget */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                <Sparkles className="size-4 text-emerald-400" />
                <span>Lesson AI Tutor</span>
              </h2>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                RAG Context Mode
              </Badge>
            </div>

            {/* AI Tutor Widget bound specifically to this lesson title and lesson content */}
            <AITutorWidget lessonTitle={lesson.title} lessonContent={lesson.content} />
          </div>
        </div>

      </div>

    </main>
  );
}
