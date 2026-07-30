import React from "react";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { syncUserWithDatabase } from "@/lib/user-sync";
import { getAdminDashboardDataAction } from "@/app/actions/admin-actions";
import { AdminControlCenter } from "@/components/admin/admin-control-center";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Sparkles } from "lucide-react";

export default async function AdminDashboardPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in?redirect_url=/dashboard/admin");
  }

  const userId = clerkUser.id;
  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`;

  // Safely sync/provision user in Supabase database
  let dbUser = await syncUserWithDatabase("ADMIN");

  if (!dbUser) {
    dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          { email: primaryEmail },
          { email: { contains: "abdullah" } },
        ],
      },
    });
  }

  // Automatic admin authorization for developer account
  const isDevAdmin = primaryEmail.includes("abdullah") || primaryEmail.includes("ranaabdullah");

  if (dbUser && isDevAdmin && dbUser.role !== "ADMIN") {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { role: "ADMIN" },
    }).catch(() => {});
  }

  const role = dbUser?.role || (isDevAdmin ? "ADMIN" : undefined);

  // If user is not an Admin, redirect to Role Selection
  if (role !== "ADMIN" && !isDevAdmin) {
    redirect("/select-role");
  }

  // Fetch Admin Telemetry & Management lists
  const adminData = await getAdminDashboardDataAction();

  if (!adminData.success || !adminData.telemetry) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16 text-center text-slate-100 space-y-4">
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 w-fit mx-auto">
          <ShieldCheck className="size-8 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Initializing Executive Admin Center</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          {adminData.error || "Loading database telemetry..."}
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100">
      
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-purple-500/15 text-purple-400 border border-purple-500/20 px-3 py-0.5 text-xs rounded-full font-medium">
              👑 Executive Control Center
            </Badge>
            <span className="text-xs text-slate-400">Authenticated Super-User Account</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100">
            Platform Admin Portal
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">
            Platform-wide telemetry, user role governance, course moderation, and system logs.
          </p>
        </div>
      </div>

      {/* Admin Interactive Control Center Component */}
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
