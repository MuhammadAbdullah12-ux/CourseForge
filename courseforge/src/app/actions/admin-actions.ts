"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper function to verify caller is an ADMIN
async function verifyAdminRole() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { isAuthorized: false, currentUserId: null, error: "Unauthorized access." };
  }

  let role: string | undefined = undefined;
  if (sessionClaims && typeof sessionClaims === "object") {
    const metadata = (sessionClaims as Record<string, any>).metadata;
    if (metadata && typeof metadata === "object") {
      role = metadata.role;
    }
  }

  // Fallback database lookup if Clerk session claims metadata is pending
  if (role !== "ADMIN") {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });
    role = dbUser?.role;
  }

  if (role !== "ADMIN") {
    return { isAuthorized: false, currentUserId: userId, error: "Forbidden: Admin privileges required." };
  }

  return { isAuthorized: true, currentUserId: userId, error: null };
}

// 1. Fetch Executive Platform Telemetry & Data Lists
export async function getAdminDashboardDataAction() {
  const authCheck = await verifyAdminRole();
  if (!authCheck.isAuthorized) {
    return {
      success: false,
      error: authCheck.error,
      telemetry: null,
      users: [],
      courses: [],
      activityLogs: [],
    };
  }

  try {
    // Platform Telemetry
    const [
      totalUsers,
      studentCount,
      instructorCount,
      adminCount,
      totalCourses,
      publishedCoursesCount,
      totalEnrollments,
      totalQuizAttempts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "INSTRUCTOR" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.course.count(),
      prisma.course.count({ where: { published: true } }),
      prisma.enrollment.count(),
      prisma.quizAttempt.count(),
    ]);

    // Users List
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            courses: true,
            enrollments: true,
            quizAttempts: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Courses List
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: {
            email: true,
            clerkId: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Simulated Recent Activity Stream
    const activityLogs = [
      { id: "1", type: "USER_REGISTER", message: `Total active platform accounts: ${totalUsers}`, timestamp: "Just now" },
      { id: "2", type: "COURSE_PUBLISH", message: `Published courses count: ${publishedCoursesCount} of ${totalCourses}`, timestamp: "5 mins ago" },
      { id: "3", type: "QUIZ_ATTEMPT", message: `Total student quiz evaluations executed: ${totalQuizAttempts}`, timestamp: "12 mins ago" },
      { id: "4", type: "ENROLLMENT", message: `Total student enrollments recorded: ${totalEnrollments}`, timestamp: "1 hr ago" },
    ];

    return {
      success: true,
      error: null,
      telemetry: {
        totalUsers,
        studentCount,
        instructorCount,
        adminCount,
        totalCourses,
        publishedCoursesCount,
        totalEnrollments,
        totalQuizAttempts,
      },
      users,
      courses,
      activityLogs,
    };
  } catch (error) {
    console.error("Error in getAdminDashboardDataAction:", error);
    return {
      success: false,
      error: "Failed to load admin telemetry data.",
      telemetry: null,
      users: [],
      courses: [],
      activityLogs: [],
    };
  }
}

// 2. Admin User Role Switcher (Student / Instructor / Admin)
export async function updateUserRoleAdminAction(targetUserId: string, newRole: "STUDENT" | "INSTRUCTOR" | "ADMIN") {
  const authCheck = await verifyAdminRole();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  try {
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return { success: false, error: "Target user not found." };
    }

    // Update database role
    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    // Sync role to Clerk public metadata
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(targetUser.clerkId, {
        publicMetadata: {
          role: newRole,
        },
      });
    } catch (clerkErr) {
      console.warn("Clerk metadata sync warning:", clerkErr);
    }

    revalidatePath("/dashboard/admin");
    return { success: true, message: `Successfully updated ${targetUser.email} role to ${newRole}.` };
  } catch (error) {
    console.error("Error in updateUserRoleAdminAction:", error);
    return { success: false, error: "Failed to update user role." };
  }
}

// 3. Admin Delete User
export async function deleteUserAdminAction(targetUserId: string) {
  const authCheck = await verifyAdminRole();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  try {
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return { success: false, error: "Target user not found." };
    }

    // Prevent Admin from deleting their own account
    if (targetUser.clerkId === authCheck.currentUserId) {
      return { success: false, error: "Safety Guard: You cannot delete your own active Admin account." };
    }

    // Delete user from database
    await prisma.user.delete({
      where: { id: targetUserId },
    });

    revalidatePath("/dashboard/admin");
    return { success: true, message: `User ${targetUser.email} removed from platform.` };
  } catch (error) {
    console.error("Error in deleteUserAdminAction:", error);
    return { success: false, error: "Failed to delete user." };
  }
}

// 4. Admin Toggle Course Published Status
export async function toggleCoursePublishedAdminAction(courseId: string) {
  const authCheck = await verifyAdminRole();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { published: true, title: true },
    });

    if (!course) {
      return { success: false, error: "Course not found." };
    }

    await prisma.course.update({
      where: { id: courseId },
      data: { published: !course.published },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/courses");
    return {
      success: true,
      message: `Course "${course.title}" status set to ${!course.published ? "Published" : "Draft"}.`,
    };
  } catch (error) {
    console.error("Error in toggleCoursePublishedAdminAction:", error);
    return { success: false, error: "Failed to toggle course status." };
  }
}

// 5. Admin Delete Course
export async function deleteCourseAdminAction(courseId: string) {
  const authCheck = await verifyAdminRole();
  if (!authCheck.isAuthorized) {
    return { success: false, error: authCheck.error };
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true },
    });

    if (!course) {
      return { success: false, error: "Course not found." };
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/courses");
    return { success: true, message: `Course "${course.title}" permanently removed.` };
  } catch (error) {
    console.error("Error in deleteCourseAdminAction:", error);
    return { success: false, error: "Failed to delete course." };
  }
}
