"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Terminal, Play, RotateCcw, Copy, Check, Code2, Sparkles } from "lucide-react";

interface LiveCodeSandboxProps {
  initialCode?: string;
  lessonTitle?: string;
}

const PRESET_SNIPPETS: Record<string, string> = {
  default: `// CourseForge Interactive Playground
const courseName = "CourseForge Full-Stack Track";
const modules = ["JSX Anatomy", "State & Hooks", "AI Tutors", "PostgreSQL"];

console.log("Welcome to " + courseName + "!");
console.log("Modules in curriculum:", modules.length);

const uppercaseModules = modules.map((m, idx) => \`\${idx + 1}. \${m.toUpperCase()}\`);
console.log("Formatted Modules:");
uppercaseModules.forEach(item => console.log(item));
`,
  async: `// Async Data Pipelines Example
async function simulateCourseFetch(id) {
  console.log("Fetching course ID:", id, "from cloud database...");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, title: "Next.js 15 Deep Dive", rating: 4.9 });
    }, 300);
  });
}

console.log("Initiating server request...");
simulateCourseFetch("course-101").then(data => {
  console.log("Received payload:", JSON.stringify(data));
});
`,
};

export function LiveCodeSandbox({ initialCode, lessonTitle }: LiveCodeSandboxProps) {
  const [code, setCode] = useState(initialCode || PRESET_SNIPPETS.default);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRunCode = () => {
    setLogs([]);
    setError(null);

    const capturedLogs: string[] = [];

    // Custom console.log interceptor
    const customConsole = {
      log: (...args: any[]) => {
        const formatted = args
          .map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)))
          .join(" ");
        capturedLogs.push(formatted);
      },
      warn: (...args: any[]) => {
        capturedLogs.push(`[WARN] ${args.join(" ")}`);
      },
      error: (...args: any[]) => {
        capturedLogs.push(`[ERROR] ${args.join(" ")}`);
      },
    };

    try {
      // Execute user code safely within Function scope
      const runFn = new Function("console", code);
      runFn(customConsole);

      if (capturedLogs.length === 0) {
        capturedLogs.push("✓ Code executed successfully with no console.log outputs.");
      }

      setLogs(capturedLogs);
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  const handleReset = () => {
    setCode(initialCode || PRESET_SNIPPETS.default);
    setLogs([]);
    setError(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-emerald-500/30 bg-slate-900/80 backdrop-blur-md shadow-2xl overflow-hidden mt-6">
      
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shadow-md">
              <Terminal className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base text-slate-100 flex items-center gap-1.5 font-bold">
                <span>Live Interactive Code Sandbox</span>
                <Sparkles className="size-3.5 text-emerald-400 animate-pulse" />
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Edit and execute JavaScript code snippets live in your browser
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs">
              JS Client Runtime
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        
        {/* Editor Controls Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 font-mono text-emerald-400">
            <Code2 className="size-4" />
            <span>script.js</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[11px]"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[11px]"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Code Input Area */}
        <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            spellCheck={false}
            className="w-full p-4 bg-transparent font-mono text-xs sm:text-sm text-emerald-300 placeholder-slate-600 focus:outline-none resize-y leading-relaxed"
          />
        </div>

        {/* Execute Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleRunCode}
            variant="brand"
            size="sm"
            className="px-6 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Play className="size-4 fill-current text-slate-950" />
            <span>Run Code</span>
          </Button>
        </div>

        {/* Live Terminal Output Box */}
        {(logs.length > 0 || error) && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Terminal className="size-3.5 text-emerald-400" />
                Terminal Console Output:
              </span>
              <Badge variant="secondary" className="bg-slate-900 text-slate-400 text-[10px]">
                stdout
              </Badge>
            </div>

            {error ? (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 whitespace-pre-wrap">
                ❌ Runtime Error: {error}
              </div>
            ) : (
              <div className="space-y-1 text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {logs.map((logLine, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-slate-600 select-none">&gt;</span>
                    <span>{logLine}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
