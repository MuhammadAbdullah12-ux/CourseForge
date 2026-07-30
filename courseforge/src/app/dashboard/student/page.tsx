import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Award, CheckCircle2, Trophy, Clock, ArrowRight, PlayCircle, BarChart3 } from "lucide-react";

export default async function StudentDashboardPage() {
  const { userId, sessionClaims } = await auth();

  // 1. Redirect unauthenticated visitors to sign-in
  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard/student");
  }

  // 2. Fetch User from Supabase PostgreSQL with enrollments & quizAttempts
  const userEmail =
    (sessionClaims?.email as string) ||
    `user_${userId.slice(-6)}@courseforge.com`;

  const dbUser = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email: userEmail,
      role: "STUDENT",
    },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              instructor: true,
              lessons: {
                orderBy: {
                  order: "asc",
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      quizAttempts: {
        include: {
          lesson: {
            include: {
              course: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // 3. Compute Analytics Metrics
  const enrolledCount = dbUser.enrollments.length;
  const quizCount = dbUser.quizAttempts.length;

  let totalScoreEarned = 0;
  let totalScorePossible = 0;

  dbUser.quizAttempts.forEach((attempt) => {
    totalScoreEarned += attempt.score;
    totalScorePossible += attempt.total;
  });

  const averagePercentage =
    totalScorePossible > 0
      ? Math.round((totalScoreEarned / totalScorePossible) * 100)
      : 0;

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-10 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-xs">
              Student Command Center
            </Badge>
            <span className="text-xs text-slate-400">Live Supabase Persistence</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="size-8 text-emerald-400" />
            <span>Learning Dashboard</span>
          </h1>
          <p className="text-sm text-slate-400">
            Track your course progress, AI quiz scores, and learning performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/courses">
            <Button variant="brand" size="sm" className="flex items-center gap-1.5">
              <BookOpen className="size-4" />
              <span>Browse Catalog</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Stat 1: Active Enrollments */}
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enrolled Courses</span>
              <h3 className="text-3xl font-extrabold text-slate-100">{enrolledCount}</h3>
              <p className="text-xs text-slate-400">Active learning tracks</p>
            </div>
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
              <BookOpen className="size-6" />
            </div>
          </CardContent>
        </Card>

        {/* Stat 2: Quizzes Attempted */}
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quizzes Completed</span>
              <h3 className="text-3xl font-extrabold text-slate-100">{quizCount}</h3>
              <p className="text-xs text-slate-400">AI knowledge checks</p>
            </div>
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
              <Award className="size-6" />
            </div>
          </CardContent>
        </Card>

        {/* Stat 3: Average Quiz Score */}
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Score</span>
              <h3 className="text-3xl font-extrabold text-emerald-400">{averagePercentage}%</h3>
              <p className="text-xs text-slate-400">Overall quiz accuracy</p>
            </div>
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
              <BarChart3 className="size-6" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Main Dual-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3): Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="size-5 text-emerald-400" />
              <span>Your Enrolled Courses ({enrolledCount})</span>
            </h2>
          </div>

          {dbUser.enrollments.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/40 py-12 text-center">
              <CardContent className="space-y-3">
                <div className="p-3 bg-slate-800/60 rounded-full text-slate-400 w-fit mx-auto">
                  <BookOpen className="size-6" />
                </div>
                <h3 className="text-base font-bold text-slate-200">No active course enrollments yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Explore our catalog and enroll in courses to start learning with lesson-scoped AI tutors.
                </p>
                <Link href="/courses" className="inline-block mt-2">
                  <Button variant="brand" size="sm">
                    Browse Course Catalog
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {dbUser.enrollments.map((enrollment) => {
                const course = enrollment.course;
                const firstLesson = course.lessons[0];
                const instructorName = course.instructor.email.split("@")[0];

                return (
                  <Card key={enrollment.id} className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[11px] mb-2">
                            Enrolled Track
                          </Badge>
                          <CardTitle className="text-lg font-bold text-slate-100">
                            {course.title}
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-400 mt-1">
                            Instructor: <span className="capitalize text-slate-300 font-medium">{instructorName}</span> • {course.lessons.length} Modules
                          </CardDescription>
                        </div>

                        {firstLesson && (
                          <Link href={`/courses/${course.id}/lessons/${firstLesson.id}`}>
                            <Button variant="brand" size="sm" className="flex items-center gap-1.5 shrink-0">
                              <PlayCircle className="size-4" />
                              <span>Continue</span>
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardHeader>

                    {/* Progress Bar Indicator */}
                    <CardContent className="pt-0">
                      <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Curriculum Progress</span>
                          <span className="text-emerald-400 font-semibold">Ready to Learn</span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-emerald-500 rounded-full w-1/3 animate-pulse" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (1/3): Quiz History Table */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="size-5 text-emerald-400" />
            <span>Quiz Attempts History</span>
          </h2>

          {dbUser.quizAttempts.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/40 p-6 text-center text-xs text-slate-400 space-y-2">
              <p>No quiz scores recorded yet.</p>
              <p className="text-[11px] text-slate-500">
                Complete AI quizzes inside lesson workspaces to view your grade history.
              </p>
            </Card>
          ) : (
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-4 space-y-3">
                {dbUser.quizAttempts.map((attempt) => {
                  const percentage = Math.round((attempt.score / attempt.total) * 100);
                  const isPerfect = attempt.score === attempt.total;
                  const attemptDate = new Date(attempt.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div key={attempt.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="space-y-0.5 max-w-[170px]">
                        <h4 className="font-semibold text-slate-200 line-clamp-1">
                          {attempt.lesson.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{attemptDate}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <Badge
                          className={
                            isPerfect
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs"
                          }
                        >
                          {attempt.score}/{attempt.total} ({percentage}%)
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

      </div>

    </main>
  );
}
