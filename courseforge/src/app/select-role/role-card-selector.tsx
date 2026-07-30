"use client";

import React, { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { setUserRoleAction } from "@/app/actions/user-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, ShieldCheck, CheckCircle2, ArrowRight, Lock, Loader2 } from "lucide-react";

interface RoleCardSelectorProps {
  currentRole: string;
}

export function RoleCardSelector({ currentRole }: RoleCardSelectorProps) {
  const { signOut } = useClerk();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const isAdmin = currentRole === "ADMIN";
  const isInstructor = currentRole === "INSTRUCTOR";
  const isStudent = currentRole === "STUDENT";
  const isAuthenticated = currentRole !== "UNAUTHENTICATED";

  const handleRoleSelection = async (targetRole: "STUDENT" | "INSTRUCTOR" | "ADMIN") => {
    setLoadingRole(targetRole);

    try {
      // 1. Unauthenticated Visitor: Redirect to Sign-In for target role dashboard
      if (!isAuthenticated) {
        window.location.href = `/sign-in?redirect_url=/dashboard/${targetRole.toLowerCase()}`;
        return;
      }

      // 2. Admin Super-User: 1-Click Universal Access to all 3 roles!
      if (isAdmin) {
        await setUserRoleAction(targetRole);
        window.location.href = `/dashboard/${targetRole.toLowerCase()}`;
        return;
      }

      // 3. Student selecting Student Mode: Enters Student Dashboard
      if (targetRole === "STUDENT") {
        await setUserRoleAction("STUDENT");
        window.location.href = "/dashboard/student";
        return;
      }

      // 4. Instructor selecting Instructor Mode: Enters Instructor Portal
      if (targetRole === "INSTRUCTOR" && isInstructor) {
        window.location.href = "/dashboard/instructor";
        return;
      }

      // 5. Unauthorized Role Escalation (e.g. Student selecting Instructor or Admin):
      // Sign out active student session first, then open Clerk Sign-In screen for target role!
      await signOut();
      window.location.href = `/sign-in?redirect_url=/dashboard/${targetRole.toLowerCase()}`;
    } catch (err) {
      console.error("Role selection error:", err);
      // Fallback direct navigation
      window.location.href = `/sign-in?redirect_url=/dashboard/${targetRole.toLowerCase()}`;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Option 1: Student Mode (Emerald Green) */}
      <Card className="border-emerald-500/30 bg-slate-900/50 hover:bg-slate-900/80 hover:border-emerald-500/70 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-xl">
        <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-emerald-500/20 transition-colors">
          <GraduationCap className="size-28 -mr-6 -mt-6" />
        </div>

        <CardHeader className="relative z-10 pb-4">
          <div className="flex justify-between items-center mb-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-105 transition-transform">
              <GraduationCap className="size-7" />
            </div>
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
              {isAdmin || isInstructor || isStudent ? "1-Click Access" : "Sign In Required"}
            </Badge>
          </div>
          <CardTitle className="text-xl text-slate-100 font-bold">Student Mode</CardTitle>
          <CardDescription className="text-slate-400 text-xs mt-1">
            Explore courses, build skills, and learn with AI assistance.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 space-y-2.5 pb-6 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
            <span>Browse full course catalog</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
            <span>1-Click course enrollment</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
            <span>Lesson-scoped interactive AI tutors</span>
          </div>
        </CardContent>

        <div className="p-6 pt-0 relative z-10">
          <Button
            type="button"
            onClick={() => handleRoleSelection("STUDENT")}
            disabled={loadingRole !== null}
            variant="brand"
            className="w-full h-10 text-xs flex items-center justify-center gap-2 font-bold cursor-pointer"
          >
            {loadingRole === "STUDENT" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <span>Continue as Student</span>
                <ArrowRight className="size-3.5" />
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Option 2: Instructor Mode (Cyan / Teal) */}
      <Card className="border-cyan-500/40 bg-slate-900/50 hover:bg-slate-900/80 hover:border-cyan-500/70 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-xl">
        <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-cyan-500/20 transition-colors">
          <Briefcase className="size-28 -mr-6 -mt-6" />
        </div>

        <CardHeader className="relative z-10 pb-4">
          <div className="flex justify-between items-center mb-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 group-hover:scale-105 transition-transform">
              <Briefcase className="size-7" />
            </div>
            <Badge className={isAdmin || isInstructor ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px]" : "bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px]"}>
              {isAdmin || isInstructor ? "1-Click Access" : "Sign Out & Log In"}
            </Badge>
          </div>
          <CardTitle className="text-xl text-slate-100 font-bold">Instructor Mode</CardTitle>
          <CardDescription className="text-slate-400 text-xs mt-1">
            Create curriculum, publish courses, and track analytics.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 space-y-2.5 pb-6 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-cyan-400 shrink-0" />
            <span>Instructor Management Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-cyan-400 shrink-0" />
            <span>1-Click AI Course Creator</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-cyan-400 shrink-0" />
            <span>Recharts analytics visual suite</span>
          </div>
        </CardContent>

        <div className="p-6 pt-0 relative z-10">
          <Button
            type="button"
            onClick={() => handleRoleSelection("INSTRUCTOR")}
            disabled={loadingRole !== null}
            className="w-full h-10 text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-cyan-400 to-teal-400 text-slate-950 font-extrabold hover:from-cyan-400 hover:to-teal-300 cursor-pointer"
          >
            {loadingRole === "INSTRUCTOR" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <span>Continue as Instructor</span>
                {isAdmin || isInstructor ? <ArrowRight className="size-3.5" /> : <Lock className="size-3.5" />}
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Option 3: Admin Mode (Royal Purple) */}
      <Card className="border-purple-500/40 bg-slate-900/50 hover:bg-slate-900/80 hover:border-purple-500/70 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-xl">
        <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-purple-500/20 transition-colors">
          <ShieldCheck className="size-28 -mr-6 -mt-6" />
        </div>

        <CardHeader className="relative z-10 pb-4">
          <div className="flex justify-between items-center mb-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="size-7" />
            </div>
            <Badge className={isAdmin ? "bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px]" : "bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px]"}>
              {isAdmin ? "1-Click Access (Admin)" : "Sign Out & Log In"}
            </Badge>
          </div>
          <CardTitle className="text-xl text-slate-100 font-bold flex items-center gap-1.5">
            <span>Admin Mode</span>
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs mt-1">
            Super-user access to users, courses, and platform telemetry.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 space-y-2.5 pb-6 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-purple-400 shrink-0" />
            <span>Full user role management & deletion</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-purple-400 shrink-0" />
            <span>Platform-wide course moderation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-purple-400 shrink-0" />
            <span>Universal access to Student & Instructor portals</span>
          </div>
        </CardContent>

        <div className="p-6 pt-0 relative z-10">
          <Button
            type="button"
            onClick={() => handleRoleSelection("ADMIN")}
            disabled={loadingRole !== null}
            className="w-full h-10 text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-400 text-slate-950 font-extrabold hover:from-purple-400 hover:to-indigo-300 cursor-pointer"
          >
            {loadingRole === "ADMIN" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <span>Continue as Admin</span>
                {isAdmin ? <ArrowRight className="size-3.5" /> : <Lock className="size-3.5" />}
              </>
            )}
          </Button>
        </div>
      </Card>

    </div>
  );
}
