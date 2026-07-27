import { Course } from "../types";

export const MOCK_COURSES: Course[] = [
  {
    id: "course-react-101",
    title: "React Fundamentals: Learn by Building",
    description: "Master React basics: JSX, component anatomy, props, useState, and dynamic lists through hands-on practice.",
    instructorName: "Jane Doe",
    published: true,
    createdAt: "2026-07-01T00:00:00Z"
  },
  {
    id: "course-nextjs-app",
    title: "Next.js 15 App Router deep dive",
    description: "Learn how modern file-based routing, layouts, and the shift to React Server Components (RSC) speed up frontend apps.",
    instructorName: "John Smith",
    published: true,
    createdAt: "2026-07-05T00:00:00Z"
  },
  {
    id: "course-ts-intro",
    title: "TypeScript for Full-Stack Developers",
    description: "Write cleaner, error-free JavaScript. Learn types, interfaces, utility helpers, and strict compile validation.",
    instructorName: "Alice Johnson",
    published: true,
    createdAt: "2026-07-10T00:00:00Z"
  },
  {
    id: "course-tailwind-design",
    title: "Mastering Tailwind CSS & UI Design",
    description: "Learn styling theory, responsive grid breakpoints, animations, and how to build a design system directly in code.",
    instructorName: "Sarah Connor",
    published: true,
    createdAt: "2026-07-15T00:00:00Z"
  },
  {
    id: "course-db-postgres",
    title: "Database Relational Design & Prisma",
    description: "Understand databases from the ground up: schemas, primary keys, relational mapping, and Prisma ORM query writing.",
    instructorName: "Robert Miller",
    published: true,
    createdAt: "2026-07-20T00:00:00Z"
  },
  {
    id: "course-ai-agentic",
    title: "AI Integrations & Agentic Workflows",
    description: "Build LLM applications. Implement streaming prompt contexts, outline generators, and lesson-scoped AI tutors.",
    instructorName: "Professor Xavier",
    published: true,
    createdAt: "2026-07-25T00:00:00Z"
  }
];
