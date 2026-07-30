import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getAdminDashboardDataAction } from "@/app/actions/admin-actions";
import { AdminControlCenter } from "@/components/admin/admin-control-center";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Sparkles } from "lucide-react";

export default async function AdminDashboardPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check role in Clerk claims or fallback database query
  let role: string | undefined = undefined;
  if (sessionClaims && typeof sessionClaims === "object") {
    const metadata = (sessionClaims as Record<string, any>).metadata;
    if (metadata && typeof metadata === "object") {
      role = metadata.role;
    }
  }

  if (role !== "ADMIN") {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });
    role = dbUser?.role;
  }

  // If user is not an Admin, redirect to Role Selection
  if (role !== "ADMIN") {
    redirect("/select-role");
  }

  // Fetch Admin Telemetry & Management lists
  const adminData = await getAdminDashboardDataAction();

  if (!adminData.success || !adminData.telemetry) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16 text-center text-slate-100">
        <p className="text-red-400">Failed to load Admin Control Center data.</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-0.5 text-xs rounded-full font-semibold flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" />
              <span>Super-User Control Center</span>
            </Badge>
            <span className="text-xs text-slate-400">Platform-Wide Admin Privileges</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Executive Admin Portal</span>
            <Sparkles className="size-6 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">
            Manage users, update account roles, moderate published courses, and monitor platform telemetry.
          </p>
        </div>
      </div>

      {/* Interactive Admin Control Center */}
      <AdminControlCenter
        telemetry={adminData.telemetry}
        initialUsers={adminData.users}
        initialCourses={adminData.courses}
        activityLogs={adminData.activityLogs}
        currentUserId={userId}
      />

    </main>
  );
}
