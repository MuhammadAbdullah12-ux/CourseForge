"use client";

import React, { useState, useTransition } from "react";
import { askAITutorAction } from "@/app/actions/ai-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, Send, Loader2, HelpCircle, Copy, Check, RotateCcw } from "lucide-react";

interface AITutorWidgetProps {
  lessonTitle?: string;
  lessonContent?: string;
}

export function AITutorWidget({ lessonTitle, lessonContent }: AITutorWidgetProps) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleQuickQuestion = (question: string) => {
    setPrompt(question);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isPending) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("prompt", prompt);
      if (lessonTitle) {
        formData.append("lessonTitle", lessonTitle);
      }
      if (lessonContent) {
        formData.append("lessonContent", lessonContent);
      }

      const result = await askAITutorAction(formData);
      setResponse(result.answer);
    });
  };

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderFormattedMarkdown = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        const language = lines[0].trim().match(/^[a-zA-Z0-9_-]+$/) ? lines[0].trim() : "";
        const codeContent = language ? lines.slice(1).join("\n") : lines.join("\n");

        return (
          <div key={index} className="my-3 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="font-mono text-emerald-400 font-semibold">{language || "code"}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(codeContent, index)}
                aria-label="Copy AI generated code block to clipboard"
                className="flex items-center gap-1 hover:text-white transition-colors text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {copiedIndex === index ? (
                  <>
                    <Check className="size-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-xs font-mono text-emerald-300 leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed font-sans text-slate-200">
          {part}
        </div>
      );
    });
  };

  return (
    <Card className="border-emerald-500/30 bg-slate-900/80 backdrop-blur-md shadow-2xl overflow-hidden">
      
      {/* Header */}
      <CardHeader className="bg-emerald-950/30 border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shadow-md">
              <Bot className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base text-slate-100 flex items-center gap-1.5 font-bold">
                <span>CourseForge AI Tutor</span>
                <Sparkles className="size-3.5 text-emerald-400 animate-pulse" />
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 line-clamp-1">
                {lessonTitle ? `Scoped: "${lessonTitle}"` : "Ask any programming doubt"}
              </CardDescription>
            </div>
          </div>

          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5">
            Gemini RAG Mode
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        
        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="size-3 text-emerald-400" />
            Suggested Questions:
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested AI Tutor Question Prompts">
            <button
              type="button"
              onClick={() => handleQuickQuestion("Explain this lesson's concepts in 3 simple points")}
              aria-label="Ask AI to explain lesson in 3 simple points"
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              💡 Explain lesson in 3 points
            </button>
            <button
              type="button"
              onClick={() => handleQuickQuestion("Summarize the main code snippet in this lesson")}
              aria-label="Ask AI to summarize main code snippet"
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              💻 Summarize lesson code
            </button>
            <button
              type="button"
              onClick={() => handleQuickQuestion("Generate a 2-question quiz based on this reading material")}
              aria-label="Ask AI to create lesson quiz"
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              📝 Create lesson quiz
            </button>
          </div>
        </div>

        {/* Question Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div className="relative">
            <label htmlFor="ai-tutor-prompt-input" className="sr-only">
              Ask AI Tutor a question about this lesson
            </label>
            <textarea
              id="ai-tutor-prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              aria-label="Ask AI Tutor a question about this lesson"
              placeholder="Ask AI Tutor a question about this lesson's reading material..."
              rows={3}
              className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            {response ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPrompt("");
                  setResponse(null);
                }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <RotateCcw className="size-3" />
                <span>Reset Chat</span>
              </Button>
            ) : <div />}

            <Button
              type="submit"
              disabled={isPending || !prompt.trim()}
              variant="brand"
              size="sm"
              className="px-5 flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin text-slate-950" />
                  <span>Analyzing Lesson...</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Ask AI Tutor</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* AI Answer Output Box */}
        {response && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/95 border border-emerald-500/30 space-y-3 text-sm text-slate-200 leading-relaxed shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Bot className="size-4" />
                <span>AI Tutor Response:</span>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 text-[10px]">
                Formatted Output
              </Badge>
            </div>
            
            <div className="text-xs sm:text-sm text-slate-200">
              {renderFormattedMarkdown(response)}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
