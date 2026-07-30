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
          <label htmlFor="course-search-input" className="sr-only">
            Search courses by title or keyword
          </label>
          <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
          <input
            id="course-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search courses by title or keyword"
            placeholder="Search courses by title or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0" role="group" aria-label="Course Category Filters">
          <Filter className="size-4 text-slate-400 shrink-0 hidden sm:block mr-1" />
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              aria-label={`Filter by ${category} category`}
              aria-pressed={selectedCategory === category}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
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
                      Self-Paced
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="py-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5 text-emerald-400" />
                      Instructor: <strong className="capitalize text-slate-200">{instructorName}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="size-3.5 text-emerald-400" />
                      Modules
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Link href={`/courses/${course.id}`} className="w-full">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-300 group-hover:text-slate-950 group-hover:border-emerald-300">
                      <span>View Course Syllabus</span>
                      <ArrowRight className="size-4" />
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
