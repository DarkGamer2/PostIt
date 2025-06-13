import { db } from "@/app/lib/db";
import { NextResponse,NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { title, content } = await req.json();

        if (!title) {
            return NextResponse.json({ error: "Invalid post title" }, { status: 400 });
        }

        const newPost = await db.post.create({
            data: {
                title,
                content: content || ""
            }
        });

        return NextResponse.json(newPost, { status: 200 });
    } catch (error) {
        console.error("[POST TODO]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
