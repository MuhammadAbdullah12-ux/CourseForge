# CourseForge — Week 1 Learning & Reflection Summary

This document summarizes the core architectural concepts learned during Week 1 while building the initial CourseForge frontend skeleton.

---

## 1. Server Components vs. Client Components

### Server Components (Default in Next.js App Router)
*   **What they are:** Components that run *only* on the web server. They are compiled into flat, static HTML page segments before being sent to the browser.
*   **When to use them:** For rendering pages that display static information, fetching data directly from database tables, or layouts that do not require user interaction.
*   **Limitations:** They cannot use React state hooks (like `useState`, `useEffect`) or listen for browser events (like `onClick`).
*   **Why they matter:** They ship **zero JavaScript** to the browser, making page loads extremely fast and providing search engines with fully rendered content for SEO.

### Client Components (marked with `"use client"`)
*   **What they are:** Components sent to the browser along with their JavaScript code. The browser runs this JavaScript to make the page interactive.
*   **When to use them:** For components requiring user interactivity (buttons, form inputs, toggling menus, client-side animation triggers) or using React lifecycle hooks.
*   **Why they matter:** They enable rich, desktop-app-like client interactions inside the browser by binding event listeners to the Document Object Model (DOM).

---

## 2. Next.js App Router File-Based Routing

*   **Folder Structure as Routes:** In Next.js, folders define URLs. Creating a folder named `app/about` containing a file named `page.tsx` automatically creates the route `http://localhost:3000/about`.
*   **Dynamic Routes (`[courseId]`):** Folder names wrapped in square brackets act as route variables. Next.js parses the URL path segment (e.g. `/courses/course-react-101`) and passes the value `course-react-101` to the page component as a `params` Promise.
*   **Shared Layouts (`layout.tsx`):** Layout files wrap leaf page files within the directory segment. On page transitions, parent layouts persist their DOM structures and local state variables, rendering *only* the leaf pages dynamically.

---

## 3. How shadcn/ui Differs from Normal Component Libraries

*   **Traditional Component Libraries (like Material UI or Chakra):** 
    *   They are installed as compiled npm dependencies inside the `node_modules` folder. 
    *   They are a "black box" where you cannot edit the internal TSX code directly and must use complex override APIs to customize default styles.
*   **shadcn/ui Pattern:**
    *   It is **not** an npm package dependency.
    *   It is a code generation command-line tool. It downloads the raw source code of the component (e.g. `button.tsx`) and writes it directly into your own folder (`/src/components/ui/`).
    *   Since the code lives in your folder, it is **100% yours to edit**. You can modify default Tailwind classes, add new variant structures in CVA, and update the layout logic directly in code.
