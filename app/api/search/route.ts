import { NextResponse,NextRequest } from 'next/server';
import { db } from '@/app/lib/db';
export async function GET(req: NextRequest) {
    const {searchParams}=new URL(req.url);
    const query = searchParams.get('query') || '';

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        const users = await db.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                username: true,
                email: true,
                followers: true,
                following: true,
            },
        });

        if (users.length === 0) {
            return NextResponse.json({ message: 'No users found' }, { status: 404 });
        }

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error('Error searching users:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}