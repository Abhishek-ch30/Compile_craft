// File: src/app/api/liveblocks-auth/route.ts
import { Liveblocks } from "@liveblocks/node";
import { auth, currentUser } from "@clerk/nextjs/server"; // Import currentUser
import { NextResponse } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  // Get the current user from Clerk
  const user = await currentUser();

  // Ensure the user is authenticated
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Start a session with Liveblocks
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.firstName || "Anonymous",
      // You could add an avatar here
      // avatar: user.imageUrl,
    },
  });

  // Get the room from the request body
  const { room } = await request.json();
  session.allow(room, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}