# 🚀 CourseForge

> **An AI-Assisted, Next-Generation E-Learning Platform**  
> Built with Next.js 16 (App Router & Turbopack), Tailwind CSS, Shadcn UI, Prisma v7 ORM, Supabase PostgreSQL, and Clerk Authentication.

![CourseForge Banner](https://img.shields.io/badge/Status-Active_Development-emerald?style=for-the-badge)
![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![Prisma v7](https://img.shields.io/badge/Prisma-7.9-blue?style=for-the-badge&logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Clerk Auth](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)

---

## 🌐 Live Production Demo

*   **Home Page:** [https://course-forge-gamma.vercel.app](https://course-forge-gamma.vercel.app)
*   **Courses Catalog:** [https://course-forge-gamma.vercel.app/courses](https://course-forge-gamma.vercel.app/courses)
*   **Sign In Route:** [https://course-forge-gamma.vercel.app/sign-in](https://course-forge-gamma.vercel.app/sign-in)

---

## 🏗️ Architecture & Tech Stack

CourseForge leverages modern React Server Components (RSC) to minimize client-side bundle size while serving dynamic database records directly from edge endpoints.

```mermaid
graph TD
    Client[Browser / Client Device] --> Layout[Root Layout RSC]
    Layout --> Clerk[Clerk Auth Session]
    Layout --> Middleware[Edge Router Protection Middleware]
    Layout --> Prisma[Prisma v7 Client Singleton]
    Prisma --> Supabase[(Supabase Cloud PostgreSQL)]
```

### Core Technologies
*   **Framework:** Next.js 16 (App Router, Turbopack Compiler)
*   **Styling:** Tailwind CSS v4, Vanilla CSS Design System, Lucide Icons
*   **UI Components:** Shadcn UI (Card, Button, Badge)
*   **Database & ORM:** Supabase Cloud PostgreSQL + Prisma ORM v7 (with `@prisma/adapter-pg` driver adapter)
*   **Authentication:** Clerk Auth (JWT Cookies, Server-Side `auth()` lookup, dynamic `<UserButton />`)
*   **Deployment:** Vercel Edge Hosting (Automated GitHub CI/CD)

---

## ✨ Features Implemented

*   [x] **Day 1–3:** Foundation, layout setup, and dark-mode glassmorphism design system.
*   [x] **Day 4:** Responsive Landing Page with hero section, feature grid cards, and CTA buttons.
*   [x] **Day 5–6:** Courses Catalog UI & Dynamic Routing (`/courses/[courseId]`) with 404 boundaries.
*   [x] **Day 7:** Production compilation validation (`npm run build`).
*   [x] **Day 8:** Supabase PostgreSQL setup + Prisma 7 Schema definition (`User`, `Course`, `Lesson`, `Enrollment`).
*   [x] **Day 9:** Prisma Client Singleton (`lib/prisma.ts`), automated database seeding (`seed.js`), and live PostgreSQL queries replacing static mocks.
*   [x] **Day 10:** Clerk Authentication Provider integration, dynamic catch-all login routes (`/sign-in`, `/sign-up`), and server-side navigation headers.

---

## 🛠️ Local Development Setup

Follow these steps to run CourseForge locally on your computer:

### 1. Prerequisites
Ensure you have installed:
*   [Node.js](https://nodejs.org/) (v20+ recommended)
*   [Git](https://git-scm.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/MuhammadAbdullah12-ux/CourseForge.git
cd CourseForge/courseforge
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file inside the `courseforge/` folder and add your connection keys:

```env
# Supabase PostgreSQL Connection Strings (Direct Port 5432)
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT]:[YOUR_PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT]:[YOUR_PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk Redirect Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 5. Generate Prisma Client & Seed Database
```bash
# Compile local Prisma Client engine
npx prisma generate

# (Optional) Run automated database seeding script
node prisma/seed.js
```

### 6. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 📝 Learning Roadmap & Next Milestones

- [ ] **Day 11:** Role-Based Middleware Routing (Instructor vs. Student route protection)
- [ ] **Day 12:** Server Actions Mutations (Creating & updating courses via server actions)
- [ ] **Day 13:** User Synchronization Webhooks (Syncing Clerk users to Supabase database)
- [ ] **Day 14:** Student Enrollment Flow & Final Review

---

## 👤 Author & Maintainer

Developed with ❤️ as part of the **CourseForge Full-Stack Engineering Track**.
