import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function seedStudentsWithCourses() {
  console.log("🌱 Assigning CS degree courses and AI quiz attempts to all 8 students...");

  // 1. Define custom CS degree course tracks for each student
  const studentTrackAssignments = [
    {
      name: "rehmoz ahmad rana",
      handle: "rehmoz.rana",
      courseTitles: [
        "Data Structures & Algorithms (DSA)",
        "Object-Oriented Programming (OOP)",
        "Database Systems & SQL Engineering",
        "Modern Web Programming (Full-Stack Next.js & React)",
      ],
    },
    {
      name: "nirmal msukan",
      handle: "nirmal.muskan",
      courseTitles: [
        "Artificial Intelligence & Machine Learning",
        "Data Structures & Algorithms (DSA)",
        "Programming Fundamentals",
        "Modern Web Programming (Full-Stack Next.js & React)",
      ],
    },
    {
      name: "afnan ahmad",
      handle: "afnan.ahmad",
      courseTitles: [
        "Cybersecurity & Ethical Hacking",
        "Computer Networks & Distributed Systems",
        "Operating Systems & System Architecture",
        "Programming Fundamentals",
      ],
    },
    {
      name: "rana nadeem",
      handle: "rana.nadeem",
      courseTitles: [
        "Computer Architecture & Assembly Language",
        "Theory of Computation & Automata",
        "Object-Oriented Programming (OOP)",
        "Database Systems & SQL Engineering",
      ],
    },
    {
      name: "abdullah farooq",
      handle: "abdullah.farooq",
      courseTitles: [
        "Software Engineering & Agile Methodologies",
        "Modern Web Programming (Full-Stack Next.js & React)",
        "Database Systems & SQL Engineering",
        "Artificial Intelligence & Machine Learning",
      ],
    },
    {
      name: "Faisal Friend",
      handle: "faisal.friend",
      courseTitles: [
        "Computer Networks & Distributed Systems",
        "Cybersecurity & Ethical Hacking",
        "Programming Fundamentals",
        "Data Structures & Algorithms (DSA)",
      ],
    },
    {
      name: "maaz potato",
      handle: "maaz.potato",
      courseTitles: [
        "Programming Fundamentals",
        "Object-Oriented Programming (OOP)",
        "Modern Web Programming (Full-Stack Next.js & React)",
        "Data Structures & Algorithms (DSA)",
      ],
    },
    {
      name: "ali khan",
      handle: "ali.khan",
      courseTitles: [
        "Theory of Computation & Automata",
        "Operating Systems & System Architecture",
        "Computer Architecture & Assembly Language",
        "Software Engineering & Agile Methodologies",
      ],
    },
  ];

  // Fetch all courses with lessons
  const allCourses = await prisma.course.findMany({
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });

  for (const sData of studentTrackAssignments) {
    const handlePrefix = sData.handle.split(".")[0];

    const emailsToAssign = [
      `${sData.handle}+clerk_test@example.com`,
      `${handlePrefix}+clerk_test@example.com`,
      `${sData.handle}@example.com`,
      `${sData.handle}@gmail.com`,
      `${sData.handle}@courseforge.com`,
    ];

    console.log(`\n🎓 Student: ${sData.name.toUpperCase()}`);

    for (const email of emailsToAssign) {
      const fakeClerkId = `user_${email.replace(/[^a-zA-Z0-9]/g, "_")}`;

      const user = await prisma.user.upsert({
        where: { email },
        update: { role: "STUDENT" },
        create: {
          clerkId: fakeClerkId,
          email,
          role: "STUDENT",
        },
      });

      // Find matching courses for this student's assigned titles
      const matchedCourses = allCourses.filter((c) =>
        sData.courseTitles.includes(c.title)
      );

      for (const course of matchedCourses) {
        // 1. Create Enrollment
        await prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: course.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            courseId: course.id,
          },
        });

        // 2. Create sample AI Quiz Attempts for first 2 lessons of each assigned course
        if (course.lessons.length > 0) {
          for (const lesson of course.lessons.slice(0, 2)) {
            const existingAttempt = await prisma.quizAttempt.findFirst({
              where: {
                userId: user.id,
                lessonId: lesson.id,
              },
            });

            if (!existingAttempt) {
              await prisma.quizAttempt.create({
                data: {
                  userId: user.id,
                  lessonId: lesson.id,
                  score: 5,
                  total: 5,
                },
              });
            }
          }
        }
      }

      console.log(`   └─ Enrolled ${email} in ${matchedCourses.length} CS course tracks`);
    }
  }

  console.log("\n🎉 All 8 students have been successfully assigned personalized CS degree course tracks!");
}

seedStudentsWithCourses()
  .catch((e) => {
    console.error("❌ Error assigning courses to students:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
