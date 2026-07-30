import React from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Author Info */}
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-xl text-xs font-extrabold border border-emerald-500/30">
              CF
            </span>
            <span className="text-base font-bold text-slate-100 tracking-tight">CourseForge</span>
          </div>
          <p className="text-slate-400 text-xs">
            Architected & Directed by <strong className="text-slate-200">Muhammad Abdullah</strong>
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center gap-6 text-slate-300">
          <Link href="/courses" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <BookOpen className="size-3.5 text-emerald-400" />
            <span>Course Catalog (12 Tracks)</span>
          </Link>

          <Link href="/select-role" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <GraduationCap className="size-3.5 text-emerald-400" />
            <span>Switch Role Mode</span>
          </Link>

          <Link href="/about" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-purple-400" />
            <span>About Capstone Project</span>
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-slate-400 text-center md:text-right">
          <p>© {new Date().getFullYear()} CourseForge. All rights reserved.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Engineered with Next.js 16, React 19 & Supabase PostgreSQL
          </p>
        </div>

      </div>
    </footer>
  );
}
