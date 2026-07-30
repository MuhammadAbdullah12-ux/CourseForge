"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface AICourseBlueprint {
  title: string;
  description: string;
  lessons: Array<{
    order: number;
    title: string;
    content: string;
  }>;
}

/**
 * Generates a structured 4-module course blueprint from a topic prompt using Google Gemini API
 */
export async function generateAICourseStructureAction(topicPrompt: string) {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: "🔒 Authentication Required: Please sign in as an Instructor.",
      blueprint: null,
    };
  }

  if (!topicPrompt || topicPrompt.trim().length === 0) {
    return {
      success: false,
      error: "Please enter a course topic prompt.",
      blueprint: null,
    };
  }

  const currentApiKey = process.env.GEMINI_API_KEY;

  // Fallback blueprint if GEMINI_API_KEY is placeholder
  if (!currentApiKey || currentApiKey === "AIzaSy_demo_placeholder_key") {
    const fallbackBlueprint: AICourseBlueprint = {
      title: `Mastering ${topicPrompt.trim()}: Full-Stack Guide`,
      description: `An intensive production-ready guide covering foundational concepts, state architecture, API communications, and deployment for ${topicPrompt.trim()}.`,
      lessons: [
        {
          order: 1,
          title: `Lesson 1: Introduction & Environment Architecture for ${topicPrompt.trim()}`,
          content: `## Welcome to Lesson 1: Introduction & Environment Setup\n\nIn this module, we explore the core principles of **${topicPrompt.trim()}**.\n\n### Key Principles:\n- Architecture & File Scoping\n- Modular Component Patterns\n- Environment Configurations\n\n\`\`\`javascript\n// Quick Starter Configuration\nconst config = {\n  topic: "${topicPrompt.trim()}",\n  mode: "production",\n  status: "active"\n};\nconsole.log("Initialized course module:", config);\n\`\`\``,
        },
        {
          order: 2,
          title: `Lesson 2: Core Data Pipelines & State Management`,
          content: `## Lesson 2: Core Data Pipelines & State Architecture\n\nLearn how to manage dynamic state pipelines and data flow efficiently.\n\n### Highlights:\n- Reactive State Hooks\n- Immutable Updates\n- Event Dispatchers\n\n\`\`\`typescript\ninterface CourseState {\n  topic: string;\n  isPublished: boolean;\n}\n\`\`\``,
        },
        {
          order: 3,
          title: `Lesson 3: API Integration & Server Actions`,
          content: `## Lesson 3: API Integration & Server Mutations\n\nDiscover how client interfaces communicate with server actions and cloud databases.\n\n- REST & RPC Protocol Bridges\n- Server-side Data Validation\n- Async Transitions`,
        },
        {
          order: 4,
          title: `Lesson 4: Production Build Checks & Edge Deployment`,
          content: `## Lesson 4: Launching to Production Edge Networks\n\nDeploy your application to production CDN edge networks with environment variable security.\n\nCongratulations on completing this track!`,
        },
      ],
    };

    return {
      success: true,
      blueprint: fallbackBlueprint,
    };
  }

  const systemInstruction = "You are CourseForge Instructor Assistant. Generate an engaging, high-quality 4-module video/reading course blueprint for the topic: \"" + topicPrompt.trim() + "\".\n\n" +
    "CRITICAL INSTRUCTIONS:\n" +
    "- You MUST return ONLY a raw JSON object.\n" +
    "- Do NOT wrap output in markdown code backticks or add extra commentary outside the JSON object.\n" +
    "- The JSON object MUST match this exact schema:\n" +
    "{\n" +
    '  "title": "Engaging Course Title",\n' +
    '  "description": "Detailed 2-sentence course overview...",\n' +
    '  "lessons": [\n' +
    "    {\n" +
    '      "order": 1,\n' +
    '      "title": "Lesson 1: Title",\n' +
    '      "content": "Rich markdown text with headings, bullet points, and code snippets."\n' +
    "    },\n" +
    "    {\n" +
    '      "order": 2,\n' +
    '      "title": "Lesson 2: Title",\n' +
    '      "content": "Rich markdown text..."\n' +
    "    },\n" +
    "    {\n" +
    '      "order": 3,\n' +
    '      "title": "Lesson 3: Title",\n' +
    '      "content": "Rich markdown text..."\n' +
    "    },\n" +
    "    {\n" +
    '      "order": 4,\n' +
    '      "title": "Lesson 4: Title",\n' +
    '      "content": "Rich markdown text..."\n' +
    "    }\n" +
    "  ]\n" +
    "}";

  try {
    const postRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${currentApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemInstruction }] }],
        }),
      }
    );

    const postData = await postRes.json();
    const rawText = postData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (rawText) {
      const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedBlueprint: AICourseBlueprint = JSON.parse(cleanedJson);

      if (parsedBlueprint.title && Array.isArray(parsedBlueprint.lessons)) {
        return {
          success: true,
          blueprint: parsedBlueprint,
        };
      }
    }
  } catch (error) {
    console.error("Error generating AI course blueprint:", error);
  }

  return {
    success: false,
    error: "Failed to generate AI course structure. Please try a different topic prompt.",
    blueprint: null,
  };
}

/**
 * Atomically inserts an approved AI course blueprint into Supabase PostgreSQL
 */
export async function createAICourseAction(blueprint: AICourseBlueprint) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return {
      success: false,
      error: "🔒 Authentication Required: Please sign in to publish courses.",
    };
  }

  try {
    // 1. Ensure User record exists in Supabase with INSTRUCTOR role
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      const rawEmail = typeof sessionClaims?.email === "string" ? sessionClaims.email : null;
      const fallbackEmail = rawEmail || `instructor_${userId.slice(-8)}@courseforge.com`;

      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: fallbackEmail,
          role: "INSTRUCTOR",
        },
      });
    }

    // 2. Atomic relational database creation of Course and 4 nested Lesson rows
    const course = await prisma.course.create({
      data: {
        instructorId: dbUser.id,
        title: blueprint.title,
        description: blueprint.description,
        published: true,
        lessons: {
          create: blueprint.lessons.map((lesson) => ({
            order: lesson.order,
            title: lesson.title,
            content: lesson.content,
          })),
        },
      },
    });

    // 3. Purge cache tags across course catalog and instructor dashboard
    revalidatePath("/courses", "layout");
    revalidatePath("/dashboard/instructor", "layout");
    revalidatePath("/dashboard/student", "layout");

    return {
      success: true,
      courseId: course.id,
    };
  } catch (error) {
    console.error("Error creating AI course in Supabase:", error);
    return {
      success: false,
      error: "Failed to publish AI course to Supabase database.",
    };
  }
}
