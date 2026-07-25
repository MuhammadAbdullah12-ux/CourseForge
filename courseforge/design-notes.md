# Design Notes — Public Landing Page (/)

## Page Concept
A clean, premium, high-converting landing page for CourseForge. It is designed to introduce the platform's core value proposition (AI-assisted learning) and immediately direct users into the course catalog.

## Visual Hierarchy & Layout Spec

### 1. Hero Section
*   **Structure:** Single-column layout, centered text.
*   **Top Margin:** Large vertical padding (`py-20` or `py-32`) to draw focus immediately to the center.
*   **Headline:** Massive heading (`text-5xl` or `text-6xl`, font-extrabold) with a gradient text effect highlighting "AI-Powered".
*   **Sub-headline:** Readable slate text (`text-slate-400 text-lg`, max-width of `max-w-2xl` to prevent long line lengths).
*   **Call-to-Action (CTA):** A prominent button using our custom `brand` emerald variant that links dynamically to the `/courses` catalog page.

### 2. Feature Section (3-Card Grid)
*   **Structure:** Responsive grid layout (`grid grid-cols-1 md:grid-cols-3 gap-6`). It displays as a single vertical column on mobile screens and expands to a 3-column row on tablets/desktops.
*   **Cards:** Uses shadcn's `<Card>` element.
    *   **Card 1 (AI Tutor):** Icon + Title: "Lesson-Scoped AI Tutor". Description: "A private tutor that understands the context of the lesson you are reading."
    *   **Card 2 (Interactive Outlines):** Icon + Title: "AI Outline Drafting". Description: "Instructors type a topic, and our model drafts a complete course structure instantly."
    *   **Card 3 (Automated Quizzes):** Icon + Title: "Dynamic Quizzes". Description: "Test your knowledge with quizzes generated directly from the content you read."
*   **Card Styles:** Dark slate border (`border-slate-800`), translucent background (`bg-slate-900/40`), and emerald accents for titles.

## Responsive Targets
*   **Mobile (<768px):** Centered columns, stacked cards, smaller headline sizes (`text-4xl`).
*   **Desktop (>1024px):** Row-based grid elements, spacious margins (`max-w-5xl` container).
