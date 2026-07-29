import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to your .env environment variables."
    );
  }

  // 1. Extract Svix cryptographic headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // 2. Reject requests missing Svix signature headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix signature headers", {
      status: 400,
    });
  }

  // 3. Extract JSON payload
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // 4. Verify cryptographic signature using Svix
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying Clerk webhook signature:", err);
    return new Response("Error: Invalid signature verification failed", {
      status: 400,
    });
  }

  // 5. Handle Webhook Events & Synchronize Supabase PostgreSQL
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, public_metadata } = evt.data;
    const primaryEmail = email_addresses && email_addresses[0] ? email_addresses[0].email_address : "";

    // Determine user role (defaults to STUDENT unless metadata specifies INSTRUCTOR)
    const role = (public_metadata?.role as "INSTRUCTOR" | "STUDENT") || "STUDENT";

    // Idempotent upsert into Supabase PostgreSQL User table
    await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email: primaryEmail,
        role: role,
      },
      create: {
        clerkId: id,
        email: primaryEmail,
        role: role,
      },
    });

    console.log(`✓ Webhook Synced User [${id}] -> ${primaryEmail} (${role})`);
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      // Remove user record from Supabase PostgreSQL if account is deleted
      await prisma.user.deleteMany({
        where: { clerkId: id },
      });
      console.log(`✓ Webhook Deleted User [${id}] from database`);
    }
  }

  return Response.json({ success: true, eventType });
}
