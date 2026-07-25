import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20 md:py-28 flex flex-col items-center">
      {/* 1. Hero Section */}
      <div className="flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-100 max-w-3xl leading-tight">
          Forge Your Future with{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            AI-Powered
          </span>{" "}
          Learning
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
          CourseForge is a dynamic platform that adapts to you. Study courses designed by top instructors 
          and clear your doubts instantly with a dedicated, lesson-scoped AI tutor.
        </p>

        <div className="mt-10 flex gap-4 justify-center">
          <Link href="/courses">
            <Button variant="brand" className="h-12 px-8 text-base">
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Feature Section (3-Card Grid) */}
      <div className="w-full mt-24">
        <h2 className="text-2xl font-bold text-slate-200 mb-8 text-center md:text-left">
          Core Features
        </h2>
        
        {/* Responsive Grid: Stacks on mobile (1 col), splits on desktop (3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Tutor */}
          <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Brain className="size-6" />
              </div>
              <div>
                <CardTitle className="text-lg text-slate-200">Inline AI Tutor</CardTitle>
                <CardDescription className="text-slate-400">Personalized chat assistant</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm leading-relaxed">
                Interact with an AI tutor directly beside your lesson text. The tutor is scoped 
                specifically to the lesson content to provide instant, contextual explanations.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: AI Outline Drafting */}
          <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Sparkles className="size-6" />
              </div>
              <div>
                <CardTitle className="text-lg text-slate-200">AI Outline Drafting</CardTitle>
                <CardDescription className="text-slate-400">For instructors</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm leading-relaxed">
                Create new course structures in seconds. Type in a topic, and the system drafts 
                a complete outlines plan with lessons ready to edit.
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Dynamic Quizzes */}
          <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <BookOpen className="size-6" />
              </div>
              <div>
                <CardTitle className="text-lg text-slate-200">Dynamic Quizzes</CardTitle>
                <CardDescription className="text-slate-400">Instant assessments</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm leading-relaxed">
                Test your knowledge dynamically. Generate multiple-choice or short-answer questions 
                based directly on the lesson text and get graded instantly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
