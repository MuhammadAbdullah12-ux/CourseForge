# ⚡ CourseForge | Next-Gen AI-Assisted Learning Platform

> An adaptive, high-performance Learning Management System (LMS) built with **Next.js 16 App Router**, **TypeScript**, **Tailwind CSS**, **Supabase PostgreSQL**, **Prisma 7 ORM**, and **Clerk Authentication**.

---

## 🌟 12 Core Platform Highlights

| Feature | Category | Description |
| :--- | :--- | :--- |
| ⚡ **Next.js 16 App Router** | Engine | Powered by Turbopack compilation & React Server Components (RSC) |
| 🤖 **Lesson AI Tutors** | AI Ecosystem | Interactive lesson-scoped AI assistant for summaries & practice quizzes |
| 🎭 **Role-Based Workspaces** | User Experience | Dedicated Student Learning Portals & Instructor Command Centers |
| 🛡️ **Edge RBAC Security** | Security | Next.js Edge middleware enforcing JWT session claim authorization |
| ⚡ **Server Actions Mutations** | Data Layer | Zero-API RPC functions for course creation and student enrollments |
| 🗄️ **Supabase PostgreSQL** | Cloud Database | Managed relational database hosted in Tokyo (AP-Northeast) region |
| 🔌 **Prisma 7 ORM** | Data Layer | Type-safe database queries with `@prisma/adapter-pg` driver adapters |
| 🔐 **Clerk Authentication** | Auth & Identity | OAuth, dynamic `/sign-in` & `/sign-up` routes, and custom session tokens |
| 🔄 **Svix Webhook Sync** | Real-Time Sync | HMAC-SHA256 signature verification handler for Clerk -> Supabase user sync |
| 🔍 **Live Search & Filter** | Interactive UI | Real-time catalog keyword search & category filter pills |
| 🎨 **Popping Micro-Scale UI** | Animations | Popping micro-scale lifts (`hover:scale-[1.03]`) & emerald-teal color grading |
| ☁️ **Vercel Cloud CI/CD** | Deployment | Automated GitHub Webhook cloud deployment pipeline on Edge CDN |

---

## 🏛️ System Architecture Diagram

```mermaid
graph TD
    subgraph Client ["Browser & Client Layer"]
        UI["React Server & Client Components"]
        Search["Live Search & Category Filters"]
        Form["Progressive Server Action Forms"]
    end

    subgraph Security ["Edge Security & Authentication"]
        Middleware["Next.js Edge Middleware (src/middleware.ts)"]
        ClerkAuth["Clerk Identity Provider (@clerk/nextjs)"]
        JWTClaims["JWT Session Token Claims (role: INSTRUCTOR/STUDENT)"]
    end

    subgraph ServerLayer ["Server Execution & Logic Layer"]
        RSC["React Server Components Rendering"]
        ServerActions["Server Actions (course-actions.ts / user-actions.ts)"]
        WebhookHandler["Svix Webhook Handler (/api/webhooks/clerk)"]
    end

    subgraph DatabaseLayer ["Cloud Database & ORM Layer"]
        PrismaAdapter["Prisma 7 ORM (@prisma/adapter-pg)"]
        PgPool["PostgreSQL Connection Pool (pg.Pool)"]
        SupabaseDB[("Supabase Cloud PostgreSQL - Tokyo AP-Northeast")]
    end

    UI --> Middleware
    Middleware --> ClerkAuth
    ClerkAuth --> JWTClaims
    JWTClaims --> RSC
    Form --> ServerActions
    ServerActions --> PrismaAdapter
    WebhookHandler --> PrismaAdapter
    PrismaAdapter --> PgPool
    PgPool --> SupabaseDB
```

---

## 🌐 Live Production Deployments

