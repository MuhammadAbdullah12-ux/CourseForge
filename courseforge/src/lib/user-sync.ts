import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Safely resolves or provisions a user in Supabase PostgreSQL by clerkId OR email.
 * Intelligently merges duplicate seeded records and prevents clerkId unique constraint crashes.
 */
export async function syncUserWithDatabase(defaultRole: "STUDENT" | "INSTRUCTOR" | "ADMIN" = "STUDENT") {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const userId = clerkUser.id;
  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`;

  // 1. Check for existing row by exact clerkId
  const userByClerkId = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // 2. Check for existing row by exact email
  const userByEmail = await prisma.user.findUnique({
    where: { email: primaryEmail },
  });

  // Case A: Both exist on DIFFERENT rows (e.g. a placeholder clerkId row + a seeded email row)
  if (userByClerkId && userByEmail && userByClerkId.id !== userByEmail.id) {
    try {
      // Re-assign enrollments & quizAttempts to the primary email row before deleting the duplicate
      await prisma.enrollment.updateMany({
        where: { userId: userByClerkId.id },
        data: { userId: userByEmail.id },
      }).catch(() => {});

      await prisma.quizAttempt.updateMany({
        where: { userId: userByClerkId.id },
        data: { userId: userByEmail.id },
      }).catch(() => {});

      // Remove stale placeholder row to free up the clerkId constraint
      await prisma.user.delete({
        where: { id: userByClerkId.id },
      }).catch(() => {});

      // Link actual Clerk userId to the seeded student email row
      return await prisma.user.update({
        where: { id: userByEmail.id },
        data: { clerkId: userId },
      });
    } catch (e) {
      return userByEmail;
    }
  }

  // Case B: Row exists by clerkId
  if (userByClerkId) {
    if (userByClerkId.email !== primaryEmail) {
      try {
        return await prisma.user.update({
          where: { id: userByClerkId.id },
          data: { email: primaryEmail },
        });
      } catch (e) {
        return userByClerkId;
      }
    }
    return userByClerkId;
  }

  // Case C: Row exists by email (e.g. seeded student)
  if (userByEmail) {
    try {
      return await prisma.user.update({
        where: { id: userByEmail.id },
        data: { clerkId: userId },
      });
    } catch (e) {
      return userByEmail;
    }
  }

  // Case D: Completely new user signup
  try {
    return await prisma.user.create({
      data: {
        clerkId: userId,
        email: primaryEmail,
        role: defaultRole,
      },
    });
  } catch (err) {
    return await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          { email: primaryEmail },
        ],
      },
    });
  }
}
