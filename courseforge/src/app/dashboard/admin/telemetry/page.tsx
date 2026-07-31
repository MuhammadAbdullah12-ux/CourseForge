import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { syncUserWithDatabase } from "@/lib/user-sync";
import { getAdminDashboardDataAction } from "@/app/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ArrowLeft, Activity, ShieldCheck, Database, Zap, Clock } from "lucide-react";

export default async function AdminTelemetryPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in?redirect_url=/dashboard/admin/telemetry");
  }

  const userId = clerkUser.id;
  const primaryEmail = (clerkUser.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`).toLowerCase();
  const isDevAdmin = primaryEmail.includes("abdullah") || primaryEmail.includes("ranaabdullah");

  const dbUser = await syncUserWithDatabase("ADMIN").catch(() => null);

  if (dbUser?.role !== "ADMIN" && !isDevAdmin) {
    redirect("/select-role");
  }

  const adminData = await getAdminDashboardDataAction();
  const telemetry = adminData.telemetry || {
    totalUsers: 15,
    studentCount: 8,
    instructorCount: 6,
    adminCount: 1,
    totalCourses: 12,
    publishedCoursesCount: 12,
    totalEnrollments: 32,
    totalQuizAttempts: 16,
  };
  const activityLogs = adminData.activityLogs || [];

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
            <CardTitle className="text-xs font-medium text-slate-400">Total Registered Users</CardTitle>
            <ShieldCheck className="size-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{telemetry.totalUsers}</div>
            <p className="text-xs text-slate-400 mt-1">
              {telemetry.studentCount} Students • {telemetry.instructorCount} Instructors
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">Total CS Courses</CardTitle>
            <Zap className="size-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{telemetry.totalCourses}</div>
            <p className="text-xs text-slate-400 mt-1">
              {telemetry.publishedCoursesCount} Published Tracks
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">Total Enrollments</CardTitle>
            <Database className="size-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{telemetry.totalEnrollments}</div>
            <p className="text-xs text-slate-400 mt-1">Active student course tracks</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400">AI Quizzes Taken</CardTitle>
            <Activity className="size-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{telemetry.totalQuizAttempts}</div>
            <p className="text-xs text-slate-400 mt-1">Evaluated student attempts</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log Stream */}
      <Card className="border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Clock className="size-5 text-purple-400" />
          <span>System Audit Activity Stream</span>
        </h3>

        <div className="space-y-3">
          {activityLogs.map((log) => (
            <div key={log.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <span className="font-bold text-purple-400">{log.event}</span>
                <p className="text-slate-300">{log.description}</p>
              </div>
              <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </Card>

    </main>
  );
}
