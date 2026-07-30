import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getInstructorAnalyticsAction } from "@/app/actions/analytics-actions";
import { QuizScoreBarChart } from "@/components/analytics/quiz-score-barchart";
import { EnrollmentLineChart } from "@/components/analytics/enrollment-linechart";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ArrowLeft } from "lucide-react";

export default async function InstructorAnalyticsPage() {
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

  // Fetch instructor pre-aggregated analytics data
  const analyticsData = await getInstructorAnalyticsAction();

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
              Analytics Suite
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <BarChart3 className="size-8 text-cyan-400" />
            <span>Interactive Student Analytics</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Recharts visual engine metrics tracking quiz score distribution and student enrollment timelines.
          </p>
        </div>
      </div>

      {/* Recharts Visual Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuizScoreBarChart data={analyticsData.scoreDistribution} />
        <EnrollmentLineChart data={analyticsData.courseEngagement} />
      </div>

    </main>
  );
}
