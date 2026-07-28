// Load the environment database connection strings
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Initialize the Prisma Client adapter for PostgreSQL in Prisma v7
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting automated database seeding...');

  // 1. Create or update the Instructor User
  const instructor = await prisma.user.upsert({
    where: { clerkId: 'clerk_mock_123' },
    update: {},
    create: {
      id: 'user-instructor-1',
      clerkId: 'clerk_mock_123',
      email: 'instructor@courseforge.com',
      role: 'INSTRUCTOR',
    },
  });
  console.log('✓ Instructor user seeded:', instructor.email);

  // 2. Create or update Course 1 (React)
  const course1 = await prisma.course.upsert({
    where: { id: 'course-react-101' },
    update: {},
    create: {
      id: 'course-react-101',
      title: 'React Fundamentals: Learn by Building',
      description: 'Master React basics: JSX, component anatomy, props, useState, and dynamic lists through hands-on practice.',
      published: true,
      instructorId: 'user-instructor-1',
    },
  });
  console.log('✓ React Course seeded:', course1.title);

  // 3. Create or update Course 2 (Next.js)
  const course2 = await prisma.course.upsert({
    where: { id: 'course-nextjs-101' },
    update: {},
    create: {
      id: 'course-nextjs-101',
      title: 'Next.js 15 App Router Deep Dive',
      description: 'Learn how modern file-based routing, layouts, and the shift to React Server Components (RSC) speed up frontend apps.',
      published: true,
      instructorId: 'user-instructor-1',
    },
  });
  console.log('✓ Next.js Course seeded:', course2.title);

  console.log('Automated seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Close connection pool
  });
