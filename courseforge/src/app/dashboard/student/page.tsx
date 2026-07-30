import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { UnenrollButton } from "@/components/unenroll-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Award, Trophy, PlayCircle, BarChart3 } from "lucide-react";

export default async function StudentDashboardPage() {
  const { userId } = await auth();

  // 1. Redirect unauthenticated visitors to sign-in
  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard/student");
  }

  // 2. Safely resolve User from Supabase PostgreSQL with enrollments & quizAttempts
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
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

  // Strict Role Check: Instructors entering Student dashboard are sent to Instructor Management Portal
  if (dbUser?.role === "INSTRUCTOR") {
    redirect("/dashboard/instructor");
  }

  // Fallback lazy database provisioning
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: `${userId}@placeholder.com`,
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
  }

  const enrollments = dbUser.enrollments || [];
  const quizAttempts = dbUser.quizAttempts || [];

  // Calculate student progress metrics
  const totalEnrolled = enrollments.length;
  const totalQuizzesTaken = quizAttempts.length;
  
  let averageQuizScore = 0;
  if (totalQuizzesTaken > 0) {
    const totalPercentageSum = quizAttempts.reduce(
      (sum, attempt) => sum + (attempt.score / attempt.total) * 100,
      0
    );
    averageQuizScore = Math.round(totalPercentageSum / totalQuizzesTaken);
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-0.5 text-xs rounded-full font-medium">
              Student Command Center
            </Badge>
            <span className="text-xs text-slate-400">Authenticated Student Account</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100">
            Student Dashboard
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">
            Track your enrolled learning tracks, lesson progress, and evaluated AI practice quiz scores.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-3">
          <Link href="/courses">
            <Button variant="brand" className="flex items-center gap-2">
              <BookOpen className="size-4" />
              <span>Explore Course Catalog</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Enrolled Tracks</CardTitle>
            <GraduationCap className="size-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-100">{totalEnrolled}</div>
            <p className="text-xs text-slate-400 mt-1">Active course subscriptions</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Evaluated AI Quizzes</CardTitle>
            <Award className="size-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-100">{totalQuizzesTaken}</div>
            <p className="text-xs text-slate-400 mt-1">Completed quiz evaluations</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Average Quiz Accuracy</CardTitle>
            <Trophy className="size-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-100">
              {totalQuizzesTaken > 0 ? `${averageQuizScore}%` : "N/A"}
            </div>
            <p className="text-xs text-slate-400 mt-1">Overall percentage accuracy</p>
          </CardContent>
        </Card>

      </div>

      {/* Main Content Grid (Enrolled Tracks & Quiz History) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3): Enrolled Courses Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="size-5 text-emerald-400" />
              <span>Your Enrolled Learning Tracks</span>
            </h2>
            <Badge variant="outline" className="text-xs border-slate-800 text-slate-400">
              {enrollments.length} Active Courses
            </Badge>
          </div>

          {enrollments.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/40 py-12 text-center">
              <CardContent className="space-y-3">
                <div className="p-3 bg-slate-800/60 rounded-full text-slate-400 w-fit mx-auto">
                  <GraduationCap className="size-6" />
                </div>
                <h3 className="text-base font-bold text-slate-200">No course enrollments yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Browse our interactive course catalog and enroll in your first track to start learning with AI tutors.
                </p>
                <Link href="/courses">
                  <Button variant="outline" size="sm" className="mt-2 border-slate-700 text-slate-300 hover:text-white">
                    Explore Catalog
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => {
                const course = enrollment.course;
                const firstLesson = course.lessons[0];
                const instructorName = course.instructor.email.split("@")[0];

                return (
                  <Card key={enrollment.id} className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-all p-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[10px]">
                            Enrolled Track
                          </Badge>
                          <span className="text-[11px] text-slate-400 capitalize">
                            Instructor: {instructorName}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-100">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {course.description}
                        </p>
                      </div>

                      {/* Continue Learning CTA & Unenroll Button */}
                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                        <UnenrollButton courseId={course.id} />

                        {firstLesson ? (
                          <Link href={`/courses/${course.id}/lessons/${firstLesson.id}`}>
                            <Button variant="brand" size="sm" className="flex items-center gap-1.5 text-xs">
                              <PlayCircle className="size-4" />
                              <span>Continue Learning</span>
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/courses/${course.id}`}>
                            <Button variant="outline" size="sm" className="text-xs border-slate-700">
                              View Syllabus
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (1/3): Quiz History Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="size-5 text-emerald-400" />
              <span>Recent AI Quiz Results</span>
            </h2>
          </div>

          {quizAttempts.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/40 py-8 text-center">
              <CardContent className="space-y-2">
                <p className="text-xs text-slate-400">No AI practice quizzes taken yet.</p>
                <span className="text-[11px] text-slate-500 block">
                  Complete lesson reading material to take practice quizzes.
                </span>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {quizAttempts.slice(0, 5).map((attempt) => {
                const percentage = Math.round((attempt.score / attempt.total) * 100);
                const isPassed = percentage >= 60;

                return (
                  <Card key={attempt.id} className="border-slate-800 bg-slate-900/60 p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 line-clamp-1 flex-1 pr-2">
                        {attempt.lesson.title}
                      </span>
                      <Badge className={isPassed ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                        {percentage}%
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
                      <span className="text-slate-500">
                        {attempt.lesson.course.title.slice(0, 18)}...
                      </span>
                      <span className="font-mono text-slate-300">
                        {attempt.score}/{attempt.total} Correct
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </main>
  );
}
