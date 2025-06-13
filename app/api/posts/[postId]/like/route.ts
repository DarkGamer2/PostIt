import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
// import { getCurrentUserId } from "@/app/lib/auth"; // You need to implement this

export async function POST(req: NextRequest, context: Promise<{ params: { postId: string } }>) {
  const { params } = await context;
  const { postId } = params;
  const { action } = await req.json();

  // TODO: Replace with your real user auth logic
  const userId = await getCurrentUserId(req);
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
    }

    const likes = await db.likedPost.count({ where: { postId } });
    const isLiked = !!(await db.likedPost.findUnique({ where: { userId_postId: { userId, postId } } }));

    return NextResponse.json({ likes, isLiked }, { status: 200 });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Dummy implementation for demonstration
async function getCurrentUserId(req: NextRequest): Promise<string | null> {
  // You must implement this using your auth/session logic
  // For demo: return a hardcoded user id
  return "demo-user-id";
}