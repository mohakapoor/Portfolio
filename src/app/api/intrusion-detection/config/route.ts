import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const token = process.env.TOKEN;
    
    if (!token) {
        return NextResponse.json({ error: 'Config not found' }, { status: 500 });
    }

    return NextResponse.json({
        token: token
    });
}
