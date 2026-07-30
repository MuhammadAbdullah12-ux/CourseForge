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
    // 1. Ensure User record exists in Supabase PostgreSQL
    const userEmail =
      (sessionClaims?.email as string) ||
      `user_${userId.slice(-6)}@courseforge.com`;

    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: userEmail,
        role: "STUDENT",
      },
    });

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
