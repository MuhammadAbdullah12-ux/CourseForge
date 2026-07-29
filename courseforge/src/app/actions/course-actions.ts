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
  revalidatePath("/courses");
  revalidatePath("/dashboard/instructor");

  // 6. Redirect back to the Instructor Dashboard
  redirect("/dashboard/instructor");
}
