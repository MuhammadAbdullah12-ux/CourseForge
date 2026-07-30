"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  updateUserRoleAdminAction,
  deleteUserAdminAction,
  toggleCoursePublishedAdminAction,
  deleteCourseAdminAction,
} from "@/app/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  Shield,
  GraduationCap,
  Activity,
  Search,
  Trash2,
  Eye,
  EyeOff,
  UserCheck,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCog,
} from "lucide-react";

interface AdminControlCenterProps {
  telemetry: {
    totalUsers: number;
    studentCount: number;
    instructorCount: number;
    adminCount: number;
    totalCourses: number;
    publishedCoursesCount: number;
    totalEnrollments: number;
    totalQuizAttempts: number;
  };
  initialUsers: any[];
  initialCourses: any[];
  activityLogs: any[];
  currentUserId: string;
}

export function AdminControlCenter({
  telemetry,
  initialUsers,
  initialCourses,
  activityLogs,
  currentUserId,
}: AdminControlCenterProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "courses" | "logs">("overview");
  const [usersSearch, setUsersSearch] = useState("");
  const [coursesSearch, setCoursesSearch] = useState("");
  
  const [usersList, setUsersList] = useState(initialUsers);
  const [coursesList, setCoursesList] = useState(initialCourses);
  
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter users by search
  const filteredUsers = usersList.filter(
    (u) =>
      u.email.toLowerCase().includes(usersSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(usersSearch.toLowerCase())
  );

  // Filter courses by search
  const filteredCourses = coursesList.filter(
    (c) =>
      c.title.toLowerCase().includes(coursesSearch.toLowerCase()) ||
      c.instructor.email.toLowerCase().includes(coursesSearch.toLowerCase())
  );

  // 1. Handle Role Change
  const handleRoleChange = (userId: string, newRole: "STUDENT" | "INSTRUCTOR" | "ADMIN") => {
    startTransition(async () => {
      setFeedbackMsg(null);
      const res = await updateUserRoleAdminAction(userId, newRole);
      if (res.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setFeedbackMsg({ type: "success", text: res.message || "Role updated successfully." });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to update role." });
      }
    });
  };

  // 2. Handle User Deletion
  const handleDeleteUser = (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user "${email}"? This action cannot be undone.`)) return;

    startTransition(async () => {
      setFeedbackMsg(null);
      const res = await deleteUserAdminAction(userId);
      if (res.success) {
        setUsersList((prev) => prev.filter((u) => u.id !== userId));
        setFeedbackMsg({ type: "success", text: res.message || "User deleted." });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to delete user." });
      }
    });
  };

  // 3. Handle Course Published Toggle
  const handleToggleCoursePublished = (courseId: string) => {
    startTransition(async () => {
      setFeedbackMsg(null);
      const res = await toggleCoursePublishedAdminAction(courseId);
      if (res.success) {
        setCoursesList((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, published: !c.published } : c))
        );
        setFeedbackMsg({ type: "success", text: res.message || "Course status updated." });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to toggle status." });
      }
    });
  };

  // 4. Handle Course Deletion
  const handleDeleteCourse = (courseId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete course "${title}"? This deletes all associated lessons and enrollments.`)) return;

    startTransition(async () => {
      setFeedbackMsg(null);
      const res = await deleteCourseAdminAction(courseId);
      if (res.success) {
        setCoursesList((prev) => prev.filter((c) => c.id !== courseId));
        setFeedbackMsg({ type: "success", text: res.message || "Course deleted." });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to delete course." });
      }
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            feedbackMsg.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-red-500/10 text-red-400 border-red-500/30"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "overview"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Activity className="size-3.5" />
          <span>Platform Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "users"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <UserCog className="size-3.5" />
          <span>User Management ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "courses"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <BookOpen className="size-3.5" />
          <span>Course Moderation ({coursesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "logs"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          <Sparkles className="size-3.5" />
          <span>Activity Stream</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW TELEMETRY */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          
          {/* Executive Telemetry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-slate-400">Total Users</CardTitle>
                <Users className="size-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-slate-100">{telemetry.totalUsers}</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {telemetry.studentCount} Students · {telemetry.instructorCount} Instructors
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-slate-400">Published Courses</CardTitle>
                <BookOpen className="size-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-slate-100">{telemetry.publishedCoursesCount}</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Out of {telemetry.totalCourses} total created tracks
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-slate-400">Student Enrollments</CardTitle>
                <GraduationCap className="size-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-slate-100">{telemetry.totalEnrollments}</div>
                <p className="text-[11px] text-slate-400 mt-1">Active learning subscriptions</p>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-slate-400">AI Quiz Evaluations</CardTitle>
                <Activity className="size-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-slate-100">{telemetry.totalQuizAttempts}</div>
                <p className="text-[11px] text-slate-400 mt-1">Evaluated platform attempts</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Switcher / Portal Impersonation Card */}
          <Card className="border-emerald-500/30 bg-slate-900/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Shield className="size-4 text-emerald-400" />
                  <span>Admin Omnipresence Mode</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  As an Admin, you have universal access to preview both student and instructor dashboards without changing accounts.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/dashboard/student" className="flex-1">
                <Button variant="outline" className="w-full justify-between border-slate-800 hover:border-emerald-500/40 text-xs">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="size-4 text-emerald-400" />
                    <span>Access Student Dashboard</span>
                  </span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </Button>
              </Link>

              <Link href="/dashboard/instructor" className="flex-1">
                <Button variant="outline" className="w-full justify-between border-slate-800 hover:border-emerald-500/40 text-xs">
                  <span className="flex items-center gap-2">
                    <UserCheck className="size-4 text-emerald-400" />
                    <span>Access Instructor Portal</span>
                  </span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </Button>
              </Link>
            </div>
          </Card>

        </div>
      )}

      {/* TAB 2: USER MANAGEMENT TABLE */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
              <input
                type="text"
                value={usersSearch}
                onChange={(e) => setUsersSearch(e.target.value)}
                placeholder="Search users by email or role..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4">User Email</th>
                    <th className="p-4">Current Role</th>
                    <th className="p-4">Created Tracks</th>
                    <th className="p-4">Enrollments</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((u) => {
                    const isSelf = u.clerkId === currentUserId;
                    return (
                      <tr key={u.id} className="hover:bg-slate-900/80 transition-colors">
                        <td className="p-4 font-mono text-slate-100">
                          {u.email} {isSelf && <span className="text-[10px] text-emerald-400 font-sans ml-1">(You)</span>}
                        </td>
                        <td className="p-4">
                          <Badge
                            className={
                              u.role === "ADMIN"
                                ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                                : u.role === "INSTRUCTOR"
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-slate-800 text-slate-300"
                            }
                          >
                            {u.role}
                          </Badge>
                        </td>
                        <td className="p-4 font-mono">{u._count.courses}</td>
                        <td className="p-4 font-mono">{u._count.enrollments}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Role Dropdown Switcher */}
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                              disabled={isPending}
                              className="bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-200 p-1 focus:outline-none focus:border-emerald-500"
                            >
                              <option value="STUDENT">Set Student</option>
                              <option value="INSTRUCTOR">Set Instructor</option>
                              <option value="ADMIN">Set Admin</option>
                            </select>

                            {/* Delete User Button */}
                            {!isSelf && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                disabled={isPending}
                                className="text-red-400 hover:bg-red-500/10 hover:text-red-300 p-1.5 h-auto"
                                title="Delete user"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COURSE MODERATION TABLE */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
              <input
                type="text"
                value={coursesSearch}
                onChange={(e) => setCoursesSearch(e.target.value)}
                placeholder="Search courses by title or instructor email..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Course Title</th>
                    <th className="p-4">Instructor</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Modules</th>
                    <th className="p-4">Students</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/80 transition-colors">
                      <td className="p-4 font-bold text-slate-100 max-w-xs truncate">{c.title}</td>
                      <td className="p-4 text-slate-400">{c.instructor?.email}</td>
                      <td className="p-4">
                        <Badge
                          className={
                            c.published
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : "bg-slate-800 text-slate-400"
                          }
                        >
                          {c.published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono">{c._count.lessons}</td>
                      <td className="p-4 font-mono">{c._count.enrollments}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Toggle Published State */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleCoursePublished(c.id)}
                            disabled={isPending}
                            className="text-[11px] h-7 px-2 border-slate-800"
                          >
                            {c.published ? (
                              <span className="flex items-center gap-1 text-slate-400">
                                <EyeOff className="size-3" /> Unpublish
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-emerald-400">
                                <Eye className="size-3" /> Publish
                              </span>
                            )}
                          </Button>

                          {/* Delete Course */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCourse(c.id, c.title)}
                            disabled={isPending}
                            className="text-red-400 hover:bg-red-500/10 hover:text-red-300 p-1.5 h-auto"
                            title="Delete course"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVITY LOGS */}
      {activeTab === "logs" && (
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-400" />
              <span>Real-Time Activity Stream</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              System events and platform telemetry audit trail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-200">{log.message}</p>
                  <span className="text-[10px] text-emerald-400 font-mono">{log.type}</span>
                </div>
                <span className="text-[11px] text-slate-500">{log.timestamp}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
