"use client";

import React, { useTransition } from "react";
import { unenrollFromCourseAction } from "@/app/actions/course-actions";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

interface UnenrollButtonProps {
  courseId: string;
  className?: string;
  variant?: "outline" | "ghost" | "destructive";
}

export function UnenrollButton({ courseId, className = "", variant = "outline" }: UnenrollButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleUnenroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to unenroll from this course?")) return;

    startTransition(async () => {
      await unenrollFromCourseAction(courseId);
    });
  };

  return (
    <form onSubmit={handleUnenroll} className="inline-block">
      <Button
        type="submit"
        variant={variant}
        size="sm"
        disabled={isPending}
        className={`text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/30 text-xs flex items-center gap-1.5 ${className}`}
      >
        {isPending ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span>Unenrolling...</span>
          </>
        ) : (
          <>
            <LogOut className="size-3.5" />
            <span>Unenroll</span>
          </>
        )}
      </Button>
    </form>
  );
}
