"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { NavbarNotifications } from "./navbar-notifications";
import { NavbarQuickSearch } from "./navbar-quick-search";
import {
  Menu,
  X,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Briefcase,
  RefreshCw,
  PlusCircle,
  BarChart3,
  BookMarked,
  UserCog,
  Sliders,
} from "lucide-react";

interface NavbarProps {
  userId: string | null;
  userRole: string | undefined;
}

export function Navbar({ userId, userRole }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide Navbar completely on onboarding screens (Select Role, Sign In, Sign Up)
  if (
    pathname === "/select-role" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  ) {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const isAdmin = userRole === "ADMIN";
  const isInstructor = userRole === "INSTRUCTOR";
  const isStudent = userRole === "STUDENT" || (!isAdmin && !isInstructor);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo / Brand Name (Clicking logo goes Home) */}
        <Link href="/" className="font-extrabold text-xl text-emerald-400 tracking-tight hover:scale-105 hover:opacity-95 transition-all flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-xl text-xs border border-emerald-500/30 shadow-inner">
            CF
          </span>
          <span>CourseForge</span>
        </Link>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-2 sm:gap-3 items-center">

          {/* 🟩 STUDENT DEDICATED LINKS */}
          {isStudent && (
            <>
              <Link 
                href="/courses" 
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === "/courses"
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold"
                    : "text-slate-300 hover:text-emerald-400 hover:bg-slate-900"
                }`}
              >
                <BookOpen className="size-3.5 text-emerald-400" />
                <span>Courses Catalog</span>
              </Link>

              {userId && (
                <>
                  <Link 
                    href="/dashboard/student" 
                    className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                      pathname === "/dashboard/student"
                        ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold"
                        : "text-slate-300 hover:text-emerald-400 hover:bg-slate-900"
                    }`}
                  >
                    <BookMarked className="size-3.5 text-emerald-400" />
                    <span>My Enrolled Courses</span>
                  </Link>

                  <Link
                    href="/dashboard/student"
                    className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-400 hover:text-slate-950 hover:scale-105 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                  >
                    <GraduationCap className="size-3.5" />
                    <span>Student Dashboard</span>
                  </Link>
                </>
              )}
            </>
          )}

          {/* 🟦 INSTRUCTOR DEDICATED LINKS */}
          {isInstructor && (
            <>
              <Link 
                href="/dashboard/instructor/courses" 
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === "/dashboard/instructor/courses"
                    ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 font-bold"
                    : "text-slate-300 hover:text-cyan-400 hover:bg-slate-900"
                }`}
              >
                <BookOpen className="size-3.5 text-cyan-400" />
                <span>My Published Courses</span>
              </Link>

              <Link 
                href="/dashboard/instructor/courses/new" 
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === "/dashboard/instructor/courses/new"
                    ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 font-bold"
                    : "text-slate-300 hover:text-cyan-400 hover:bg-slate-900"
                }`}
              >
                <PlusCircle className="size-3.5 text-cyan-400" />
                <span>+ Create AI Course</span>
              </Link>

              <Link 
                href="/dashboard/instructor/analytics" 
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === "/dashboard/instructor/analytics"
                    ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 font-bold"
                    : "text-slate-300 hover:text-cyan-400 hover:bg-slate-900"
                }`}
              >
                <BarChart3 className="size-3.5 text-cyan-400" />
                <span>Analytics</span>
              </Link>

              {userId && (
                <Link
                  href="/dashboard/instructor"
                  className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/40 hover:bg-cyan-400 hover:text-slate-950 hover:scale-105 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/10"
                >
                  <Briefcase className="size-3.5" />
                  <span>Instructor Portal</span>
                </Link>
              )}
            </>
          )}

          {/* 🟪 ADMIN DEDICATED LINKS */}
          {isAdmin && (
            <>
              <Link 
                href="/dashboard/admin/users" 
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === "/dashboard/admin/users"
                    ? "text-purple-400 bg-purple-500/10 border border-purple-500/20 font-bold"
                    : "text-slate-300 hover:text-purple-400 hover:bg-slate-900"
                }`}
              >
                <UserCog className="size-3.5 text-purple-400" />
                <span>User Directory</span>
              </Link>

              <Link 
                href="/dashboard/admin/courses" 
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === "/dashboard/admin/courses"
                    ? "text-purple-400 bg-purple-500/10 border border-purple-500/20 font-bold"
                    : "text-slate-300 hover:text-purple-400 hover:bg-slate-900"
                }`}
              >
                <Sliders className="size-3.5 text-purple-400" />
                <span>Course Moderation</span>
              </Link>

              <Link 
                href="/dashboard/admin/telemetry" 
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === "/dashboard/admin/telemetry"
                    ? "text-purple-400 bg-purple-500/10 border border-purple-500/20 font-bold"
                    : "text-slate-300 hover:text-purple-400 hover:bg-slate-900"
                }`}
              >
                <BarChart3 className="size-3.5 text-purple-400" />
                <span>Telemetry</span>
              </Link>

              {userId && (
                <Link
                  href="/dashboard/admin"
                  className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-purple-300 bg-purple-500/15 border border-purple-500/40 hover:bg-purple-500 hover:text-slate-950 hover:scale-105 transition-all flex items-center gap-1.5 shadow-md shadow-purple-500/10"
                >
                  <ShieldCheck className="size-3.5" />
                  <span>Admin Portal</span>
                </Link>
              )}
            </>
          )}

          {/* ⚡ QUICK SEARCH (⌘K) */}
          <NavbarQuickSearch />

          {/* 🔔 NOTIFICATIONS CENTER */}
          {userId && <NavbarNotifications />}

          {/* ACTIONABLE "SWITCH MODE 🔄" BUTTON */}
          <Link 
            href="/select-role" 
            title="Switch between Student, Instructor, and Admin access modes"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border hover:scale-105 transition-all duration-200 ease-out flex items-center gap-1.5 ${
              isAdmin
                ? "bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500 hover:text-slate-950"
                : isInstructor
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-400 hover:text-slate-950"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-400 hover:text-slate-950"
            }`}
          >
            <RefreshCw className="size-3" />
            <span>Switch Mode</span>
          </Link>

          {/* Auth Controls */}
          {!userId ? (
            <div className="flex items-center gap-2 ml-2">
              <Link 
                href="/sign-in" 
                className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 hover:scale-105 transition-all"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="ml-2 flex items-center hover:scale-105 transition-transform">
              <UserButton />
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-3 md:hidden">
          {userId && <NavbarNotifications />}

          {userId && (
            <div className="flex items-center">
              <UserButton />
            </div>
          )}
          
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

      </nav>

      {/* Mobile Menu Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-6 py-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2">
          {/* Student Mobile Links */}
          {isStudent && (
            <>
              <Link
                href="/courses"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-emerald-400 transition-colors"
              >
                <BookOpen className="size-4 text-emerald-400" />
                <span>Courses Catalog</span>
              </Link>
              <Link
                href="/dashboard/student"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30"
              >
                <GraduationCap className="size-4 text-emerald-400" />
                <span>Student Dashboard</span>
              </Link>
            </>
          )}

          {/* Instructor Mobile Links */}
          {isInstructor && (
            <>
              <Link
                href="/dashboard/instructor/courses"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-cyan-400 transition-colors"
              >
                <BookOpen className="size-4 text-cyan-400" />
                <span>My Published Courses</span>
              </Link>
              <Link
                href="/dashboard/instructor/courses/new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-cyan-400 transition-colors"
              >
                <PlusCircle className="size-4 text-cyan-400" />
                <span>+ Create AI Course</span>
              </Link>
              <Link
                href="/dashboard/instructor"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30"
              >
                <Briefcase className="size-4 text-cyan-400" />
                <span>Instructor Portal</span>
              </Link>
            </>
          )}

          {/* Admin Mobile Links */}
          {isAdmin && (
            <>
              <Link
                href="/dashboard/admin/users"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-purple-400 transition-colors"
              >
                <UserCog className="size-4 text-purple-400" />
                <span>User Directory</span>
              </Link>
              <Link
                href="/dashboard/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-bold text-purple-300 bg-purple-500/15 border border-purple-500/30"
              >
                <ShieldCheck className="size-4 text-purple-400" />
                <span>Admin Portal</span>
              </Link>
            </>
          )}

          <Link
            href="/select-role"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border ${
              isAdmin
                ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                : isInstructor
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            }`}
          >
            <span className="flex items-center gap-2">
              <RefreshCw className="size-3" />
              <span>Switch Mode</span>
            </span>
            <span className="text-[11px] underline">Choose Role</span>
          </Link>
        </div>
      )}
    </header>
  );
}
