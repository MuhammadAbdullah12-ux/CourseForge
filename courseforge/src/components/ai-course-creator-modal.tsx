"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  generateAICourseStructureAction,
  createAICourseAction,
  AICourseBlueprint,
} from "@/app/actions/instructor-ai-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, BookOpen, CheckCircle2, Rocket, ArrowRight, Wand2 } from "lucide-react";

export function AICourseCreatorModal() {
  const [topicPrompt, setTopicPrompt] = useState("");
  const [blueprint, setBlueprint] = useState<AICourseBlueprint | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [isGenerating, startGenerateTransition] = useTransition();
  const [isPublishing, startPublishTransition] = useTransition();
  
  const router = useRouter();

  const handleGenerateBlueprint = () => {
    if (!topicPrompt.trim() || isGenerating) return;

    startGenerateTransition(async () => {
      setErrorMsg(null);
      setSuccessMsg(null);
      
      const result = await generateAICourseStructureAction(topicPrompt);

      if (result.success && result.blueprint) {
        setBlueprint(result.blueprint);
      } else {
        setErrorMsg(result.error || "Failed to generate blueprint.");
      }
    });
  };

  const handlePublishCourse = () => {
    if (!blueprint || isPublishing) return;

    startPublishTransition(async () => {
      setErrorMsg(null);
      const result = await createAICourseAction(blueprint);

      if (result.success && result.courseId) {
        setSuccessMsg("🎉 Course published live to Supabase database successfully!");
        setTimeout(() => {
          router.push(`/courses/${result.courseId}`);
        }, 1200);
      } else {
        setErrorMsg(result.error || "Failed to publish course.");
      }
    });
  };

  return (
    <Card className="border-emerald-500/40 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
      
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-slate-900 via-emerald-950/50 to-slate-900 border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shadow-md">
              <Wand2 className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base text-slate-100 flex items-center gap-1.5 font-bold">
                <span>1-Click AI Course Authoring</span>
                <Sparkles className="size-3.5 text-emerald-400 animate-pulse" />
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Type any topic to generate a full course title, overview, and 4 textbook modules.
              </CardDescription>
            </div>
          </div>

          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5">
            Instructor AI Assistant
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        
        {/* Input Prompt Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-emerald-400" />
            Course Subject / Technology Prompt:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="e.g. Full-Stack Next.js 15, PostgreSQL & TypeScript Architecture"
              className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            <Button
              onClick={handleGenerateBlueprint}
              disabled={isGenerating || !topicPrompt.trim()}
              variant="brand"
              className="px-6 flex items-center justify-center gap-2 shrink-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin text-slate-950" />
                  <span>Drafting Curriculum...</span>
                </>
              ) : (
                <>
                  <Wand2 className="size-4" />
                  <span>Generate AI Blueprint</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <p className="text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 font-bold flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            <span>{successMsg}</span>
          </p>
        )}

        {/* Blueprint Preview Box */}
        {blueprint && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-5 shadow-inner">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[10px] mb-1">
                  AI Generated Blueprint
                </Badge>
                <h3 className="text-lg font-extrabold text-slate-100">
                  {blueprint.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
              {blueprint.description}
            </p>

            {/* Generated Lessons Outline */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-emerald-400" />
                Curriculum Modules ({blueprint.lessons.length} Lessons Generated):
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {blueprint.lessons.map((lesson) => (
                  <div
                    key={lesson.order}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between text-xs gap-3"
                  >
                    <div className="space-y-1">
                      <h5 className="font-semibold text-slate-200">
                        {lesson.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {lesson.content.slice(0, 100)}...
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-400 text-[10px] shrink-0">
                      Module {lesson.order}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-500">
                Clicking publish creates 1 Course and 4 Lesson rows in Supabase.
              </span>

              <Button
                onClick={handlePublishCourse}
                disabled={isPublishing}
                variant="brand"
                size="sm"
                className="px-6 flex items-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-slate-950" />
                    <span>Publishing to Cloud...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="size-4" />
                    <span>Publish Course to Platform</span>
                  </>
                )}
              </Button>
            </div>

          </div>
        )}

      </CardContent>
    </Card>
  );
}
