import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { syncUserWithDatabase } from "@/lib/user-sync";
import { getAdminDashboardDataAction } from "@/app/actions/admin-actions";
import { AdminUserTable } from "@/components/admin/admin-user-table";
import { Badge } from "@/components/ui/badge";
import { UserCog, ArrowLeft } from "lucide-react";

export default async function AdminUserDirectoryPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in?redirect_url=/dashboard/admin/users");
  }

  const userId = clerkUser.id;
  const primaryEmail = (clerkUser.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`).toLowerCase();
  const isDevAdmin = primaryEmail.includes("abdullah") || primaryEmail.includes("ranaabdullah");

  const dbUser = await syncUserWithDatabase("ADMIN").catch(() => null);

  if (dbUser?.role !== "ADMIN" && !isDevAdmin) {
    redirect("/select-role");
  }

  const adminData = await getAdminDashboardDataAction();
  const users = adminData.users || [];

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
              User Directory
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <UserCog className="size-8 text-purple-400" />
            <span>User Directory & Role Management</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Search, assign roles, and manage all registered platform users in real-time.
          </p>
        </div>
      </div>

      {/* Dedicated User Table Component */}
      <AdminUserTable users={users} currentUserId={userId} />

    </main>
  );
}
