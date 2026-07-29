"use server";

import { auth, createClerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function setUserRoleAction(role: "STUDENT" | "INSTRUCTOR") {
  // 1. Authenticate the user
  const { userId, sessionClaims } = await auth();

  // If user is not logged in yet as a guest visitor
  if (!userId) {
    if (role === "INSTRUCTOR") {
      redirect("/sign-in");
    } else {
      redirect("/courses");
    }
  }

  // 2. Update Public Metadata in Clerk if secret key exists
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  if (clerkSecretKey) {
    try {
      const clerkClient = createClerkClient({ secretKey: clerkSecretKey });
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          role: role,
        },
      });
    } catch (error) {
      console.error("Error updating Clerk user metadata:", error);
    }
  }

  // 3. Upsert User record in Supabase PostgreSQL
  const userEmail =
    (sessionClaims?.email as string) ||
    `user_${userId.slice(-6)}@courseforge.com`;

  await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      role: role,
    },
    create: {
      clerkId: userId,
      email: userEmail,
      role: role,
    },
  });

  // 4. Invalidate caches across the platform
  revalidatePath("/", "layout");
  revalidatePath("/courses", "layout");
  revalidatePath("/dashboard/instructor", "layout");

  // 5. Redirect user according to selected role
  if (role === "INSTRUCTOR") {
    redirect("/dashboard/instructor");
  } else {
    redirect("/courses");
  }
}
