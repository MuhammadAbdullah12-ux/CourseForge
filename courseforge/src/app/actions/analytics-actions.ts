"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface ScoreDistributionItem {
  category: string;
  count: number;
  label: string;
}

export interface CourseEngagementItem {
  courseTitle: string;
  enrollmentsCount: number;
  lessonsCount: number;
  quizzesCount: number;
}

export async function getInstructorAnalyticsAction() {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      scoreDistribution: [],
      courseEngagement: [],
    };
  }

  try {
    // 1. Fetch courses owned by this instructor with nested lessons, enrollments, and quizAttempts
    const courses = await prisma.course.findMany({
      where: {
        instructor: {
          clerkId: userId,
        },
      },
      include: {
        enrollments: true,
        lessons: {
          include: {
            quizAttempts: true,
          },
        },
      },
    });

    // 2. Pre-aggregate Score Distribution Buckets (0-25%, 26-50%, 51-75%, 76-100%)
    const buckets = {
      low: 0,      // 0 - 25%
      midLow: 0,   // 26 - 50%
      midHigh: 0,  // 51 - 75%
      high: 0,     // 76 - 100%
    };

    let totalQuizzesTracked = 0;

    courses.forEach((course) => {
      course.lessons.forEach((lesson) => {
        lesson.quizAttempts.forEach((attempt) => {
          totalQuizzesTracked++;
          const percentage = Math.round((attempt.score / attempt.total) * 100);
          
          if (percentage <= 25) buckets.low++;
          else if (percentage <= 50) buckets.midLow++;
          else if (percentage <= 75) buckets.midHigh++;
          else buckets.high++;
        });
      });
    });

    // Fallback demonstration buckets if instructor has no quiz attempts yet
    const scoreDistribution: ScoreDistributionItem[] = [
      { category: "0-25%", count: buckets.low || (totalQuizzesTracked === 0 ? 1 : 0), label: "Needs Review" },
      { category: "26-50%", count: buckets.midLow || (totalQuizzesTracked === 0 ? 2 : 0), label: "Below Avg" },
      { category: "51-75%", count: buckets.midHigh || (totalQuizzesTracked === 0 ? 5 : 0), label: "Good Pass" },
      { category: "76-100%", count: buckets.high || (totalQuizzesTracked === 0 ? 12 : 0), label: "Mastery" },
    ];

    // 3. Pre-aggregate Course Engagement Metrics
    const courseEngagement: CourseEngagementItem[] = courses.map((course) => {
      let totalQuizzesInCourse = 0;
      course.lessons.forEach((lesson) => {
        totalQuizzesInCourse += lesson.quizAttempts.length;
      });

      return {
        courseTitle: course.title.length > 20 ? `${course.title.slice(0, 20)}...` : course.title,
        enrollmentsCount: course.enrollments.length,
        lessonsCount: course.lessons.length,
        quizzesCount: totalQuizzesInCourse,
      };
    });

    return {
      success: true,
      scoreDistribution,
      courseEngagement,
    };
  } catch (error) {
    console.error("Error in getInstructorAnalyticsAction:", error);
    return {
      success: false,
      scoreDistribution: [],
      courseEngagement: [],
    };
  }
}
