"use server";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { syncUserWithDatabase } from "@/lib/user-sync";

export async function setUserRoleAction(role: "STUDENT" | "INSTRUCTOR" | "ADMIN") {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const userId = clerkUser.id;
  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`;

  // 1. Safely sync user in database
  const dbUser = await syncUserWithDatabase();

  // 2. Strict Role Protection Matrix:
  // If user is a STUDENT in database, prevent elevating to INSTRUCTOR/ADMIN under a Student account
  if (dbUser?.role === "STUDENT" && role !== "STUDENT") {
    redirect(`/sign-in?redirect_url=/dashboard/${role.toLowerCase()}`);
  }

  // Only update database role if user was unassigned or ADMIN super-user
  if (dbUser && dbUser.role !== role && dbUser.role !== "STUDENT") {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { role },
    });
  }

  // 3. Sync role to Clerk public metadata
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
    },
  });

  // 4. Revalidate cache
  revalidatePath("/", "layout");
  revalidatePath("/select-role");

  // 5. Redirect to destination dashboard
  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } else if (role === "INSTRUCTOR") {
    redirect("/dashboard/instructor");
  } else {
    redirect("/dashboard/student");
  }
}
