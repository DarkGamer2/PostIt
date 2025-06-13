import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/app/lib/db';

export async function GET(
  req: NextRequest,
  // The key change: params is now a Promise in recent Next.js versions
  { params }: { params: Promise<{ username: string }> } // <-- Notice the Promise type
) {
    // Await the params object to get its resolved value
    const { username } = await params; // <-- AWAIT HERE

    if (!username) {
        // This check might be redundant if the route ensures username is always present,
        // but it's good for robustness.
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    try {
        const user = await db.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                email: true,
                followers: true,
                following: true,
                verified:true
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}