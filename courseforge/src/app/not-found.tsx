import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileQuestion, Home, BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-16 font-sans text-slate-100">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* 404 Icon Badge */}
        <div className="size-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/10">
          <FileQuestion className="size-10" />
        </div>

        <div className="space-y-2">
          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs">
            404 — Page Not Found
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Lost in the Learning Grid?
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The page or course module you are looking for does not exist or has been moved to a different curriculum track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="brand" className="w-full flex items-center justify-center gap-2">
              <Home className="size-4" />
              <span>Return to Home</span>
            </Button>
          </Link>

          <Link href="/courses" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full border-slate-800 hover:border-emerald-500/40 flex items-center justify-center gap-2 text-slate-300">
              <BookOpen className="size-4" />
              <span>Browse Catalog</span>
            </Button>
          </Link>
        </div>

      </div>
    </main>
  );
}
