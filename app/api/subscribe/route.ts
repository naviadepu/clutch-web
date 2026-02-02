import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

        if (!GOOGLE_SCRIPT_URL) {
            console.error('GOOGLE_SCRIPT_URL env variable is not set');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const res = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to save email' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
