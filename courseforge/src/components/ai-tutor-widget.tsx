"use client";

import React, { useState, useTransition } from "react";
import { askAITutorAction } from "@/app/actions/ai-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, Send, Loader2, HelpCircle } from "lucide-react";

interface AITutorWidgetProps {
  lessonTitle?: string;
}

export function AITutorWidget({ lessonTitle }: AITutorWidgetProps) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
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

      const result = await askAITutorAction(formData);
      setResponse(result.answer);
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
              <CardDescription className="text-xs text-slate-400">
                {lessonTitle ? `Scoped to: "${lessonTitle}"` : "Ask any programming doubt"}
              </CardDescription>
            </div>
          </div>

          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5">
            Google Gemini 2.5 Flash
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
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickQuestion("Explain the core concept in 3 simple points")}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-all"
            >
              💡 Explain in 3 simple points
            </button>
            <button
              type="button"
              onClick={() => handleQuickQuestion("Give me a practical code example for this lesson")}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-all"
            >
              💻 Show code example
            </button>
            <button
              type="button"
              onClick={() => handleQuickQuestion("Create a quick 2-question practice quiz")}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition-all"
            >
              📝 Generate practice quiz
            </button>
          </div>
        </div>

        {/* Question Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI Tutor a question about this lesson..."
              rows={3}
              className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
            />
          </div>

          <div className="flex justify-end">
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
                  <span>Thinking...</span>
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
          <div className="mt-4 p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-2 text-sm text-slate-200 leading-relaxed shadow-inner">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs border-b border-slate-800 pb-2">
              <Bot className="size-4" />
              <span>AI Tutor Answer:</span>
            </div>
            <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-300">
              {response}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
