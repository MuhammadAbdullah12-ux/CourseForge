import React from "react";
import Link from "next/link";
import { createCourseAction } from "@/app/actions/course-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Sparkles, Send } from "lucide-react";

export default function NewCoursePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 md:py-16 font-sans text-slate-100">
      
      {/* Back to Dashboard Link */}
      <Link href="/dashboard/instructor" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors mb-6">
        <ArrowLeft className="size-4" />
        <span>Back to Instructor Dashboard</span>
      </Link>

      {/* Main Form Container Card */}
      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <CardHeader className="border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-xs rounded-full">
              Server Action Form
            </Badge>
            <span className="text-xs text-slate-400">Direct Supabase Mutation</span>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <BookOpen className="size-6 text-emerald-400" />
            <span>Create a New Course</span>
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm mt-1">
            Fill in the course details below. Submitting will trigger a Server Action to write the course into Supabase.
          </CardDescription>
        </CardHeader>

        {/* Server Action Form Element */}
        <form action={createCourseAction}>
          <CardContent className="space-y-6 pt-6">
            
            {/* Input Field: Course Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-slate-200">
                Course Title <span className="text-emerald-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g. Master Next.js 16 & Server Actions"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              />
              <p className="text-xs text-slate-500">
                Choose a descriptive title that clearly states the core skill or technology.
              </p>
            </div>

            {/* Input Field: Course Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-slate-200">
                Course Description <span className="text-emerald-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                placeholder="Describe what students will learn, curriculum structure, hands-on projects, and prerequisite requirements..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm resize-none"
              />
              <p className="text-xs text-slate-500">
                Provide a thorough overview of the learning outcomes.
              </p>
            </div>

            {/* AI Assistant Tip Banner */}
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <Sparkles className="size-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-300/90 leading-relaxed">
                <strong>CourseForge AI Assistant:</strong> Once created, your course will be marked as published and added to your instructor dashboard and public catalog automatically.
              </p>
            </div>

          </CardContent>

          {/* Form Actions Footer */}
          <CardFooter className="border-t border-slate-800/80 px-6 py-4 flex justify-end gap-3">
            <Link href="/dashboard/instructor">
              <Button type="button" variant="outline" className="border-slate-800 text-slate-300 hover:text-white">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="brand" className="flex items-center gap-2">
              <Send className="size-4" />
              <span>Publish Course</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
