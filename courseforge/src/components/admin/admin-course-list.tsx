"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  toggleCoursePublishedAdminAction,
  deleteCourseAdminAction,
} from "@/app/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Sliders, Eye, EyeOff, Trash2, BookOpen } from "lucide-react";

interface AdminCourseListProps {
  courses: any[];
}

export function AdminCourseList({ courses: initialCourses }: AdminCourseListProps) {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleTogglePublish = (courseId: string, currentStatus: boolean) => {
    startTransition(async () => {
      const res = await toggleCoursePublishedAdminAction(courseId);
      if (res.success) {
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, published: !currentStatus } : c))
        );
      }
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    if (!confirm("Are you sure you want to permanently delete this course?")) return;
    startTransition(async () => {
      const res = await deleteCourseAdminAction(courseId);
      if (res.success) {
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
      }
    });
  };

  return (
    <Card className="border-purple-500/30 bg-slate-900/50 backdrop-blur-md">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="size-5 text-purple-400" />
            <span>Course Moderation</span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Total {courses.length} courses published by instructors
          </CardDescription>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="size-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <Badge
                    className={
                      course.published
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    }
                  >
                    {course.published ? "Published" : "Draft"}
                  </Badge>
                  <h3 className="text-sm font-bold text-slate-100 mt-1">{course.title}</h3>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleTogglePublish(course.id, course.published)}
                    className="h-7 text-xs border-slate-800"
                  >
                    {course.published ? (
                      <EyeOff className="size-3 text-amber-400" />
                    ) : (
                      <Eye className="size-3 text-emerald-400" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => handleDeleteCourse(course.id)}
                    className="h-7 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 flex items-center justify-between">
                <span>Instructor: {course.instructor.email}</span>
                <span>{course.enrollments?.length || 0} students</span>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
