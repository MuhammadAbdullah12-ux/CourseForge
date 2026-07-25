CourseForge — AI-Assisted Learning Platform
Full-Stack Project Proposal & Implementation Plan (Code-First Edition)
Author: [Your Name]
Date: July 2026
Type: Personal practice project (resume/portfolio grade)
Tools: Antigravity (agentic coding IDE, full-stack — frontend + backend) → Vercel (deployment)

1. Executive Summary

CourseForge is a two-role learning platform where instructors create courses (with AI-assisted drafting) and students enroll, learn, and chat with a lesson-scoped AI tutor. The project is deliberately scoped to exercise every layer of a modern full-stack application — multi-role auth, nested routing, relational database design, LLM API integration, and production deployment — while staying small enough to finish in 3–4 weeks of part-time work.

This edition drops any AI design tool from the workflow. Every screen — from the landing page to the analytics dashboard — is hand-built in code (Next.js + Tailwind + shadcn/ui), scaffolded and iterated on with the help of an agentic coding IDE. You write/prompt real component code from day one instead of exporting from a design tool.

What this project proves on a resume:
- Full-stack development (frontend, backend, database, deployment)
- Hands-on UI engineering — component architecture, responsive layout, accessible markup, design-system usage, all written in code
- Role-based access control and complex routing
- LLM/AI API integration (generation + contextual chat)
- Agentic development workflow (using an AI IDE to scaffold and wire up both frontend and backend)

2. Tooling Strategy — Why a Single Code-First Tool

Instead of splitting design and engineering across two products, this version keeps everything inside one agentic coding IDE, working the way a real solo/full-stack engineer would: describe a feature or screen in a prompt, review the generated code, edit it directly, and iterate — with UI, state, API routes, and database all living in the same codebase from day one.

2.1 Antigravity (Full-Stack Layer)

Antigravity is Google's agent-first IDE (built on Gemini). It runs agents that can plan, write code across multiple files, execute terminal commands, spin up a real browser to click through and test your app, and iterate on failures autonomously. It has two modes: the Editor View (hands-on, like VS Code with inline AI) and the Agent Manager / Mission Control (spawn background agents to work on isolated tasks — e.g., "build the enrollment API" — while you keep working elsewhere).

Role in this project: Everything. Scaffold the Next.js project structure, build every UI component and page by hand (with agent assistance for boilerplate), build the database schema, write API routes, wire up auth/middleware, integrate the Gemini API, and use its browser-testing agent to verify flows end-to-end (sign up → enroll → chat with tutor) without manually QA-ing every click yourself.

2.2 Why code-first instead of design-tool-first

- No handoff seam to manage — one mental model, one codebase, no "does the exported component match the design tool's version" drift.
- Forces you to actually practice component architecture, Tailwind styling, and responsive design by hand — skills that get hidden when a design tool exports finished code for you.
- Faster to restructure mid-project: since there's no separate design source of truth, changing a layout is just editing a component, not re-syncing two tools.
- More representative of how most small teams without a dedicated designer actually ship: engineers building UI directly from a style guide + component library, not from hi-fi mockups.

3. Final Tech Stack

