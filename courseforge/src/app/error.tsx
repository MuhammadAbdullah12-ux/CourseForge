"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Unhandled Global Error Caught:", error);
  }, [error]);

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-16 font-sans text-slate-100">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Error Warning Badge */}
        <div className="size-20 mx-auto rounded-3xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 shadow-2xl shadow-red-500/10">
          <AlertTriangle className="size-10" />
        </div>

        <div className="space-y-2">
          <Badge className="bg-red-500/15 text-red-400 border border-red-500/30 text-xs">
            Application Error Caught
          </Badge>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 line-clamp-3">
            {error?.message || "An unexpected network or server exception occurred."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            variant="brand"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <RotateCcw className="size-4" />
            <span>Try Again</span>
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full border-slate-800 hover:border-emerald-500/40 flex items-center justify-center gap-2 text-slate-300"
            >
              <Home className="size-4" />
              <span>Return Home</span>
            </Button>
          </Link>
        </div>

      </div>
    </main>
  );
}
