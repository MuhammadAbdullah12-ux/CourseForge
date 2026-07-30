"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RotateCcw, BookOpen } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CoursesError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Courses Catalog Error Caught:", error);
  }, [error]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-center font-sans text-slate-100">
      <div className="max-w-md mx-auto space-y-6">
        <div className="size-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
          <AlertTriangle className="size-8" />
        </div>

        <div className="space-y-2">
          <Badge className="bg-red-500/15 text-red-400 border border-red-500/30 text-xs">
            Course Catalog Connection Error
          </Badge>
          <h2 className="text-xl font-bold text-slate-100">
            Unable to load course catalog
          </h2>
          <p className="text-xs text-slate-400">
            {error?.message || "Check your network connection and try again."}
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={() => reset()} variant="brand" size="sm" className="flex items-center gap-1.5">
            <RotateCcw className="size-4" />
            <span>Reload Courses</span>
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-slate-800 text-slate-300">
              <BookOpen className="size-4" />
              <span>Catalog Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
