import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Cpu,
  Database,
  Code,
  Layers,
  ArrowRight,
  User,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 font-sans text-slate-100 space-y-12">
      
      {/* Page Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3.5 py-1 text-xs rounded-full inline-flex items-center gap-1.5 font-semibold">
            <Sparkles className="size-3.5 text-emerald-400" />
            <span>Capstone Architecture Showcase</span>
          </Badge>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100">
          About <span className="text-emerald-400">CourseForge</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
          Next-Generation AI-Assisted Computer Science Education Platform engineered with Next.js 16, React 19, Supabase Cloud PostgreSQL, and Clerk Role-Based Security.
        </p>
      </div>

      {/* Developer & Platform Identity Banner */}
      <Card className="border-emerald-500/30 bg-slate-900/60 backdrop-blur-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Badge className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs">
                Lead Architect & Author
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 flex items-center gap-2 justify-center md:justify-start">
              <User className="size-6 text-emerald-400" />
              <span>Muhammad Abdullah</span>
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Full-Stack Software Engineer • Computer Science Curriculum Director
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="https://github.com/MuhammadAbdullah12-ux/CourseForge.git" target="_blank">
              <Button variant="outline" className="border-slate-700 text-slate-200 hover:text-white flex items-center gap-2">
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub Repository</span>
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="brand" className="flex items-center gap-2">
                <span>Explore 12 CS Courses</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Key Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Card className="border-slate-800 bg-slate-900/50 p-6 space-y-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 w-fit">
            <GraduationCap className="size-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">12 CS Degree Courses</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            144 total academic modules covering DSA, OOP, AI/ML, Modern Web, Operating Systems, Networks, SQL, Cybersecurity, Automata, and Assembly.
          </p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50 p-6 space-y-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 w-fit">
            <Cpu className="size-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">AI Tutors & Evaluation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Lesson-scoped AI tutoring widgets alongside automated practice quiz evaluations with real-time score tracking.
          </p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50 p-6 space-y-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 w-fit">
            <ShieldCheck className="size-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">3 Role Access Portals</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Role-Based Access Control enforcing Student Mode 🟩, Instructor Mode 🟦, and 1-click Admin Super-User Mode 🟪.
          </p>
        </Card>

      </div>

      {/* Technology Stack Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-100 text-center">
          Technology & System Architecture
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-1.5">
            <Code className="size-5 text-emerald-400 mx-auto" />
            <h4 className="font-semibold text-sm text-slate-200">Next.js 16 & React 19</h4>
            <span className="text-[11px] text-slate-400 block">App Router & Turbopack</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-1.5">
            <Database className="size-5 text-cyan-400 mx-auto" />
            <h4 className="font-semibold text-sm text-slate-200">Prisma ORM v7</h4>
            <span className="text-[11px] text-slate-400 block">Supabase PostgreSQL</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-1.5">
            <ShieldCheck className="size-5 text-purple-400 mx-auto" />
            <h4 className="font-semibold text-sm text-slate-200">Clerk Auth Engine</h4>
            <span className="text-[11px] text-slate-400 block">Role Security & Universal OTP</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-1.5">
            <Layers className="size-5 text-emerald-400 mx-auto" />
            <h4 className="font-semibold text-sm text-slate-200">Vanilla CSS & Lucide</h4>
            <span className="text-[11px] text-slate-400 block">Glassmorphism UI System</span>
          </div>
        </div>
      </div>

    </main>
  );
}
