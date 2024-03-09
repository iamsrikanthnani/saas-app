import { clerkClient } from "@clerk/nextjs";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";

// Handler function for handling POST requests
export async function POST(req: Request) {
  // Retrieve webhook secret from environment variables
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  // If webhook secret is not provided, throw an error
  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the request headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If required headers are missing, return an error response
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the provided headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Extract ID and type of the webhook event
  const { id } = evt.data;
  const eventType = evt.type;

  // Handle different types of events

  // CREATE user event
  if (eventType === "user.created") {
    const {
      id,
      email_addresses,
      image_url,
      first_name,
      last_name,
      created_at,
      updated_at,
      last_sign_in_at,
    } = evt.data;

    // Construct user object from webhook data
    const user = {
      userId: id,
      email: email_addresses[0]?.email_address,
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
      lastSignInAt: last_sign_in_at,
      createdAt: created_at,
      updatedAt: updated_at,
    };

    // Create user in the database
    const newUser = await createUser(user);

    // Set public metadata if user is created successfully
    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    // Return response
    return NextResponse.json({ message: "OK", user: newUser });
  }

  // UPDATE user event
  if (eventType === "user.updated") {
    const {
      id,
      image_url,
      first_name,
      last_name,
      created_at,
      updated_at,
      last_sign_in_at,
    } = evt.data;

    // Construct user object from webhook data
    const user = {
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
      lastSignInAt: last_sign_in_at,
      createdAt: created_at,
      updatedAt: updated_at,
    };

    // Update user in the database
    const updatedUser = await updateUser(id, user);

    // Return response
    return NextResponse.json({ message: "OK", user: updatedUser });
  }

  // DELETE user event
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    // Delete user from the database
    const deletedUser = await deleteUser(id!);

    // Return response
    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  // Log webhook details
  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  // Return empty response with status 200
  return new Response("", { status: 200 });
}
