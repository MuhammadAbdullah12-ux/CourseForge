"use server";

import { auth } from "@clerk/nextjs/server";
import { generateAITutorResponse, generateStructuredQuiz, QuizQuestion } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export async function askAITutorAction(formData: FormData) {
  const prompt = formData.get("prompt") as string;
  const lessonTitle = (formData.get("lessonTitle") as string) || undefined;
  const lessonContent = (formData.get("lessonContent") as string) || undefined;

  if (!prompt || prompt.trim().length === 0) {
    return {
      success: false,
      answer: "Please enter a question before asking the AI Tutor.",
    };
  }

  // 1. Verify user authentication
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      answer: "🔒 **Authentication Required:** Please sign in to interact with your lesson AI tutor.",
    };
  }

  // 2. Generate response using Gemini AI helper with lesson content context
  try {
    const answer = await generateAITutorResponse(
      prompt.trim(),
      lessonTitle,
      lessonContent
    );
    return {
      success: true,
      answer,
    };
  } catch (error) {
    console.error("Error executing askAITutorAction:", error);
    return {
      success: false,
      answer: "⚠️ An error occurred while communicating with the AI server.",
    };
  }
}

export async function generateLessonQuizAction(lessonId: string) {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      error: "🔒 Authentication Required: Please sign in to generate lesson quizzes.",
      quiz: [] as QuizQuestion[],
    };
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return {
        success: false,
        error: "Lesson not found.",
        quiz: [] as QuizQuestion[],
      };
    }

    const quiz = await generateStructuredQuiz(lesson.title, lesson.content);
    return {
      success: true,
      quiz,
    };
  } catch (error) {
    console.error("Error generating lesson quiz:", error);
    return {
      success: false,
      error: "Failed to generate AI quiz.",
      quiz: [] as QuizQuestion[],
    };
  }
}
