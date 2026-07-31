import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Safely resolves or provisions a user in Supabase PostgreSQL by clerkId OR email.
 * Intelligently merges duplicate seeded records and updates roles dynamically.
 */
export async function syncUserWithDatabase(requestedRole?: "STUDENT" | "INSTRUCTOR" | "ADMIN") {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const userId = clerkUser.id;
  const primaryEmail = (clerkUser.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`).toLowerCase();

  // Helper to determine if email belongs to an instructor or admin
  const isDevAdmin = primaryEmail.includes("abdullah") || primaryEmail.includes("ranaabdullah");
  const isSeededInstructor =
    primaryEmail.includes("sarah") ||
    primaryEmail.includes("alex") ||
    primaryEmail.includes("marcus") ||
    primaryEmail.includes("elena") ||
    primaryEmail.includes("david") ||
    primaryEmail.includes("instructor");

  let targetRole: "STUDENT" | "INSTRUCTOR" | "ADMIN" = "STUDENT";
  if (isDevAdmin) {
    targetRole = "ADMIN";
  } else if (requestedRole) {
    targetRole = requestedRole;
  } else if (isSeededInstructor) {
    targetRole = "INSTRUCTOR";
  }

  // 1. Check for existing row by exact clerkId
  const userByClerkId = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // 2. Check for existing row by exact email
  const userByEmail = await prisma.user.findUnique({
    where: { email: primaryEmail },
  });

  // Case A: Both exist on DIFFERENT rows (e.g. placeholder clerkId row + seeded email row)
  if (userByClerkId && userByEmail && userByClerkId.id !== userByEmail.id) {
    try {
      await prisma.enrollment.updateMany({
        where: { userId: userByClerkId.id },
        data: { userId: userByEmail.id },
      }).catch(() => {});

      await prisma.quizAttempt.updateMany({
        where: { userId: userByClerkId.id },
        data: { userId: userByEmail.id },
      }).catch(() => {});

      await prisma.user.delete({
        where: { id: userByClerkId.id },
      }).catch(() => {});

      return await prisma.user.update({
        where: { id: userByEmail.id },
        data: {
          clerkId: userId,
          role: targetRole !== "STUDENT" ? targetRole : userByEmail.role,
        },
      });
    } catch (e) {
      return userByEmail;
    }
  }

  // Case B: Row exists by clerkId
  if (userByClerkId) {
    const needRoleUpdate = targetRole !== "STUDENT" && userByClerkId.role !== targetRole && userByClerkId.role !== "ADMIN";
    const needEmailUpdate = userByClerkId.email !== primaryEmail;

    if (needRoleUpdate || needEmailUpdate) {
      try {
        return await prisma.user.update({
          where: { id: userByClerkId.id },
          data: {
            email: primaryEmail,
            role: needRoleUpdate ? targetRole : userByClerkId.role,
          },
        });
      } catch (e) {
        return userByClerkId;
      }
    }
    return userByClerkId;
  }

  // Case C: Row exists by email
  if (userByEmail) {
    const needRoleUpdate = targetRole !== "STUDENT" && userByEmail.role !== targetRole && userByEmail.role !== "ADMIN";
    try {
      return await prisma.user.update({
        where: { id: userByEmail.id },
        data: {
          clerkId: userId,
          role: needRoleUpdate ? targetRole : userByEmail.role,
        },
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
        role: targetRole,
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
