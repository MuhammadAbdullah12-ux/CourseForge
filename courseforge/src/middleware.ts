import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define which route segments are publicly accessible without signing in
const isPublicRoute = createRouteMatcher([
  '/',                     // Home page
  '/about',                // About page
  '/courses(.*)',          // Courses catalog and dynamic detail subroutes
  '/sign-in(.*)',          // Sign-in screens
  '/sign-up(.*)',          // Sign-up screens
  '/select-role(.*)',      // Role selection onboarding page
]);

// 2. Define routes reserved strictly for INSTRUCTOR users
const isInstructorRoute = createRouteMatcher([
  '/dashboard/instructor(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // A. Enforce Role-Based Access Control (RBAC) on instructor routes
  if (isInstructorRoute(request)) {
    const { userId, sessionClaims } = await auth();

    // If the user is not logged in, enforce sign-in redirect
    if (!userId) {
      await auth.protect();
      return;
    }

    // Extract custom role claim from session token
    const userRole = sessionClaims?.metadata?.role;

    // If logged-in user is NOT an INSTRUCTOR (e.g. STUDENT), redirect to role selection or courses
    if (userRole !== "INSTRUCTOR") {
      const catalogUrl = new URL("/courses", request.url);
      return Response.redirect(catalogUrl);
    }
  }

  // B. Protect any other private non-public routes
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
