import { GoogleGenAI } from "@google/genai";

// 1. Initialize Google Gemini AI SDK with API key
const apiKey = process.env.GEMINI_API_KEY || "";

export const ai = new GoogleGenAI({ apiKey });

/**
 * Reusable AI Tutor Response Generator
 * @param prompt - The student's question or prompt
 * @param lessonTitle - Optional lesson context for scoped tutor assistance
 */
export async function generateAITutorResponse(
  prompt: string,
  lessonTitle?: string
): Promise<string> {
  const currentApiKey = process.env.GEMINI_API_KEY;

  // Fallback demo response if GEMINI_API_KEY is not configured yet
  if (!currentApiKey || currentApiKey === "AIzaSy_demo_placeholder_key") {
    return `### 🤖 CourseForge AI Tutor (Demo Mode)\n\nThank you for asking: **"${prompt}"**!\n\nTo enable live AI completions from Google Gemini 2.5 Flash, please add your free **GEMINI_API_KEY** to your \`.env\` file.\n\n- **Current Lesson Scope:** ${lessonTitle || "General Coding Track"}\n- **Status:** Ready for API key binding!`;
  }

  try {
    const contextHeader = lessonTitle
      ? `Lesson Topic Context: "${lessonTitle}".`
      : "General Full-Stack Web Development Track.";

    const systemInstruction = `You are CourseForge AI Tutor, a world-class coding tutor and mentor on the CourseForge LMS platform.
Your mission is to provide clear, encouraging, and highly accurate explanations to students.
Keep responses structured using clean GitHub Markdown with code snippets, bold key terms, and bullet points.
${contextHeader}`;

    // 2. Request Gemini 2.5 Flash model completion
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\nStudent Question: ${prompt}` }],
        },
      ],
    });

    const resultText = response.text;
    return resultText || "I couldn't generate a response. Please try rephrasing your question.";
  } catch (error) {
    console.error("Error generating Gemini AI response:", error);
    return `⚠️ **AI Tutor Connection Error:** Unable to reach Google Gemini services. Please check your network connection or API key quota limits.`;
  }
}