Layer | Choice | Notes
--- | --- | ---
Frontend framework | Next.js 15 (App Router) + React 19 | Route groups + middleware for role-based routing
Styling / UI kit | Tailwind CSS + shadcn/ui | Pre-built accessible primitives you customize directly in code
UI design reference | A written style guide (Section 4 below), not a design tool | Colors, type scale, spacing, and component states defined as text/config, not mockups
Agentic dev tool | Antigravity (Gemini-based) | Scaffolding, full UI build, backend wiring, testing agent
Backend | Next.js Route Handlers (/app/api/**) | No need for a separate server; keeps deploy simple
Database | PostgreSQL via Supabase | Postgres-as-a-service; auth/realtime/storage unused here, DB only
ORM | Prisma | Type-safe queries, migrations, Prisma Studio for data browsing
Auth | Clerk | Built-in role/metadata support, fast to wire up
LLM provider | Gemini API via Vercel AI SDK (@ai-sdk/google) | Streaming chat, course generation, quiz generation
Deployment | Vercel (app) + Supabase (DB) | CI/CD on push to main
Version control | GitHub | Also required for Antigravity's agent workflows and Vercel's git integration

4. Lightweight Design System (Replaces Figma Make)

Since there's no design tool, define the visual language up front as a small written spec you feed to Antigravity when prompting UI components, so the app stays visually consistent without mockups.

- Color palette: pick 1 primary, 1 accent, neutrals (gray-50 → gray-900), plus success/warning/error — define as Tailwind theme tokens in tailwind.config
- Type scale: a fixed set (text-sm / base / lg / xl / 2xl / 3xl) with one heading font pairing and one body font, set once in globals.css
- Spacing/radius/shadow scale: default to Tailwind's scale, don't invent a custom one
- Component baseline: shadcn/ui components (button, card, input, dialog, tabs, table, badge) installed once and restyled minimally to match the palette — this becomes your "design system" instead of a Figma library
- Reference layouts: instead of Figma frames, keep a short markdown file (design-notes.md) per major screen describing layout in words (e.g., "lesson player: 60/40 split, left = scrollable lesson content, right = sticky chat panel with input pinned to bottom") — this is what you paste into Antigravity prompts for consistent results

This keeps the "design phase" real but fast: you're making the same decisions a design tool would force on you, just expressed as code tokens and short written specs instead of visual mockups.

5. Product Scope

5.1 Roles
- Student — browses/enrolls in courses, learns lessons, chats with AI tutor, tracks progress
- Instructor — creates/edits courses and lessons (AI-assisted drafting), views analytics
- (Optional stretch) Admin — manages users, can unpublish/feature courses

5.2 Core Feature List

Public
- Landing page
- Course catalog (browse/search/filter)
- Public course detail page (with enroll CTA, gated content preview)

Student-facing
- Dashboard: enrolled courses + progress
- Lesson player: renders lesson content + inline AI tutor chat scoped to that lesson
- Progress page: completion %, quiz scores across all enrolled courses

Instructor-facing
- Dashboard: list of created courses, publish status, quick stats
- Course creator: type a topic → AI drafts a full outline + lesson content → instructor edits/reorders/publishes
- Course editor: manage lessons, content, quiz questions
- Analytics: per-course engagement, quiz score distribution, AI-summarized "common student confusion points" (derived from tutor chat logs)

5.3 Where the LLM Is Actually Used (not just a bolted-on chatbot)
1. Course outline generation — instructor prompt → structured JSON lesson plan → rendered as editable course draft
2. Lesson-scoped AI tutor — chat constrained to the current lesson's content (pass lesson text as context; no vector DB needed at this scale)
3. Auto-generated quiz questions — from lesson content, with AI grading of short-answer responses
4. Instructor insight summaries — LLM reads recent tutor chat logs for a course and summarizes recurring points of confusion

6. Routing Map

Routing concepts you'll practice:
- Route groups (student) / (instructor) with distinct layouts
- Nested dynamic segments ([courseId]/learn/[lessonId])
- Middleware-based redirects based on Clerk role metadata (a student hitting /instructor/* gets bounced)
- Public vs. protected route boundaries
- Parallel/loading/error states per route segment (loading.tsx, error.tsx)

Routes:
- / → public landing page
- /courses → public catalog (browse/search)
- /courses/[courseId] → public course detail (enroll CTA)
- /sign-in
- /sign-up
- /(student)/dashboard → enrolled courses
- /(student)/courses/[courseId]/learn/[lessonId] → lesson player + AI tutor
- /(student)/progress → cross-course progress tracking
- /(instructor)/dashboard → created courses + quick stats
- /(instructor)/courses/new → AI-assisted course creation
- /(instructor)/courses/[courseId]/edit → lesson management
- /(instructor)/courses/[courseId]/analytics → engagement + AI-summarized insights
- /admin → (optional) user & course moderation

7. Database Schema (Prisma)

Datasource config (Supabase):

```
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")  // Supabase pooled (pgbouncer) connection
  directUrl = env("DIRECT_URL")    // Supabase direct connection — used for migrations
}
```

```
model User {
  id            String        @id @default(cuid())
  clerkId       String        @unique
  role          Role          @default(STUDENT)
  name          String
  email         String        @unique
  createdAt     DateTime      @default(now())
  coursesOwned  Course[]      @relation("InstructorCourses")
  enrollments   Enrollment[]
  progress      Progress[]
  chatMessages  ChatMessage[]
}

enum Role {
  STUDENT
  INSTRUCTOR
  ADMIN
}

model Course {
  id            String       @id @default(cuid())
  instructorId  String
  instructor    User         @relation("InstructorCourses", fields: [instructorId], references: [id])
  title         String
  description   String
  published     Boolean      @default(false)
  createdAt     DateTime     @default(now())
  lessons       Lesson[]
  enrollments   Enrollment[]
}

model Lesson {
  id             String         @id @default(cuid())
  courseId       String
  course         Course         @relation(fields: [courseId], references: [id])
  order          Int
  title          String
  content        String         @db.Text
  quizQuestions  QuizQuestion[]
  progress       Progress[]
  chatMessages   ChatMessage[]
}

model QuizQuestion {
  id         String  @id @default(cuid())
  lessonId   String
  lesson     Lesson  @relation(fields: [lessonId], references: [id])
  question   String
  answerKey  String
}

model Enrollment {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  courseId    String
  course      Course    @relation(fields: [courseId], references: [id])
  enrolledAt  DateTime  @default(now())

  @@unique([userId, courseId])
}

model Progress {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  lessonId    String
  lesson      Lesson    @relation(fields: [lessonId], references: [id])
  completed   Boolean   @default(false)
  quizScore   Int?
  updatedAt   DateTime  @updatedAt

  @@unique([userId, lessonId])
}

model ChatMessage {
  id         String    @id @default(cuid())
  userId     String
  user       User      @relation(fields: [userId], references: [id])
  lessonId   String
  lesson     Lesson    @relation(fields: [lessonId], references: [id])
  role       String    // "user" | "assistant"
  content    String    @db.Text
  createdAt  DateTime  @default(now())
}
```

This schema is intentionally relational (not a single flat table) — you'll practice real foreign keys, unique composite constraints, and join queries (e.g., "get all lessons + progress for a student's enrolled courses").

8. Implementation Plan — Phase by Phase

Phase 0: Setup (Day 1)
- Create GitHub repo
- Create Supabase project, grab both connection strings (pooled + direct) from Project Settings → Database
- Set up Clerk project, note API keys
- Get Gemini API key (Google AI Studio)
- Create empty Next.js 15 app locally, install Tailwind + shadcn/ui, confirm it deploys to Vercel immediately (deploy early — don't wait until the end)
- Define the design tokens: colors, type scale, and spacing in tailwind.config + globals.css (Section 4)
- Install Antigravity, open the repo as a project inside it

Phase 1: Design System + Static UI Build (Days 2–6)
Work screen by screen, but in code — build each as a real Next.js page/component with static or mock data, no backend logic wired yet. Write a one-paragraph design-notes.md entry per screen before prompting Antigravity, so the agent has a spec to follow instead of guessing layout from scratch.

1. Install and restyle base shadcn/ui components (button, card, input, badge, tabs, dialog, table) to match your palette
2. Landing page + course catalog (with mock course data)
3. Public course detail page
4. Sign in / sign up screens (Clerk's pre-built components, restyled to match)
5. Student dashboard + progress page (mock data)
6. Lesson player layout (content pane + chat pane, chat non-functional yet)
7. Instructor dashboard (mock data)
8. Course creator flow UI (topic input → static outline preview → edit UI)
9. Course editor UI (lesson list, reorder, edit content)
10. Analytics page UI (chart placeholders, summary cards)

Deliverable: A fully click-through Next.js app with every screen built in real components, running on mock/static data, deployed to a Vercel preview.

Tip: When prompting Antigravity, paste the relevant design-notes.md entry plus a reference to an already-built component (e.g., "match the card styling used in the course catalog") so visual consistency carries across screens without a shared design file.

Phase 2: Backend Scaffolding (Days 7–8)
- Configure Prisma: paste in schema from Section 7, set DATABASE_URL (Supabase pooled connection) and DIRECT_URL (Supabase direct connection) in .env, run first migration against Supabase
- Wire up Clerk, add role to user metadata, write middleware that redirects based on role
- Prompt Antigravity's agent: "Set up the App Router route structure for a two-role app: public routes, a (student) route group, and an (instructor) route group, each with their own layout, matching the pages already built in Phase 1."

Phase 3: Core CRUD + Auth Flows (Days 9–13)
Use Antigravity's Agent Manager to parallelize independent chunks — e.g., spawn one agent on "build course CRUD API routes" while you work in the editor on enrollment logic.
- Course CRUD (create/edit/publish) — instructor only
- Lesson CRUD nested under courses
- Enrollment flow (student enrolls, unenrolls)
- Progress tracking (mark lesson complete)
- Replace mock data in every Phase 1 screen with real data fetched from the database
- Use Antigravity's browser-testing agent to click through: sign up as instructor → create course → sign up as student → enroll → complete lesson. Let it catch broken flows before you manually test.

Phase 4: LLM Integration (Days 14–18)
- Install Vercel AI SDK (ai, @ai-sdk/google), connect Gemini API
- Course generation: prompt → structured JSON (title, description, lessons[]) → instructor reviews/edits before publishing. Enforce JSON-only output from the model and validate/parse it server-side.
- Lesson tutor chat: streaming chat endpoint, system prompt constrained to the specific lesson's content field, persist messages to ChatMessage
- Quiz generation: given lesson content, generate N question/answer pairs; store in QuizQuestion
- Quiz grading: short-answer submissions sent to the LLM with the answer key, returns a score + feedback
- Analytics summarization: pull recent ChatMessage rows for a course, summarize recurring confusion themes for the instructor analytics page

Phase 5: Polish & Analytics UI (Days 19–21)
- Wire dashboard stat cards to real aggregate queries
- Add charts (Recharts) for quiz score distribution / engagement over time
- Loading and error states for all major routes
- Empty states (no courses yet, no enrollments yet)
- Full responsive pass on mobile — since there was no design-tool mockup to check against, this is where you deliberately test every screen at 375px, 768px, and 1440px widths and fix breakpoints by hand
- Accessibility pass: keyboard navigation, focus states, alt text, color contrast (again, your responsibility since there's no design tool flagging these)

Phase 6: Deployment & Wrap-up (Days 22–23)
- Final env var audit on Vercel (Clerk keys, DB URL, Gemini key)
- Push to main, confirm Vercel production deploy is clean
- Run through both role flows one more time in production
- Write README with architecture overview, screenshots, and setup instructions
- Record a short demo video/GIF for your portfolio

9. Guardrails (Keep Scope From Ballooning)
- No payments — enrollment is instant/free
- No video hosting — lessons are text/markdown only
- No vector database — lesson-scoped context is small enough to pass directly into the prompt
- Admin role is optional; skip it if timeline is tight
- Don't over-invest in Phase 1 visual polish before backend logic works — get every screen functionally correct with mock data first, then refine spacing/typography once real data is flowing
- Resist the urge to hand-roll UI primitives shadcn/ui already gives you (buttons, dialogs, tabs) — customize, don't rebuild

10. Resume Bullet Points (once shipped)
- Built CourseForge, a full-stack AI-assisted learning platform with role-based access (student/instructor), hand-coding the entire UI in Next.js 15 + Tailwind + shadcn/ui with PostgreSQL and Prisma, deployed on Vercel.
- Integrated the Gemini API via the Vercel AI SDK for streaming lesson-scoped AI tutoring, AI-generated course outlines, and automated quiz generation/grading.
- Designed and implemented a complete design system (color tokens, type scale, component library) directly in code, then built out backend logic, database schema, and API routes using an agentic development workflow in Antigravity, including automated browser-based end-to-end testing.
- Implemented middleware-based role authorization and nested dynamic routing (Next.js App Router) to serve distinct instructor and student experiences from a single codebase.

11. Suggested Timeline Summary

Phase | Days | Focus
--- | --- | ---
0 | 1 | Setup + design tokens + early deploy
1 | 2–6 | Full UI build in code (mock data), all screens
2 | 7–8 | Backend scaffolding + auth + DB
3 | 9–13 | CRUD + core flows, real data wired in
4 | 14–18 | LLM integration
5 | 19–21 | Polish, responsive/accessibility pass, analytics
6 | 22–23 | Deploy + docs

Total: ~3.5 weeks part-time, achievable in under 2 weeks if working close to full-time. (Slightly longer than the design-tool version since Phase 1 now includes hand-building every screen instead of exporting one.)
