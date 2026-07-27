import Link from "next/link";
import { MOCK_COURSES } from "../../data/mock-courses";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Calendar } from "lucide-react";

export default function CoursesPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            Explore Course Catalog
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-2">
            Acquire specialized skills with our AI-enhanced learning structures.
          </p>
        </div>
        <div>
          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 text-sm rounded-full">
            {MOCK_COURSES.length} Courses Available
          </Badge>
        </div>
      </div>

      {/* Courses Grid Layout */}
      {/* 1 Column on Mobile, 2 Columns on Tablet, 3 Columns on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COURSES.map((course) => {
          // Format date string to display nicely
          const formattedDate = new Date(course.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });

          return (
            <Card key={course.id} className="flex flex-col justify-between border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-700 active:scale-[0.99] transition-all duration-300">
              <div>
                <CardHeader>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    {/* Badge showing enrollment status / course tag */}
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-xs">
                      Course
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="size-3.5" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-slate-200 line-clamp-2 hover:text-emerald-400 transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1.5 text-slate-400 mt-2">
                    <User className="size-4 text-emerald-500/80" />
                    <span>{course.instructorName}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                </CardContent>
              </div>

              <CardFooter className="border-t border-slate-800 pt-4 mt-auto">
                <Link href={`/courses/${course.id}`} className="w-full">
                  <Button variant="brand" className="w-full flex items-center justify-center gap-2">
                    <BookOpen className="size-4" />
                    <span>Start Learning</span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
