import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. Declare a global object cache to hold our Prisma Client instance between HMR reloads
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 2. Resolve our connection string from the environment variables
const connectionString = process.env.DATABASE_URL!;

// 3. Initialize the pg connection pool and pass it to the Prisma v7 PostgreSQL adapter
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 4. Instantiated Prisma Client, reusing the global reference if it exists to preserve connection slots
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
