"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Menu, X, Home, BookOpen, GraduationCap, LayoutDashboard, Shield, Zap } from "lucide-react";

interface NavbarProps {
  userId: string | null;
  userRole: string | undefined;
}

export function Navbar({ userId, userRole }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo / Brand Name */}
        <Link href="/" className="font-extrabold text-xl text-emerald-400 tracking-tight hover:scale-105 hover:opacity-95 transition-all flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-xl text-xs border border-emerald-500/30 shadow-inner">
            CF
          </span>
          <span>CourseForge</span>
        </Link>
        
        {/* Desktop Navigation Links (Hidden on mobile < md) */}
        <div className="hidden md:flex gap-2 sm:gap-3 items-center">
          <Link 
            href="/" 
            className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-slate-950 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-teal-300 hover:font-bold hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 ease-out"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-slate-950 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-teal-300 hover:font-bold hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 ease-out"
          >
            About
          </Link>
          <Link 
            href="/courses" 
            className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-slate-950 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-teal-300 hover:font-bold hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 ease-out"
          >
            Courses
          </Link>

          {/* Render Dashboard link for signed-in users */}
          {userId && (
            <Link 
              href={userRole === "INSTRUCTOR" ? "/dashboard/instructor" : "/dashboard/student"} 
              className="px-3.5 py-1.5 rounded-xl text-sm font-bold text-emerald-400 hover:text-slate-950 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-teal-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 ease-out"
            >
              Dashboard
            </Link>
          )}

          {/* Render Permanent Select Role Button */}
          <Link 
            href="/select-role" 
            title="Choose or switch between Student and Instructor access modes"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-400 hover:text-slate-950 hover:border-emerald-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 ease-out flex items-center gap-1.5"
          >
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {userId 
                ? (userRole === "INSTRUCTOR" ? "Instructor Mode" : "Student Mode") 
                : "Select Role"}
            </span>
          </Link>

          {/* Auth Controls */}
          {!userId ? (
            <div className="flex items-center gap-2 ml-2">
              <Link 
                href="/sign-in" 
                className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 ease-out"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="px-4 py-1.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 ease-out"
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

        {/* Mobile Hamburger Toggle Button (Visible only on < md) */}
        <div className="flex items-center gap-3 md:hidden">
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
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-emerald-400 transition-colors"
          >
            <Home className="size-4 text-emerald-400" />
            <span>Home</span>
          </Link>

          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-emerald-400 transition-colors"
          >
            <GraduationCap className="size-4 text-emerald-400" />
            <span>About</span>
          </Link>

          <Link
            href="/courses"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-emerald-400 transition-colors"
          >
            <BookOpen className="size-4 text-emerald-400" />
            <span>Courses Catalog</span>
          </Link>

          {userId && (
            <Link
              href={userRole === "INSTRUCTOR" ? "/dashboard/instructor" : "/dashboard/student"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-bold text-emerald-400 hover:bg-slate-900 transition-colors"
            >
              <LayoutDashboard className="size-4" />
              <span>Dashboard Portal</span>
            </Link>
          )}

          <Link
            href="/select-role"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
          >
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{userRole === "INSTRUCTOR" ? "Instructor Mode" : "Student Mode"}</span>
            </span>
            <span className="text-[11px] underline">Switch Mode</span>
          </Link>

          {!userId && (
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <Link
                href="/sign-in"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-xl text-xs font-semibold bg-slate-900 text-slate-200 border border-slate-800"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-xl text-xs font-bold bg-emerald-500 text-slate-950"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
