# 🚀 CourseForge — Adaptive AI Learning & Course Management Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-emerald?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Prisma 7](https://img.shields.io/badge/Prisma-7.9-blue?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Supabase PostgreSQL](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Clerk Auth](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com/)
[![Recharts Visual Engine](https://img.shields.io/badge/Recharts-2.15-22c55e?style=for-the-badge&logo=chartdotjs)](https://recharts.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://course-forge-gamma.vercel.app)

CourseForge is a production-grade, full-stack AI Learning Management System (LMS) designed for modern online education. Built across 28 days of intensive software engineering, it connects students with interactive course tracks, lesson-scoped Google Gemini RAG AI tutors, automated practice quiz evaluation, Recharts performance analytics, and mobile-first web accessibility.

---

## 🌟 Core Features & Highlights

- **1-Click AI Course Authoring:** Instructors enter any technology prompt (*e.g., "Full-Stack Next.js 15 & PostgreSQL Architecture"*) to generate a course title, description, and 4 textbook modules persisted to Supabase PostgreSQL.
- **Lesson-Scoped Google Gemini RAG Tutor:** Students receive real-time AI assistance constrained strictly to the current lesson's reading material context.
- **Sub-Second AI Practice Quiz Engine:** Generates typed multiple-choice quizzes with automated visual grading and attempt tracking.
- **Interactive Recharts Analytics Visual Suite:** Displays pre-aggregated database score distribution histograms (`QuizScoreBarChart`) and course enrollment engagement metrics (`EnrollmentLineChart`).
- **Route-Level Suspense Streaming (`loading.tsx`):** Instant skeleton UI streaming across catalog, course details, classroom workspaces, and dashboards.
- **Error Boundaries & Custom 404 (`error.tsx` & `not-found.tsx`):** Gracefully catches unhandled server exceptions with interactive `reset()` controls and custom 404 landing pages.
- **Live Code Execution Sandbox:** Runs client-side JavaScript code with overridden console outputs.
- **Full Web Accessibility & Mobile Responsiveness:** WCAG 2.1 Level AA compliant with dark-mode color tokens, screen reader ARIA labels, focus-visible rings, and collapsible mobile menu drawer (`Navbar.tsx`).

---

## 🏗️ Architecture & Technical Stack

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.2 (Turbopack)** | App Router, Server Actions, Suspense Streaming Skeletons (`loading.tsx`), Error Boundaries (`error.tsx`) |
| **Database ORM** | **Prisma 7.9 & Supabase PostgreSQL** | Type-safe ORM, relational schema modeling, direct pooled connections |
| **AI Intelligence** | **Google Gemini 2.5 Flash (`@google/genai`)** | RAG prompt injection, structured JSON schema generation |
| **Authentication** | **Clerk Auth & Next.js Proxy** | Role-based metadata (`STUDENT` / `INSTRUCTOR`), Clerk Webhooks sync |
| **Visualization** | **Recharts Vector Suite** | SVG `BarChart` & `AreaChart` styled with custom dark-mode tooltips |
| **Accessibility & Styling** | **Tailwind CSS v4 & Lucide Icons** | WCAG 2.1 Level AA, emerald focus-visible rings, glassmorphism dark mode |

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js `≥ 18.0.0`
- PostgreSQL Database (Supabase recommended)
- Google Gemini API Key

### 2. Environment Variables Setup
Create a `.env` file in `courseforge/` with the following variables:

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database Connection Strings (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres"

# Google Gemini AI Key
GEMINI_API_KEY="AIzaSy..."

# Clerk Webhook Sync Secret
CLERK_WEBHOOK_SECRET="whsec_..."
```

### 3. Installation & Database Push

```bash
# Clone the repository
git clone https://github.com/MuhammadAbdullah12-ux/CourseForge.git
cd CourseForge/courseforge

# Install dependencies
npm install

# Push Prisma relational schema to database
npx prisma db push

# Launch development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 📜 Production Deployment

Deployed live on Vercel Edge Cloud at:  
👉 **[https://course-forge-gamma.vercel.app](https://course-forge-gamma.vercel.app)**
