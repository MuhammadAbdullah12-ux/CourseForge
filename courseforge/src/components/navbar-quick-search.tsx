"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, GraduationCap, Briefcase, ShieldCheck, ArrowRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function NavbarQuickSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Listen for keyboard shortcut (Cmd + K or Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchResults = [
    { title: "Browse Courses Catalog", path: "/courses", category: "Catalog", icon: BookOpen },
    { title: "Student Command Center", path: "/dashboard/student", category: "Dashboard", icon: GraduationCap },
    { title: "Instructor Management Portal", path: "/dashboard/instructor", category: "Dashboard", icon: Briefcase },
    { title: "Executive Admin Portal", path: "/dashboard/admin", category: "Admin", icon: ShieldCheck },
  ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(path);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all shadow-inner"
      >
        <Search className="size-3.5 text-emerald-400" />
        <span>Quick Search...</span>
        <kbd className="bg-slate-950 border border-slate-800 px-1.5 py-0.5 text-[10px] font-mono rounded text-slate-400">
          ⌘K
        </kbd>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3">
              <Search className="size-5 text-emerald-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Type to search courses, tools, or portals..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none"
              />
              <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="p-3 max-h-72 overflow-y-auto space-y-1">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">No matching search results found.</div>
              ) : (
                searchResults.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 text-xs text-left group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 group-hover:border-emerald-500/40">
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-slate-500">{item.path}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] border-slate-800 text-slate-400">
                          {item.category}
                        </Badge>
                        <ArrowRight className="size-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between">
              <span>Press <kbd className="text-slate-400">ESC</kbd> to close</span>
              <span>CourseForge Command Palette</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
