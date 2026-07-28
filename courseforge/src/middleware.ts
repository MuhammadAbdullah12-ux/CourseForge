import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define which route segments are publicly accessible without signing in
const isPublicRoute = createRouteMatcher([
  '/',                     // Home page
  '/about',                // About page
  '/courses(.*)',          // Courses catalog and dynamic detail subroutes
  '/sign-in(.*)',          // Sign-in screens
  '/sign-up(.*)',          // Sign-up screens
]);

export default clerkMiddleware(async (auth, request) => {
  // 2. Protect any routes that are NOT explicitly listed as public
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internal files and static assets (images, css, favicon)
    '/((?!_next|[^?]*\\.[\\w]+$|_next/image|_next/static|favicon.ico|sitemap.xml|robots.txt).*)',
    // Always run authentication middleware checks for API and dynamic queries
    '/(api|trpc)(.*)',
  ],
};
