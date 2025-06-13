import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions"; // Adjust path if needed

export async function GET(
  req: NextRequest,
  // The key change: params is now a Promise in recent Next.js versions
  { params }: { params: Promise<{ postId: string }> } // <-- Notice the Promise type
) {
  // Await the params object to get its resolved value
  const { postId } = await params; // <-- AWAIT HERE

  // Get session using NextAuth inside the handler
  const session = await getServerSession(authOptions);
  // If you store user id in the token, it will be available as session?.user?.id, otherwise adjust accordingly
  const userId = (session?.user as { id?: string })?.id;

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const likes = await db.likedPost.count({ where: { postId } });
    const isLiked = userId
      ? !!(await db.likedPost.findUnique({ where: { userId_postId: { userId, postId } } }))
      : false;
    const comments = await db.comment.count({ where: { postId } });
    // Add shares if you have them

    return NextResponse.json({ likes, comments, isLiked }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}