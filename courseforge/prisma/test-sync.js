require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verifySync() {
  console.log('Testing Clerk -> Supabase User Synchronization...');

  const mockClerkId = 'user_clerk_test_webhook_sync_999';
  const mockEmail = 'synced_student@courseforge.com';

  // 1. Simulate Webhook UPSERT operation
  const syncedUser = await prisma.user.upsert({
    where: { clerkId: mockClerkId },
    update: {
      email: mockEmail,
      role: 'STUDENT',
    },
    create: {
      clerkId: mockClerkId,
      email: mockEmail,
      role: 'STUDENT',
    },
  });

  console.log('✓ Successfully executed Prisma Upsert!');
  console.log('  Database User ID:', syncedUser.id);
  console.log('  Clerk User ID:   ', syncedUser.clerkId);
  console.log('  Email Address:   ', syncedUser.email);
  console.log('  Assigned Role:   ', syncedUser.role);

  // 2. Query back from Supabase to confirm persistence
  const checkDb = await prisma.user.findUnique({
    where: { clerkId: mockClerkId },
  });

  if (checkDb) {
    console.log('\n🎉 VERIFICATION PASSED: Clerk User is live in Supabase PostgreSQL!');
  } else {
    console.error('\n❌ VERIFICATION FAILED: Record not found in Supabase.');
  }
}

verifySync()
  .catch((e) => {
    console.error('Error during synchronization test:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
