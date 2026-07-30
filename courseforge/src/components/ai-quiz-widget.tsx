"use client";

import React, { useState, useTransition } from "react";
import { generateLessonQuizAction } from "@/app/actions/ai-actions";
import { QuizQuestion } from "@/lib/ai";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Sparkles, CheckCircle2, XCircle, Trophy, RotateCcw, Loader2, ArrowRight, Award } from "lucide-react";

interface AIQuizWidgetProps {
  lessonId: string;
  lessonTitle: string;
}

export function AIQuizWidget({ lessonId, lessonTitle }: AIQuizWidgetProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerateQuiz = () => {
    startTransition(async () => {
      setErrorMsg(null);
      const result = await generateLessonQuizAction(lessonId);

      if (result.success && result.quiz.length > 0) {
        setQuestions(result.quiz);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setScore(0);
        setIsQuizCompleted(false);
      } else {
        setErrorMsg(result.error || "Unable to generate quiz. Please try again.");
      }
    });
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswerSubmitted(true);
    const currentQ = questions[currentIndex];

    if (selectedOption === currentQ.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <Card className="border-emerald-500/30 bg-slate-900/70 backdrop-blur-md shadow-2xl overflow-hidden mt-6">
      
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shadow-md">
              <Award className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base text-slate-100 flex items-center gap-1.5 font-bold">
                <span>AI Knowledge Check Quiz</span>
                <Sparkles className="size-3.5 text-emerald-400 animate-pulse" />
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Interactive automated grading for &quot;{lessonTitle}&quot;
              </CardDescription>
            </div>
          </div>

          {questions.length > 0 && !isQuizCompleted && (
            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5">
              Question {currentIndex + 1} of {questions.length}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        
        {/* Initial Launch State */}
        {questions.length === 0 && !isPending && (
          <div className="text-center py-8 space-y-4">
            <div className="size-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-inner">
              <HelpCircle className="size-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-100">Ready to test your comprehension?</h3>
              <p className="text-xs text-slate-400">
                Click below to ask Google Gemini AI to analyze this lesson&apos;s reading material and generate a 3-question practice quiz.
              </p>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 max-w-md mx-auto">
                {errorMsg}
              </p>
            )}

            <Button
              onClick={handleGenerateQuiz}
              variant="brand"
              size="lg"
              className="px-8 shadow-xl shadow-emerald-500/20 flex items-center gap-2 mx-auto"
            >
              <Sparkles className="size-4 text-slate-950" />
              <span>Generate AI Quiz</span>
            </Button>
          </div>
        )}

        {/* Loading Spinner State */}
        {isPending && (
          <div className="text-center py-12 space-y-3">
            <Loader2 className="size-8 text-emerald-400 animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">Analyzing lesson reading material...</h3>
            <p className="text-xs text-slate-400">Google Gemini AI is crafting 3 multiple-choice questions.</p>
          </div>
        )}

        {/* Active Quiz Question State */}
        {questions.length > 0 && !isQuizCompleted && !isPending && currentQ && (
          <div className="space-y-6">
            
            {/* Question Title */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Question {currentIndex + 1}:
              </span>
              <h3 className="text-base font-bold text-slate-100 leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Option Cards */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((optionText, optIndex) => {
                let borderStyle = "border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60";
                let textStyle = "text-slate-300";

                if (selectedOption === optIndex) {
                  borderStyle = "border-emerald-500/60 bg-emerald-950/30 text-emerald-300 font-semibold";
                }

                if (isAnswerSubmitted) {
                  if (optIndex === currentQ.correctAnswerIndex) {
                    borderStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold shadow-md shadow-emerald-500/10";
                  } else if (selectedOption === optIndex && optIndex !== currentQ.correctAnswerIndex) {
                    borderStyle = "border-red-500/80 bg-red-500/15 text-red-300 font-medium";
                  }
                }

                return (
                  <button
                    key={optIndex}
                    type="button"
                    onClick={() => handleSelectOption(optIndex)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all duration-200 flex items-center justify-between ${borderStyle}`}
                  >
                    <span className={textStyle}>{optionText}</span>
                    
                    {isAnswerSubmitted && optIndex === currentQ.correctAnswerIndex && (
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {isAnswerSubmitted && selectedOption === optIndex && optIndex !== currentQ.correctAnswerIndex && (
                      <XCircle className="size-4 text-red-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box on Answer Submission */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 shadow-inner">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Sparkles className="size-3.5" />
                  AI Explanation:
                </span>
                <p className="leading-relaxed text-slate-300">{currentQ.explanation}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-end pt-2">
              {!isAnswerSubmitted ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  variant="brand"
                  size="sm"
                  className="px-6"
                >
                  Check Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  variant="brand"
                  size="sm"
                  className="px-6 flex items-center gap-1.5"
                >
                  <span>{currentIndex < questions.length - 1 ? "Next Question" : "View Score Summary"}</span>
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>

          </div>
        )}

        {/* Quiz Score Summary Card */}
        {isQuizCompleted && (
          <div className="text-center py-8 space-y-5">
            <div className="size-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl">
              <Trophy className="size-8" />
            </div>
            
            <div className="space-y-1">
              <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs">
                Quiz Completed
              </Badge>
              <h3 className="text-2xl font-extrabold text-slate-100">
                You Scored {score} / {questions.length}!
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {score === questions.length
                  ? "🎉 Perfect Score! You have mastered the concepts in this lesson."
                  : "Great effort! Review the reading material to reinforce key concepts."}
              </p>
            </div>

            <Button
              onClick={handleGenerateQuiz}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-200 hover:text-white flex items-center gap-1.5 mx-auto"
            >
              <RotateCcw className="size-3.5" />
              <span>Retake AI Quiz</span>
            </Button>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
