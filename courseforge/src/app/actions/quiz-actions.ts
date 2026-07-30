"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveQuizAttemptAction(
  lessonId: string,
  score: number,
  total: number
) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return {
      success: false,
      error: "🔒 Authentication Required: Sign in to save quiz scores.",
    };
  }

  try {
    // 1. Safely resolve User record in Supabase PostgreSQL
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      const rawEmail = typeof sessionClaims?.email === "string" ? sessionClaims.email : null;
      const fallbackEmail = rawEmail || `student_${userId.slice(-8)}@courseforge.com`;

      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: fallbackEmail,
          role: "STUDENT",
        },
      });
    }

    // 2. Insert QuizAttempt row into Supabase PostgreSQL
    await prisma.quizAttempt.create({
      data: {
        userId: dbUser.id,
        lessonId: lessonId,
        score: score,
        total: total,
      },
    });

    // 3. Purge caches across student dashboard analytics
    revalidatePath("/dashboard/student", "layout");
    revalidatePath("/courses", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error saving quiz attempt to Supabase:", error);
    return {
      success: false,
      error: "Failed to persist quiz score in database.",
    };
  }
}
