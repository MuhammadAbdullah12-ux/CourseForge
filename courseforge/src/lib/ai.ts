export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

/**
 * Reusable AI Tutor Response Generator with RAG Context Injection
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

  try {
    const postRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${currentApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
        }),
      }
    );

    const postData = await postRes.json();

    if (postData.candidates && postData.candidates[0]?.content?.parts[0]?.text) {
      return postData.candidates[0].content.parts[0].text;
    }

    return `⚠️ **Google Gemini API Notice:** No response text returned.`;
  } catch (error: any) {
    console.error("Gemini Direct Fetch Error:", error);
    return `⚠️ **Connection Error:** ${error?.message || String(error)}`;
  }
}

/**
 * Generates a structured JSON array 3-question quiz based on lesson reading material
 */
export async function generateStructuredQuiz(
  lessonTitle: string,
  lessonContent: string
): Promise<QuizQuestion[]> {
  const currentApiKey = process.env.GEMINI_API_KEY;

  if (!currentApiKey || currentApiKey === "AIzaSy_demo_placeholder_key") {
    return [
      {
        question: `What is the primary focus of "${lessonTitle}"?`,
        options: [
          "Understanding core architectural concepts and syntax",
          "Building random unstyled legacy tables",
          "Bypassing authentication security checks",
          "Disabling database indexes"
        ],
        correctAnswerIndex: 0,
        explanation: "Lesson materials focus on component architecture, state management, and modern development standards."
      },
      {
        question: "How should dynamic component states be handled in modern web applications?",
        options: [
          "Directly mutating global window state variables",
          "Using dedicated state hooks and functional setters",
          "Writing inline script tags inside body tags",
          "Deleting database tables"
        ],
        correctAnswerIndex: 1,
        explanation: "State hooks and functional setter updates preserve reactivity and prevent state corruption."
      },
      {
        question: "What is the recommended approach for production deployments?",
        options: [
          "Running manual un-minified local scripts",
          "Configuring secure environment variables and edge CDN distribution",
          "Storing secret API keys in public client HTML",
          "Ignoring compiler build warnings"
        ],
        correctAnswerIndex: 1,
        explanation: "Edge CDN distribution and environment variable isolation ensure security and global performance."
      }
    ];
  }

  const systemInstruction = "You are CourseForge Quiz Generator. Create an engaging 3-question multiple-choice practice quiz based strictly on the lesson reading material provided below.\n" +
    `Lesson Title: "${lessonTitle}"\n` +
    "Lesson Reading Material:\n" +
    '"""\n' + lessonContent.slice(0, 3000) + '\n"""\n\n' +
    "CRITICAL INSTRUCTIONS:\n" +
    "- You MUST return ONLY a raw JSON array containing exactly 3 question objects.\n" +
    "- Do NOT wrap your output in markdown code backticks or add any commentary outside the JSON array.\n" +
    "- Each question object MUST have this exact schema:\n" +
    "[\n" +
    "  {\n" +
    '    "question": "Clear question text?",\n' +
    '    "options": ["Option A", "Option B", "Option C", "Option D"],\n' +
    '    "correctAnswerIndex": 0,\n' +
    '    "explanation": "Detailed explanation of why Option A is correct."\n' +
    "  }\n" +
    "]";

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
      const parsedQuestions: QuizQuestion[] = JSON.parse(cleanedJson);
      if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
        return parsedQuestions;
      }
    }
  } catch (error) {
    console.error("Error in generateStructuredQuiz:", error);
  }

  return [
    {
      question: `Key Takeaway for "${lessonTitle}"`,
      options: [
        "Component architecture and modular design",
        "Legacy static HTML pages",
        "Un-sanitized SQL strings",
        "Direct DOM manipulation"
      ],
      correctAnswerIndex: 0,
      explanation: "Modular design and component architecture provide scalability and code maintainability."
    }
  ];
}
