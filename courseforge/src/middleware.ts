import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which route segments are publicly accessible without signing in
const isPublicRoute = createRouteMatcher([
  '/',                     // Home page
  '/about',                // About page
  '/courses(.*)',          // Courses catalog and dynamic detail subroutes
  '/sign-in(.*)',          // Sign-in screens
  '/sign-up(.*)',          // Sign-up screens
  '/select-role(.*)',      // Role selection onboarding page
]);

export default clerkMiddleware(async (auth, request) => {
  // Protect private non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
