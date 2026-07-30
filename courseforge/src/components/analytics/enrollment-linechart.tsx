"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CourseEngagementItem } from "@/app/actions/analytics-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react";

interface EnrollmentLineChartProps {
  data: CourseEngagementItem[];
}

export function EnrollmentLineChart({ data }: EnrollmentLineChartProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl">
      <CardHeader className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Users className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base text-slate-100 font-bold flex items-center gap-1.5">
                <span>Course Engagement & Enrollments</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Enrollment volume and curriculum module engagement per course
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="courseTitle" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as CourseEngagementItem;
                    return (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl text-xs space-y-1.5">
                        <p className="font-bold text-emerald-400">{item.courseTitle}</p>
                        <div className="space-y-0.5 text-slate-200">
                          <p>Enrollments: <strong className="text-white font-mono">{item.enrollmentsCount}</strong></p>
                          <p>Modules: <strong className="text-white font-mono">{item.lessonsCount}</strong></p>
                          <p>Quiz Attempts: <strong className="text-emerald-400 font-mono">{item.quizzesCount}</strong></p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="enrollmentsCount"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#enrollmentGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
