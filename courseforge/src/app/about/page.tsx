"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <main className="max-w-2xl mx-auto p-10 font-sans">
      {/* 1. Header with Badge Component */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">About CourseForge</h1>
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          AI-Powered
        </Badge>
      </div>

      {/* 2. Card Component wrapping our description */}
      <Card className="mb-8 border-slate-800 bg-slate-900/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-400">Our Mission</CardTitle>
          <CardDescription className="text-slate-400">The next-generation education platform</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 leading-relaxed">
            CourseForge is an AI-assisted learning platform designed to help you learn by building. 
            Students can browse course catalogs, view dynamic details, and chat directly with an 
            inline AI tutor scoped to each lesson's content.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-slate-800 pt-6 mt-4">
          <span className="text-sm text-slate-400">Interactive Demo:</span>
          
          {/* 3. Button Component linked to React State */}
          <Button 
            onClick={() => setClickCount(clickCount + 1)}
            variant="brand"
          >
            Clicks: {clickCount}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
