"use client";

import React, { useState } from "react";
import { Bell, CheckCircle2, Sparkles, BookOpen, Award, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function NavbarNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New AI Course Released!",
      description: "Mastering TypeScript & React 19 is now live in the catalog.",
      time: "10m ago",
      read: false,
      icon: BookOpen,
      color: "text-emerald-400",
    },
    {
      id: "2",
      title: "AI Quiz Evaluated",
      description: "You scored 90% on Next.js Server Components practice quiz.",
      time: "1h ago",
      read: false,
      icon: Award,
      color: "text-cyan-400",
    },
    {
      id: "3",
      title: "Welcome to CourseForge",
      description: "Your adaptive role-based workspace is ready.",
      time: "1d ago",
      read: true,
      icon: Sparkles,
      color: "text-purple-400",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="View notifications"
        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all relative group"
      >
        <Bell className="size-4 group-hover:rotate-12 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-4 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-emerald-400" />
              <span className="text-sm font-bold text-slate-100">Notifications</span>
              {unreadCount > 0 && (
                <Badge className="bg-emerald-500/15 text-emerald-400 text-[10px] px-2">
                  {unreadCount} New
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {notifications.map((n) => {
              const IconComponent = n.icon;
              return (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                    n.read
                      ? "bg-slate-900/40 border-slate-800/60 opacity-70"
                      : "bg-slate-900 border-slate-700/80 shadow-inner"
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0 ${n.color}`}>
                    <IconComponent className="size-4" />
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-100">{n.title}</h4>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{n.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
