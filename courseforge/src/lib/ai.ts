/**
 * Reusable AI Tutor Response Generator with RAG Context Injection
 * @param prompt - The student's question or prompt
 * @param lessonTitle - Optional lesson context for scoped tutor assistance
 * @param lessonContent - Optional full reading material text of the lesson
 */
export async function generateAITutorResponse(
  prompt: string,
  lessonTitle?: string,
  lessonContent?: string
): Promise<string> {
  const currentApiKey = process.env.GEMINI_API_KEY;

  if (!currentApiKey || currentApiKey === "AIzaSy_demo_placeholder_key") {
    return `### 🤖 CourseForge AI Tutor (Demo Mode)\n\nThank you for asking: **"${prompt}"**!\n\nTo enable live AI completions from Google Gemini Flash, please add your free **GEMINI_API_KEY** to your \`.env\` file.\n\n- **Current Lesson Scope:** ${lessonTitle || "General Coding Track"}\n- **Status:** Ready for API key binding!`;
  }

  const contextHeader = lessonTitle
    ? `Lesson Topic Context: "${lessonTitle}".`
    : "General Full-Stack Web Development Track.";

  const contentBlock = lessonContent
    ? `\n\nOfficial Lesson Reading Material Provided To Student:\n\"\"\"\n${lessonContent.slice(0, 3000)}\n\"\"\"\n`
    : "";

  const systemInstruction = `You are CourseForge AI Tutor, a world-class coding tutor and mentor on the CourseForge LMS platform.
Your mission is to provide clear, encouraging, and highly accurate explanations to students based on the lesson context and reading material provided below.
Answer questions accurately by referring to the specific code examples, key concepts, and summaries in the reading material whenever applicable.
Keep responses structured using clean GitHub Markdown with code snippets, bold key terms, and bullet points.
${contextHeader}${contentBlock}`;

  const fullPrompt = `${systemInstruction}\n\nStudent Question: ${prompt}`;

  // 1. Fetch available models for this specific API key directly from Google
  try {
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${currentApiKey}`
    );
    const listData = await listRes.json();

    if (listData.error) {
      return `⚠️ **Google API Key Status:** ${listData.error.message}`;
    }

    const availableModels: string[] = (listData.models || [])
      .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m: any) => m.name.replace("models/", ""));

    if (availableModels.length === 0) {
      return `⚠️ **Google API Notice:** No generateContent models available for this key.`;
    }

    for (const modelName of availableModels) {
      try {
        const postRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${currentApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: fullPrompt }],
                },
              ],
            }),
          }
        );

        const postData = await postRes.json();

        if (postData.candidates && postData.candidates[0]?.content?.parts[0]?.text) {
          return postData.candidates[0].content.parts[0].text;
        }
      } catch (e) {
        console.warn(`Model ${modelName} call failed:`, e);
      }
    }

    return `⚠️ **Google Gemini API Notice:** Attempted models (${availableModels.join(", ")}), but no response text was returned.`;
  } catch (error: any) {
    console.error("Gemini Direct Fetch Error:", error);
    return `⚠️ **Connection Error:** ${error?.message || String(error)}`;
  }
}
