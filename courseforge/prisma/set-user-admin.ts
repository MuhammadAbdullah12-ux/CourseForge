import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function setAdminRole() {
  console.log("👑 Updating account to ADMIN role...");

  const result = await prisma.user.updateMany({
    where: {
      OR: [
        { email: { contains: "ranaabdullah" } },
        { email: { contains: "muhammad.abdullah" } },
      ],
    },
    data: {
      role: "ADMIN",
    },
  });

  console.log(`✅ Successfully updated ${result.count} account(s) to ADMIN role!`);
}

setAdminRole()
  .catch((e) => {
    console.error("❌ Error setting Admin role:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
