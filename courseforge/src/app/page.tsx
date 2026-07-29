import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, BookOpen, Bot, ShieldCheck, Database, Zap, ArrowRight, GraduationCap, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <main className="font-sans text-slate-100 relative overflow-hidden">
      
      {/* Background Radial Ambient Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 text-center flex flex-col items-center">
        
        {/* Animated Badge */}
        <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-4 py-1 text-xs rounded-full mb-6 inline-flex items-center gap-1.5 shadow-lg shadow-emerald-500/10">
          <Sparkles className="size-3.5 text-emerald-400" />
          <span>Next-Gen AI Learning Ecosystem</span>
        </Badge>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] text-slate-100">
          Forge Your Future with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-200">
            AI-Powered
          </span>{" "}
          Learning
        </h1>

        {/* Hero Subtitle */}
        <p className="text-slate-400 text-base md:text-xl max-w-2xl mt-6 leading-relaxed">
          CourseForge is an adaptive platform that connects learners with expert instructors. Study structured courses and solve doubts instantly with lesson-scoped AI tutors.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
          <Link href="/courses">
            <Button variant="brand" className="w-full sm:w-auto h-12 px-8 text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2">
              <BookOpen className="size-5" />
              <span>Browse Courses</span>
            </Button>
          </Link>
          <Link href="/select-role">
            <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-base border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 flex items-center justify-center gap-2">
              <span>Choose Your Role</span>
              <ArrowRight className="size-4 text-emerald-400" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100">
            Built for Modern Education
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Powered by modern web architecture, edge authentication, and cloud databases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: AI Tutor */}
          <Card className="border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-emerald-500/40 transition-all duration-300 backdrop-blur-md">
            <CardContent className="p-6 space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 w-fit">
                <Bot className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Lesson AI Tutor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear doubts instantly, request code breakdowns, and generate practice quizzes tailored to your lesson topic.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Server Actions */}
          <Card className="border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-emerald-500/40 transition-all duration-300 backdrop-blur-md">
            <CardContent className="p-6 space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 w-fit">
                <Zap className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Next.js 16 Server Actions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct RPC mutations for course creation and student enrollments with instant Edge cache revalidation.
              </p>
            </CardContent>
          </Card>

          {/* Card 3: RBAC Security */}
          <Card className="border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-emerald-500/40 transition-all duration-300 backdrop-blur-md">
            <CardContent className="p-6 space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 w-fit">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Role-Based Workspaces</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict Edge middleware protecting instructor management portals and student learning paths.
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Supabase PostgreSQL */}
          <Card className="border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-emerald-500/40 transition-all duration-300 backdrop-blur-md">
            <CardContent className="p-6 space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 w-fit">
                <Database className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Prisma 7 + Supabase</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-performance relational PostgreSQL cloud database with optimized connection pool adapters.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Choose Path Interactive CTA Banner */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-xs">
              Interactive Onboarding
            </Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100">
              Ready to Start Your Journey?
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Choose whether you want to learn as a student or create courses as an instructor. You can switch modes anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link href="/select-role">
              <Button variant="brand" className="w-full sm:w-auto h-11 px-6 flex items-center justify-center gap-2">
                <GraduationCap className="size-4" />
                <span>Student Portal</span>
              </Button>
            </Link>
            <Link href="/select-role">
              <Button variant="outline" className="w-full sm:w-auto h-11 px-6 border-slate-700 text-slate-200 hover:text-white flex items-center justify-center gap-2">
                <Briefcase className="size-4 text-emerald-400" />
                <span>Instructor Portal</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
