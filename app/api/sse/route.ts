import { NextResponse } from "next/server";

export async function GET() {
    const encoder = new TextEncoder();
    
    const readable = new ReadableStream({
        start(controller) {
            let count = 0;
            const interval = setInterval(() => {
                count++;
                controller.enqueue(encoder.encode(`data: New notification ${count}\n\n`));
            }, 5000); // Fixed closing parenthesis

            setTimeout(() => {
                clearInterval(interval);
                controller.close();
            }, 30000); // Fixed timeout duration
        },
    });

    return new NextResponse(readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}
