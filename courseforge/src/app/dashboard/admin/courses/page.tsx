import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getAdminDashboardDataAction } from "@/app/actions/admin-actions";
import { AdminCourseList } from "@/components/admin/admin-course-list";
import { Badge } from "@/components/ui/badge";
import { Sliders, ArrowLeft } from "lucide-react";

export default async function AdminCourseModerationPage() {
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

  const { courses } = await getAdminDashboardDataAction();

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
              Course Moderation
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <Sliders className="size-8 text-purple-400" />
            <span>Platform Course Moderation</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Publish, unpublish, or remove courses across the platform.
          </p>
        </div>
      </div>

      {/* Dedicated Course List Component */}
      <AdminCourseList courses={courses} />

    </main>
  );
}
