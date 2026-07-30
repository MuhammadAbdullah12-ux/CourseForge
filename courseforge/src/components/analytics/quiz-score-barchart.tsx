"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { ScoreDistributionItem } from "@/app/actions/analytics-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, Sparkles } from "lucide-react";

interface QuizScoreBarChartProps {
  data: ScoreDistributionItem[];
}

const BAR_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

export function QuizScoreBarChart({ data }: QuizScoreBarChartProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl">
      <CardHeader className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Award className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base text-slate-100 font-bold flex items-center gap-1.5">
                <span>Quiz Score Distribution</span>
                <Sparkles className="size-3.5 text-emerald-400" />
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Student performance breakdown across score ranges
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as ScoreDistributionItem;
                    return (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl text-xs space-y-1">
                        <p className="font-bold text-emerald-400">{item.category} ({item.label})</p>
                        <p className="text-slate-200">
                          Total Attempts: <strong className="text-white font-mono">{item.count}</strong>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
