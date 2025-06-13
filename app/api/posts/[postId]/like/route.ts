import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

export async function POST(
  req: NextRequest,
  // The key change: params is now a Promise
  { params }: { params: Promise<{ postId: string }> } // <-- Notice the Promise type
) {
  // Await the params object to get its resolved value
  const { postId } = await params; // <-- AWAIT HERE

  const { action } = await req.json();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    if (action === "like") {
      await db.likedPost.upsert({
        where: { userId_postId: { userId, postId } },
        update: {},
        create: { userId, postId },
      });
    } else if (action === "unlike") {
      await db.likedPost.deleteMany({
        where: { userId, postId },
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const likes = await db.likedPost.count({ where: { postId } });
    const isLiked = !!(await db.likedPost.findUnique({
      where: { userId_postId: { userId, postId } },
    }));

    return NextResponse.json({ likes, isLiked }, { status: 200 });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}