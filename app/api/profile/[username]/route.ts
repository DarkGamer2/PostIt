import { NextResponse,NextRequest } from 'next/server';
import { db } from '@/app/lib/db';

export async function GET(req: NextRequest, context: { params: { username: string } }) {
    
    const username = context.params.username;

    if (!username) {
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