import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function seedStudents() {
  console.log("🌱 Seeding requested students into Supabase cloud database...");

  const studentsToCreate = [
    { name: "rehmoz ahmad rana", email: "rehmoz.rana@courseforge.com" },
    { name: "nirmal msukan", email: "nirmal.muskan@courseforge.com" },
    { name: "afnan ahmad", email: "afnan.ahmad@courseforge.com" },
    { name: "rana nadeem", email: "rana.nadeem@courseforge.com" },
    { name: "abdullah farooq", email: "abdullah.farooq@courseforge.com" },
    { name: "Faisal Friend", email: "faisal.friend@courseforge.com" },
    { name: "maaz potato", email: "maaz.potato@courseforge.com" },
    { name: "ali khan", email: "ali.khan@courseforge.com" },
  ];

  // Fetch courses to enroll students in
  const courses = await prisma.course.findMany();

  for (const student of studentsToCreate) {
    const fakeClerkId = `user_${student.email.replace(/[^a-zA-Z0-9]/g, "_")}`;

    // Upsert student into Supabase PostgreSQL
    const createdUser = await prisma.user.upsert({
      where: { email: student.email },
      update: {
        role: "STUDENT",
      },
      create: {
        clerkId: fakeClerkId,
        email: student.email,
        role: "STUDENT",
      },
    });

    console.log(`✅ Created student: ${student.name} (${student.email})`);

    // Enroll student into courses if courses exist
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

  console.log("🎉 All 8 students seeded & enrolled successfully!");
}

seedStudents()
  .catch((e) => {
    console.error("❌ Error seeding students:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
