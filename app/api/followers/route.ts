import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { followerId, followingId, action } = await req.json();

    if (!followerId || !followingId || followerId === followingId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (action === "follow") {
      // Create follow relationship
      await db.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
      // Increment counts
      await db.user.update({ where: { id: followerId }, data: { following: { increment: 1 } } });
      await db.user.update({ where: { id: followingId }, data: { followers: { increment: 1 } } });
      return NextResponse.json({ message: "Followed" });
    } else if (action === "unfollow") {
      // Delete follow relationship
      await db.follow.delete({
        where: {
          followerId_followingId: { followerId, followingId },
        },
      });
      // Decrement counts
      await db.user.update({ where: { id: followerId }, data: { following: { decrement: 1 } } });
      await db.user.update({ where: { id: followingId }, data: { followers: { decrement: 1 } } });
      return NextResponse.json({ message: "Unfollowed" });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}