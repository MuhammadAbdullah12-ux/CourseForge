"use client";

import React, { useState, useTransition } from "react";
import { updateUserRoleAdminAction, deleteUserAdminAction } from "@/app/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Trash2, UserCog, CheckCircle2 } from "lucide-react";

interface AdminUserTableProps {
  users: any[];
  currentUserId: string;
}

export function AdminUserTable({ users: initialUsers, currentUserId }: AdminUserTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: "STUDENT" | "INSTRUCTOR" | "ADMIN") => {
    startTransition(async () => {
      const res = await updateUserRoleAdminAction(userId, newRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm("Are you sure you want to delete this user account?")) return;
    startTransition(async () => {
      const res = await deleteUserAdminAction(userId);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    });
  };

  return (
    <Card className="border-purple-500/30 bg-slate-900/50 backdrop-blur-md">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <UserCog className="size-5 text-purple-400" />
            <span>User Management</span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Total {users.length} registered accounts
          </CardDescription>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="size-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">User Email</th>
                <th className="pb-3 font-semibold">Current Role</th>
                <th className="pb-3 font-semibold">Role Switcher</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-950/40">
                  <td className="py-3 font-medium">
                    {user.email}
                    {user.clerkId === currentUserId && (
                      <span className="ml-2 text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                        (You)
                      </span>
                    )}
                  </td>

                  <td className="py-3">
                    <Badge
                      className={
                        user.role === "ADMIN"
                          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          : user.role === "INSTRUCTOR"
                          ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>

                  <td className="py-3">
                    <select
                      value={user.role}
                      disabled={isPending}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value as any)
                      }
                      className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500"
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="INSTRUCTOR">INSTRUCTOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <td className="py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isPending || user.clerkId === currentUserId}
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 text-xs"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
