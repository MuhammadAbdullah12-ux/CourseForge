"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Clock, Users, ArrowRight, Sparkles, Filter } from "lucide-react";

interface CourseWithInstructor {
  id: string;
  title: string;
  description: string;
  published: boolean;
  createdAt: Date;
  instructor: {
    email: string;
  };
}

interface CourseFilterProps {
  courses: CourseWithInstructor[];
}

export function CourseFilter({ courses }: CourseFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "React", "Next.js", "TypeScript"];

  // Filter courses by search query and category pill selection
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      course.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      course.description.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      
      {/* Search Bar & Category Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
        
        {/* Search Input Field */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by title or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="size-4 text-slate-400 shrink-0 hidden sm:block mr-1" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                selectedCategory === category
                  ? "bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20"
                  : "bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900/30 py-12 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-slate-800/60 rounded-full text-slate-400">
              <Search className="size-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200">No matching courses found</h3>
            <p className="text-sm text-slate-400 max-w-sm">
              Try adjusting your search keywords or resetting category filters to view available learning tracks.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="border-slate-700 text-slate-300 hover:text-white mt-2"
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const instructorName = course.instructor.email.split("@")[0];
            return (
              <Card
                key={course.id}
                className="border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[11px] px-2.5 py-0.5">
                      Course Track
                    </Badge>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="size-3" />
                      4-6 hrs
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-400 line-clamp-2 mt-1">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <span className="flex items-center gap-1.5">
                      <div className="size-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold text-emerald-400 capitalize">
                        {instructorName[0]}
                      </div>
                      <span className="capitalize">{instructorName}</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Sparkles className="size-3" />
                      AI Tutor Included
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-slate-800/80 pt-4">
                  <Link href={`/courses/${course.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-white group-hover:bg-emerald-500/10 flex items-center justify-between">
                      <span>Start Learning</span>
                      <ArrowRight className="size-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
