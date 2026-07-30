import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is missing in environment variables.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting relational lesson seeding in Supabase PostgreSQL...");

  // 1. Fetch published courses from Supabase
  const courses = await prisma.course.findMany();

  if (courses.length === 0) {
    console.log("⚠️ No courses found. Please run seed.js first.");
    return;
  }

  const lessonTemplates = [
    {
      order: 1,
      title: "Lesson 1: Introduction & Component Anatomy",
      content: `## Welcome to Lesson 1: Introduction & Component Anatomy

In this lesson, you will master the foundational building blocks of modern web applications.

### Key Concepts:
1. **JSX (JavaScript XML):** A syntax extension allowing you to write HTML-like structures inside JavaScript.
2. **Component Structure:** Reusable, self-contained blocks of UI logic.
3. **Props Pipeline:** Passing immutable data from parent components down to child elements.

\`\`\`jsx
function WelcomeCard({ name, role }) {
  return (
    <div className="p-4 border rounded-lg bg-slate-900 text-slate-100">
      <h2 className="text-xl font-bold">Hello, {name}!</h2>
      <p className="text-sm text-slate-400">Role: {role}</p>
    </div>
  );
}
\`\`\`

### Summary Checklist:
- Components must return a single root element or Fragment.
- Always use camelCase for JSX attributes (e.g. \`className\`, \`onClick\`).`,
    },
    {
      order: 2,
      title: "Lesson 2: State Management & Event Handling",
      content: `## Lesson 2: State Management & Interactive Events

Learn how to create interactive components that respond to user input and maintain internal state over time.

### Core Concepts:
1. **State:** Private, mutable data stored within a component instance.
2. **State Updates:** React re-renders components whenever state updates via setter functions.
3. **Event Listeners:** Binding click, change, and submit handlers.

\`\`\`jsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button 
      onClick={() => setCount(count + 1)}
      className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg"
    >
      Clicked {count} times
    </button>
  );
}
\`\`\`

### Pro-Tips:
- Never mutate state directly; always use the setter function (\`setCount\`).
- Functional updates (\`setCount(prev => prev + 1)\`) prevent race conditions in fast updates.`,
    },
    {
      order: 3,
      title: "Lesson 3: Server Communications & Data Fetching",
      content: `## Lesson 3: Server Communications & Data Fetching

Discover how web applications communicate with backend cloud databases and external APIs.

### Learning Goals:
1. **Asynchronous Requests:** Fetching JSON endpoints using \`async/await\`.
2. **Loading States:** Rendering loading spinners while data is in-flight.
3. **Error Boundaries:** Gracefully handling network timeouts and 404/500 errors.

\`\`\`javascript
async function fetchCourseDetails(courseId) {
  const res = await fetch(\`/api/courses/\${courseId}\`);
  if (!res.ok) {
    throw new Error("Failed to fetch course data");
  }
  return await res.json();
}
\`\`\`

### Key Takeaways:
- Always handle error cases gracefully so the user is never left on a blank screen.`,
    },
    {
      order: 4,
      title: "Lesson 4: Production Deployment & Optimization",
      content: `## Lesson 4: Production Deployment & Optimization

Finalize your application for deployment to production edge networks like Vercel.

### Checklist for Launch:
1. **Environment Variables:** Secure database credentials and API keys in \`.env\`.
2. **Build Verification:** Run production compiler checks to catch type errors.
3. **Global CDN Distribution:** Deploying static assets close to end-users worldwide.

Congratulations on completing the curriculum modules!`,
    },
  ];

  let totalLessonsSeeded = 0;

  for (const course of courses) {
    console.log(`\n📚 Seeding lessons for course: "${course.title}" (${course.id})...`);

    for (const template of lessonTemplates) {
      // Upsert lesson to avoid duplicate entries
      const existingLesson = await prisma.lesson.findFirst({
        where: {
          courseId: course.id,
          order: template.order,
        },
      });

      if (existingLesson) {
        await prisma.lesson.update({
          where: { id: existingLesson.id },
          data: {
            title: template.title,
            content: template.content,
          },
        });
        console.log(`   ✓ Updated Lesson ${template.order}: "${template.title}"`);
      } else {
        await prisma.lesson.create({
          data: {
            courseId: course.id,
            order: template.order,
            title: template.title,
            content: template.content,
          },
        });
        console.log(`   + Created Lesson ${template.order}: "${template.title}"`);
      }
      totalLessonsSeeded++;
    }
  }

  console.log(`\n✅ Seeding Complete! Seeded ${totalLessonsSeeded} relational lessons across ${courses.length} courses in Supabase PostgreSQL.`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding lessons:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
