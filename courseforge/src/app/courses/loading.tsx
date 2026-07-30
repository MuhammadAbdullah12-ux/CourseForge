import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CoursesLoading() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100">
      
      {/* Header Skeleton */}
      <div className="space-y-3 mb-10 text-center md:text-left">
        <div className="h-4 w-32 bg-slate-800 rounded-full animate-pulse mx-auto md:mx-0" />
        <div className="h-10 w-72 bg-slate-800 rounded-xl animate-pulse mx-auto md:mx-0" />
        <div className="h-4 w-96 bg-slate-850 rounded-lg animate-pulse mx-auto md:mx-0" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-10 space-y-4">
        <div className="h-11 w-full bg-slate-950 rounded-xl border border-slate-800 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-7 w-16 bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-7 w-20 bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-7 w-24 bg-slate-800 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Course Cards Grid Skeleton (6 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card key={idx} className="border-slate-800 bg-slate-900/40">
            <CardHeader className="space-y-3 pb-3">
              <div className="flex justify-between items-center">
                <div className="h-5 w-24 bg-emerald-500/10 border border-emerald-500/20 rounded-md animate-pulse" />
                <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
              </div>
              <div className="h-6 w-4/5 bg-slate-800 rounded-lg animate-pulse" />
              <div className="h-12 w-full bg-slate-850 rounded-lg animate-pulse" />
            </CardHeader>

            <CardContent className="pt-2 space-y-4">
              <div className="h-8 w-full bg-slate-800/80 rounded-xl animate-pulse" />
              <div className="h-10 w-full bg-emerald-500/20 rounded-xl border border-emerald-500/30 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

    </main>
  );
}
