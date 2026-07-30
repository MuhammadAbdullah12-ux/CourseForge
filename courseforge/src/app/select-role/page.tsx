import React from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { RoleCardSelector } from "./role-card-selector";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default async function SelectRolePage() {
  const { userId } = await auth();

  // Determine current active database role for the logged-in user
  let currentRole = "UNAUTHENTICATED";
  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });
    if (dbUser?.role) {
      currentRole = dbUser.role;
    }
  }

  const isAdmin = currentRole === "ADMIN";

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 font-sans text-slate-100 min-h-[85vh] flex flex-col justify-center">
      
      {/* Header Title Section */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs rounded-full inline-flex items-center gap-1">
            <Sparkles className="size-3.5 text-emerald-400" />
            <span>Role Permission Control Matrix</span>
          </Badge>
          {isAdmin && (
            <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs px-2.5 py-0.5 font-bold">
              👑 Admin Universal Access Active
            </Badge>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-100 tracking-tight">
          Choose Your Access Mode on <span className="text-emerald-400">CourseForge</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          {isAdmin
            ? "As an Admin, you have universal super-user access to test all 3 role portals seamlessly."
            : "Select your desired access mode. Choosing higher-privileged portals will sign out your current session and open the Clerk Sign-In screen to log into an authorized account."}
        </p>
      </div>

      {/* Interactive Client Role Card Selector */}
      <RoleCardSelector currentRole={currentRole} />

    </main>
  );
}
