"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCourseAction(formData: FormData) {
  // 1. Extract fields from the submitted FormData
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  // Basic validation checks
  if (!title || title.trim().length === 0) {
    throw new Error("Course title is required.");
  }

  if (!description || description.trim().length === 0) {
    throw new Error("Course description is required.");
  }

  // 2. Verify server-side authentication & instructor role
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: You must be logged in to create a course.");
  }

  const userRole = sessionClaims?.metadata?.role;
  if (userRole !== "INSTRUCTOR") {
    throw new Error("Unauthorized: Only authorized instructors can create courses.");
  }

  // 3. Ensure the User record exists in Supabase
  let instructorUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!instructorUser) {
    // Upsert the user into Supabase if missing from relational User table
    instructorUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        role: "INSTRUCTOR",
      },
      create: {
        clerkId: userId,
        email: `instructor_${userId.slice(-6)}@courseforge.com`,
        role: "INSTRUCTOR",
      },
    });
  }

  // 4. Create the new Course row in Supabase cloud PostgreSQL
  await prisma.course.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      published: true,
      instructorId: instructorUser.id,
    },
  });

  // 5. Purge Next.js static/dynamic route cache so new courses appear live immediately
  revalidatePath("/courses", "layout");
  revalidatePath("/dashboard/instructor", "layout");

  // 6. Redirect back to the Instructor Dashboard
  redirect("/dashboard/instructor");
}

/**
 * Server Action for Student Course Enrollment (Using direct courseId parameter via .bind())
 */
export async function enrollInCourseAction(courseId: string) {
  if (!courseId) {
    throw new Error("Course ID is required for enrollment.");
  }

  // 1. Authenticate the student user
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Extract user role from claims if available
  const userRole = (sessionClaims?.metadata?.role as "INSTRUCTOR" | "STUDENT") || "STUDENT";

  try {
    // 2. Ensure User record exists in Supabase PostgreSQL
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      dbUser = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
          clerkId: userId,
          email: `user_${userId.slice(-6)}@courseforge.com`,
          role: userRole,
        },
      });
    }

    // 3. Create or update enrollment row in Supabase using idempotent upsert
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: dbUser.id,
          courseId: courseId,
        },
      },
      update: {},
      create: {
        userId: dbUser.id,
        courseId: courseId,
      },
    });

    // 4. Purge stale route caches across layouts & dynamic pages on Vercel
    revalidatePath("/courses", "layout");
    revalidatePath(`/courses/${courseId}`, "page");
    revalidatePath("/dashboard/student", "layout");
  } catch (error) {
    console.error("Error executing enrollInCourseAction:", error);
  }

  // 5. Redirect back to the course details page with ?enrolled=true to force client router cache refresh
  redirect(`/courses/${courseId}?enrolled=true`);
}

/**
 * Server Action for Student Course Unenrollment
 */
export async function unenrollFromCourseAction(courseId: string) {
  if (!courseId) {
    throw new Error("Course ID is required for unenrollment.");
  }

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (dbUser) {
      await prisma.enrollment.deleteMany({
        where: {
          userId: dbUser.id,
          courseId: courseId,
        },
      });
    }

    revalidatePath("/courses", "layout");
    revalidatePath(`/courses/${courseId}`, "page");
    revalidatePath("/dashboard/student", "layout");
  } catch (error) {
    console.error("Error executing unenrollFromCourseAction:", error);
  }

  redirect(`/dashboard/student?unenrolled=true`);
}
