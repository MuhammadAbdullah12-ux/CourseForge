# CourseForge — Week 1 Learning & Implementation Plan

**Approach:** Learn-by-building. New to React/Next.js/TypeScript — read just enough to unblock yourself, then implement directly in the CourseForge codebase.

**Week 1 Goal:** A deployed (even if ugly) Next.js app with a landing page and a course catalog page rendering mock data, with a real understanding of *why* each piece works — not just code that Antigravity generated for you.

**Deliberately excluded from Week 1:** Clerk auth, Prisma/database, instructor-side screens. Those start Week 2, once App Router and Server/Client Components are second nature. Bolting auth and a database onto shaky routing fundamentals is where most people rebuilding from scratch get stuck.

---

## Before You Start — Videos to Watch

Search these terms on YouTube directly (exact video availability/quality shifts over time, so search rather than follow fixed links).

### Before Day 1 — React fundamentals
- "React in 100 seconds" (Fireship) — 2 min gut-check overview
- "React useState explained" (Web Dev Simplified or Codevolution) — 10–15 min
- "props vs state React" — one focused video; it'll really click once you build the Counter yourself

### Before Day 2 — the most important one this week
- "Next.js App Router explained" or "Next.js 15 App Router crash course" (Jack Herrington, Web Dev Simplified, or Vercel's own channel — search "Vercel Next.js App Router")
- "Server Components vs Client Components Next.js" — watch even if it feels abstract at first; it'll make more sense *after* you hit the `useState`-in-a-Server-Component error yourself on Day 2
- Skip anything titled "Next.js Pages Router" — that's the old system, not what you're using

### Before Day 3 — Tailwind + shadcn/ui
- "Tailwind CSS crash course" (Traversy Media or Web Dev Simplified) — 20–30 min is plenty
- "shadcn/ui explained" or "shadcn ui tutorial" — look for one that explains it's *not* an npm package, since that's the confusing part coming from other component libraries

### Before Day 6 — dynamic routes
- "Next.js dynamic routes explained" — a short, single-topic video is enough

### Skip
- Full "build a SaaS in Next.js" mega-tutorials (4+ hours) — you'll copy along without understanding, which fights the learn-by-building goal. You already have the build plan; you just need the concept videos.
- Redux/Zustand/state management videos — not needed yet, plain `useState` covers Week 1.
- TypeScript "full course" videos — you only need enough to type props and `useState`, which the React videos above cover incidentally.

**Pacing tip:** Watch the Day 2 videos (App Router, Server/Client Components) *twice* — once before starting, once again after hitting the errors on Day 2 itself. It'll make far more sense the second time.

---

## Day 1 — React Refresher + TypeScript Basics for React

**Study (30–45 min):**
- React docs, "Describing the UI" — components, JSX, props: https://react.dev/learn/describing-the-ui
- React docs, "Adding Interactivity" — `useState` specifically: https://react.dev/learn/state-a-components-memory
- Skim "TypeScript for React" basics: typing props with `interface`/`type`, typing `useState<T>()`

**Build:**
No Next.js yet. In a throwaway Vite + React + TS sandbox (or CodeSandbox), build 3 tiny components:
- A `Card` that takes `title` and `children` as typed props
- A `Counter` with `useState`
- A `List` that maps over an array of typed objects and renders `Card`s

**Understand before moving on:**
- Why does React re-render when state changes but not when a plain variable changes?
- What's the difference between a prop and state?
- Why does TypeScript want props typed — what breaks if you don't?

**Deliverable:** 3 working, correctly-typed components in a sandbox.

---

## Day 2 — Next.js App Router Mental Model

This is the day most beginners skip past and regret later. Spend real time here.

**Study:**
- Next.js docs, "Routing Fundamentals": https://nextjs.org/docs/app/building-your-application/routing
- Server Components vs Client Components — the biggest mental shift from plain React: https://nextjs.org/docs/app/building-your-application/rendering/server-components

**Build:**
- `npx create-next-app@latest courseforge` (App Router, TypeScript, Tailwind — yes to all)
- Confirm it deploys to Vercel immediately — do this today, not later
- Create 2 dummy routes by hand: `/about/page.tsx` and `/courses/page.tsx`, each just returning an `<h1>`. Confirm both render with zero config.
- Add a `layout.tsx` with a shared nav bar linking to `/`, `/about`, `/courses`. Notice it doesn't re-render on navigation.

**Understand before moving on:**
- Why does a Server Component run only on the server — what happens if you try `useState` inside one? (Try it, read the error.)
- When would you actually need `"use client"`?
- Why is `layout.tsx` shared across routes but `page.tsx` isn't?

**Deliverable:** Deployed Next.js skeleton with working nav across 3 routes.

---

## Day 3 — Tailwind + shadcn/ui + Design Tokens

**Study:**
- Tailwind docs, "Core Concepts" — utility-first approach, just skim: https://tailwindcss.com/docs/styling-with-utility-classes
- shadcn/ui docs, "Introduction" — it's CLI-generated code that lives in your repo, not an npm package: https://ui.shadcn.com/docs

**Build:**
- Set up Tailwind theme tokens in `tailwind.config` — pick primary/accent/neutral colors now, don't leave Tailwind defaults
- `npx shadcn@latest init`, then add `button`, `card`, `badge`
- Restyle the shadcn `Button` variant colors to match your palette by editing the generated component file directly (not just via `className`) — this is where you learn shadcn components are yours to edit, not a black box

**Understand before moving on:**
- Why does shadcn generate a `components/ui/button.tsx` file in your repo instead of installing a package?
- What's the difference between styling via `className="bg-blue-500"` vs editing the component's own default styles?

**Deliverable:** A working `Button` and `Card` matching your color palette, visible on `/about`.

---

## Day 4 — Landing Page

**Study:**
- Nothing new conceptually — this day applies Days 1–3.
- Quick look at Next.js `<Image>` and `<Link>` and why they exist instead of `<img>`/`<a>`: https://nextjs.org/docs/app/api-reference/components/image

**Build:**
- Replace `/page.tsx` with a real landing page: hero section, a "Browse Courses" CTA (shadcn `Button` + Next `Link`), a 3-card feature section using your `Card` component
- Write a short `design-notes.md` entry for this page *before* building it, describing the layout in words — this is a habit you'll reuse when prompting Antigravity for later screens

**Understand before moving on:**
- Why `Link` instead of `<a href>` — what does it actually do differently on click?

**Deliverable:** A real, styled landing page.

---

## Day 5 — Course Catalog with Mock Data

**Study:**
Nothing new — this is where props typing (Day 1) and Server Components (Day 2) come together.

**Build:**
- Create `types.ts` with a `Course` interface (`id`, `title`, `description`, `instructor`, etc.) mirroring the Prisma schema fields from the main project plan — intentional, so the shape doesn't surprise you later when it's real data
- Create `mock-courses.ts` with 6–8 fake `Course[]` objects
- Build `/courses/page.tsx` as a Server Component that imports the mock array and `.map()`s it into `Card`s

**Understand before moving on:**
- Why can a Server Component just `import` the mock data and use it directly, with no `useEffect`/`fetch`/loading state? (This is the "aha" moment for App Router — no fetching-in-`useEffect` like plain React.)

**Deliverable:** `/courses` rendering a grid of course cards from mock data.

---

## Day 6 — Dynamic Routes: Course Detail Page

**Study:**
- Next.js docs, "Dynamic Routes": https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes

**Build:**
- Create `/courses/[courseId]/page.tsx`
- Read the `params` prop, look up the matching course from your mock array by id, render its detail (title, description, an "Enroll" button that does nothing yet)
- Link each `Card` on `/courses` to `/courses/${course.id}`

**Understand before moving on:**
- Where does `params.courseId` actually come from — trace it from the URL to the folder name `[courseId]` yourself
- What happens visiting `/courses/does-not-exist`? Why? (Good segue into `notFound()` — try it.)

**Deliverable:** Clickable course cards leading to individual course detail pages.

---

## Day 7 — Consolidate, Refactor, Deploy, Reflect

- No new concepts. Re-read your code from Days 4–6 and clean it up: extract repeated JSX into components, make sure every prop is typed, remove any `any`
- Push to `main`, confirm the Vercel deploy reflects all 3 pages correctly
- Write a short `notes.md` in your own words explaining:
  1. Server vs Client Components
  2. How App Router file-based routing works
  3. How shadcn/ui differs from a normal component library

  If you can't explain one clearly, that's your Monday-of-Week-2 review topic before moving on to Clerk/auth.

---

## What's Next

Week 2 covers Clerk auth, Prisma + the database schema, and the remaining instructor-side screens — once App Router and Server/Client Components feel automatic.
