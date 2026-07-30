import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function updateInstructorName() {
  console.log("🔄 Updating instructor records to 'Muhammad Abdullah'...");

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { role: "INSTRUCTOR" },
        { email: { startsWith: "instructor_" } },
      ],
    },
  });

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const newEmail = i === 0 
      ? "muhammad.abdullah@courseforge.com" 
      : `muhammad.abdullah.${i + 1}@courseforge.com`;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: newEmail,
      },
    });

    console.log(`✅ Updated User ID ${user.id} -> ${newEmail}`);
  }

  console.log("🎉 Instructor accounts successfully updated to Muhammad Abdullah!");
}

updateInstructorName()
  .catch((e) => {
    console.error("❌ Error updating instructor name:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
