import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Declare global object cache to hold Prisma Client and pg.Pool between HMR reloads
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

const connectionString = process.env.DATABASE_URL!;

// Reuse global pg.Pool instance and configure strict pool size for serverless environments
const pool =
  globalForPrisma.pool ??
  new pg.Pool({
    connectionString,
    max: process.env.NODE_ENV === "production" ? 3 : 5, // Strict limit to prevent EMAXCONNSESSION on Supabase
    idleTimeoutMillis: 5000, // Close idle connections quickly
    connectionTimeoutMillis: 5000, // Timeout fast if pool is busy
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
  globalForPrisma.prisma = prisma;
}
