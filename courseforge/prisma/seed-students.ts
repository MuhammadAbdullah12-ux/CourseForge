import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function seedStudents() {
  console.log("🌱 Seeding requested students into Supabase cloud database...");

  const baseStudents = [
    { name: "rehmoz ahmad rana", handle: "rehmoz.rana" },
    { name: "nirmal msukan", handle: "nirmal.muskan" },
    { name: "afnan ahmad", handle: "afnan.ahmad" },
    { name: "rana nadeem", handle: "rana.nadeem" },
    { name: "abdullah farooq", handle: "abdullah.farooq" },
    { name: "Faisal Friend", handle: "faisal.friend" },
    { name: "maaz potato", handle: "maaz.potato" },
    { name: "ali khan", handle: "ali.khan" },
  ];

  const courses = await prisma.course.findMany();

  for (const student of baseStudents) {
    const emails = [
      `${student.handle}+clerk_test@example.com`,
      `${student.handle.split('.')[0]}+clerk_test@example.com`,
      `${student.handle}@example.com`,
      `${student.handle}@gmail.com`,
      `${student.handle}@courseforge.com`,
    ];

    for (const email of emails) {
      const fakeClerkId = `user_${email.replace(/[^a-zA-Z0-9]/g, "_")}`;

      const createdUser = await prisma.user.upsert({
        where: { email },
        update: {
          role: "STUDENT",
        },
        create: {
          clerkId: fakeClerkId,
          email,
          role: "STUDENT",
        },
      });

      console.log(`✅ Seeded student: ${student.name} (${email})`);

      if (courses.length > 0) {
        for (const course of courses.slice(0, 2)) {
          await prisma.enrollment.upsert({
            where: {
              userId_courseId: {
                userId: createdUser.id,
                courseId: course.id,
              },
            },
            update: {},
            create: {
              userId: createdUser.id,
              courseId: course.id,
            },
          });
        }
      }
    }
  }

  console.log("🎉 All 8 student +clerk_test variants seeded & enrolled successfully!");
}

seedStudents()
  .catch((e) => {
    console.error("❌ Error seeding students:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
