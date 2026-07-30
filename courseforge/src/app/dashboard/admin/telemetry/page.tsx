import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getAdminDashboardDataAction } from "@/app/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ArrowLeft, Activity, ShieldCheck, Database, Zap, Clock } from "lucide-react";

export default async function AdminTelemetryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Live PostgreSQL Role Verification
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (dbUser?.role !== "ADMIN") {
    redirect("/dashboard/student");
  }

  const { telemetry, activityLogs } = await getAdminDashboardDataAction();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/admin" className="text-xs text-purple-400 hover:underline flex items-center gap-1">
              <ArrowLeft className="size-3" />
              <span>Admin Portal</span>
            </Link>
            <span className="text-slate-600">/</span>
            <Badge className="bg-purple-500/15 text-purple-400 border border-purple-500/30 px-3 py-0.5 text-xs rounded-full font-medium">
              System Telemetry
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <BarChart3 className="size-8 text-purple-400" />
            <span>Platform Telemetry & Audit Stream</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time metrics, database performance stats, and system activity logs.
          </p>
        </div>
      </div>

      {/* Telemetry Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="border-purple-500/30 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">Total Users</CardTitle>
            <Database className="size-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-100">{telemetry?.totalUsers || 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">Supabase DB rows</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">Courses</CardTitle>
            <Zap className="size-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-100">{telemetry?.totalCourses || 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">{telemetry?.publishedCoursesCount || 0} published</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">Enrollments</CardTitle>
            <ShieldCheck className="size-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-100">{telemetry?.totalEnrollments || 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">Active student links</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">AI Quizzes</CardTitle>
            <Activity className="size-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-100">{telemetry?.totalQuizAttempts || 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">Evaluations logged</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log Stream */}
      <Card className="border-purple-500/30 bg-slate-900/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Activity className="size-5 text-purple-400" />
            <span>Audit Trail Activity Stream</span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Real-time audit log entries recorded across the system.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {(activityLogs || []).map((log: any) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-semibold text-purple-300 block">{log.action}</span>
                  <span className="text-slate-400 text-[11px]">{log.details}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 shrink-0 text-[11px]">
                  <Clock className="size-3" />
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </main>
  );
}
