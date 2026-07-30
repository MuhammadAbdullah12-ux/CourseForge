"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function setUserRoleAction(role: "STUDENT" | "INSTRUCTOR" | "ADMIN") {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 1. Fetch user from Clerk SDK to get primary email
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);

  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`;

  // 2. Upsert user in Supabase PostgreSQL database via Prisma
  await prisma.user.upsert({
    where: { clerkId: userId },
    update: { role },
    create: {
      clerkId: userId,
      email: primaryEmail,
      role,
    },
  });

  // 3. Sync role to Clerk public metadata
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
    },
  });

  // 4. Revalidate root layout cache so Navbar updates instantly
  revalidatePath("/", "layout");
  revalidatePath("/select-role");

  // 5. Redirect based on chosen role
  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } else if (role === "INSTRUCTOR") {
    redirect("/dashboard/instructor");
  } else {
    redirect("/dashboard/student");
  }
}