*   🏠 **Home Page:** [https://course-forge-gamma.vercel.app](https://course-forge-gamma.vercel.app)
*   📚 **Course Catalog & Live Search:** [https://course-forge-gamma.vercel.app/courses](https://course-forge-gamma.vercel.app/courses)
*   🎭 **Interactive Role Onboarding:** [https://course-forge-gamma.vercel.app/select-role](https://course-forge-gamma.vercel.app/select-role)
*   👨‍🏫 **Instructor Management Dashboard:** [https://course-forge-gamma.vercel.app/dashboard/instructor](https://course-forge-gamma.vercel.app/dashboard/instructor)

---

## 🚀 Key Architectural Features Completed (Weeks 1 & 2)

### 🎨 1. UI/UX Design System & Micro-Animations
*   **Popping Micro-Scale Transforms:** Interactive button lift and scaling animations (`hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.97]`).
*   **Emerald-Teal Gradient Color-Grading:** Hover states dynamically transition into emerald-to-teal gradients with neon ambient box-shadow glows (`hover:shadow-lg hover:shadow-emerald-500/25`).
*   **Live Catalog Search & Filter Pills:** Real-time keyword filtering and category filter buttons (`All`, `React`, `Next.js`, `TypeScript`).
*   **Ambient Glow Mesh Hero & Bento Grid:** Feature showcase grid highlighting AI tutors, Server Actions, RBAC workspaces, and cloud databases.
*   **Sleek 4-Column Dark-Mode Footer:** Footer containing platform navigation links, tech stack badges, and GitHub repository links.

### 🎭 2. Interactive Role Selection & Onboarding
*   **Universal Role Selection Screen (`/select-role`):** Interactive onboarding choice cards for **Student Mode** and **Instructor Mode**.
*   **1-Click Mode Switcher Badge:** Header navigation bar displays an active mode indicator (`Instructor Mode` / `Student Mode`) with a 1-click `Switch` trigger.
*   **Guest & Authenticated Handling:** Supports both guest visitors (directing instructors to `/sign-in` and students to `/courses`) and authenticated users (updating Clerk metadata and Supabase `User.role` in 1 click).

### 🛡️ 3. Edge Authentication & Role-Based Access Control (RBAC)
*   **Clerk Integration (`@clerk/nextjs`):** Dynamic catch-all sign-in (`/sign-in`) and sign-up (`/sign-up`) routes.
*   **Edge Middleware Protection (`src/middleware.ts`):** Edge route matchers inspect JWT session claims (`sessionClaims.metadata.role`) to strictly protect `/dashboard/instructor(.*)` routes.

### ⚡ 4. Next.js 16 Server Actions & Data Mutations
*   **Course Creation Action (`createCourseAction`):** `"use server"` function validating inputs, checking instructor session authorization, and creating course rows in Supabase.
*   **Student Enrollment Action (`enrollInCourseAction`):** Parameter-bound (`.bind()`) server action inserting relational rows into the `Enrollment` table.
*   **Edge Cache Invalidation:** Calls `revalidatePath('/courses', 'layout')` to purge Vercel CDN caches, instantly updating UI enrollment state to `✓ You are Enrolled in this Course`.

### 🗄️ 5. Cloud Database & Automated User Sync
*   **Supabase PostgreSQL:** Managed cloud database hosted in Tokyo AP-Northeast region.
*   **Prisma 7 ORM Integration:** Configured with `@prisma/adapter-pg` driver adapters and `pg.Pool` connection pooling.
*   **Real-Time Clerk Webhooks (`/api/webhooks/clerk`):** Cryptographic Svix HMAC-SHA256 signature verification handler synchronizing `user.created`, `user.updated`, and `user.deleted` events into Supabase via `prisma.user.upsert`.

---

## 🗃️ Database Schema Architecture (`schema.prisma`)

```prisma
model User {
  id          String       @id @default(cuid())
  clerkId     String       @unique
  email       String       @unique
  role        UserRole     @default(STUDENT)
  courses     Course[]     @relation("InstructorCourses")
  enrollments Enrollment[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Course {
  id           String       @id @default(cuid())
  title        String
  description  String
  published    Boolean      @default(false)
  instructorId String
  instructor   User         @relation("InstructorCourses", fields: [instructorId], references: [id], onDelete: Cascade)
  lessons      Lesson[]
  enrollments  Enrollment[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Lesson {
  id        String   @id @default(cuid())
  title     String
  content   String
  order     Int
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Enrollment {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, courseId])
}

enum UserRole {
  STUDENT
  INSTRUCTOR
}
```

---

## 🛠️ Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/MuhammadAbdullah12-ux/CourseForge.git
cd CourseForge/courseforge
npm install
```

### 2. Configure Environment Variables
Create `.env` inside `courseforge/`:
```env
DATABASE_URL=postgresql://postgres.eeeeftbbcbblxsqlcsrq:pzYpF3NvhvmmQmbW@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.eeeeftbbcbblxsqlcsrq:pzYpF3NvhvmmQmbW@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZXZvbHZpbmctc2hhcmstOC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_i3Vp89F1KVDzem3AjF7K2ceu0yaxygxqSmTRp8cpGQ
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
WEBHOOK_SECRET=whsec_placeholder
```

### 3. Push Prisma Database Schema & Seed Data
```bash
npx prisma db push
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser!

---

© 2026 CourseForge Platform. Built with Next.js 16, Supabase PostgreSQL & Prisma 7.
