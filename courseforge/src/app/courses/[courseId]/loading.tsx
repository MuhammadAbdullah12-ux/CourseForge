import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CourseDetailLoading() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100">
      
      {/* Back Button Skeleton */}
      <div className="h-4 w-28 bg-slate-800 rounded animate-pulse mb-8" />

      {/* Main Dual-Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-emerald-500/10 rounded-md border border-emerald-500/20 animate-pulse" />
              <div className="h-6 w-28 bg-slate-800 rounded-md animate-pulse" />
            </div>
            <div className="h-10 w-3/4 bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-5 w-1/2 bg-slate-850 rounded-md animate-pulse" />
          </div>

          <div className="space-y-3">
            <div className="h-6 w-36 bg-slate-800 rounded animate-pulse" />
            <div className="h-20 w-full bg-slate-900/60 rounded-xl border border-slate-800 animate-pulse" />
          </div>

          {/* AI Tutor Card Skeleton */}
          <div className="h-56 w-full bg-slate-900/80 rounded-2xl border border-emerald-500/30 animate-pulse" />

          {/* Curriculum Modules Skeleton */}
          <div className="space-y-3">
            <div className="h-6 w-48 bg-slate-800 rounded animate-pulse" />
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-16 w-full bg-slate-900/50 rounded-xl border border-slate-800 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Right Sidebar Card Skeleton */}
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/40">
            <CardHeader className="space-y-2">
              <div className="h-6 w-36 bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-28 bg-slate-850 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-5 w-full bg-slate-800 rounded animate-pulse" />
              <div className="h-5 w-full bg-slate-800 rounded animate-pulse" />
              <div className="h-11 w-full bg-emerald-500/20 rounded-xl border border-emerald-500/30 animate-pulse" />
            </CardContent>
          </Card>
        </div>

      </div>

    </main>
  );
}
