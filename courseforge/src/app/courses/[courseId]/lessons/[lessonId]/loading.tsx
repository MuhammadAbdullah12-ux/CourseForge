import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LessonWorkspaceLoading() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-8 md:py-12 font-sans text-slate-100">
      
      {/* Breadcrumb Skeleton */}
      <div className="flex justify-between items-center pb-6 mb-8 border-b border-slate-800">
        <div className="h-4 w-40 bg-slate-800 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-emerald-500/10 rounded border border-emerald-500/20 animate-pulse" />
          <div className="h-6 w-28 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>

      {/* Main Dual-Pane Classroom Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Pane (2/3): Lesson Reader Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="space-y-2">
            <div className="h-8 w-3/4 bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-4 w-48 bg-slate-850 rounded animate-pulse" />
          </div>

          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="border-b border-slate-800 pb-3">
              <div className="h-4 w-36 bg-slate-800 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-11/12 bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-slate-800 rounded animate-pulse" />
              <div className="h-28 w-full bg-slate-950 rounded-xl border border-slate-800 animate-pulse" />
            </CardContent>
          </Card>

          {/* AI Quiz Skeleton */}
          <div className="h-56 w-full bg-slate-900/70 rounded-2xl border border-emerald-500/30 animate-pulse" />

          {/* Navigation Controls Skeleton */}
          <div className="flex justify-between border-t border-slate-800 pt-4">
            <div className="h-9 w-32 bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-9 w-32 bg-emerald-500/20 rounded-lg border border-emerald-500/30 animate-pulse" />
          </div>

        </div>

        {/* Right Pane (1/3): AI Tutor Sidebar Skeleton */}
        <div className="space-y-6">
          <div className="h-[480px] w-full bg-slate-900/80 rounded-2xl border border-emerald-500/30 animate-pulse" />
        </div>

      </div>

    </main>
  );
}
