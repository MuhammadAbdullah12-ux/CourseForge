import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function InstructorDashboardLoading() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100">
      
      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-6 mb-10 border-b border-slate-800">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-emerald-500/10 border border-emerald-500/20 rounded-md animate-pulse" />
          <div className="h-9 w-72 bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-4 w-96 bg-slate-850 rounded animate-pulse" />
        </div>
      </div>

      {/* Analytics Overview Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx} className="border-slate-800 bg-slate-900/60">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-28 bg-slate-800 rounded animate-pulse" />
                <div className="h-8 w-16 bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-3 w-32 bg-slate-850 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="h-80 w-full bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse" />
        <div className="h-80 w-full bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse" />
      </div>

      {/* AI Authoring Card Skeleton */}
      <div className="h-64 w-full bg-slate-900/80 rounded-2xl border border-emerald-500/30 animate-pulse mb-12" />

      {/* Published Courses Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-48 w-full bg-slate-900/50 rounded-2xl border border-slate-800 animate-pulse" />
          ))}
        </div>
      </div>

    </main>
  );
}
