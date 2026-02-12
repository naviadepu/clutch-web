import { NextResponse } from 'next/server';

async function saveToGoogleSheets(email: string) {
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'your_google_script_url_here') {
        throw new Error('GOOGLE_SCRIPT_URL is not configured');
    }

    // Use GET with query param - avoids 401 auth issues with Apps Script POST
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.set('email', email);

    const res = await fetch(url.toString(), { redirect: 'follow' });

    if (!res.ok) {
        throw new Error(`Google Script responded with status: ${res.status}`);
    }
}

async function saveToFile(email: string) {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'subscribers.json');

    let subscribers: { email: string; timestamp: string }[] = [];
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        subscribers = JSON.parse(data);
    } catch {
        // File doesn't exist yet
    }

    if (subscribers.some((s) => s.email === email)) return;

    subscribers.push({ email, timestamp: new Date().toISOString() });
    await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2));
}

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        let saved = false;

        // Try Google Sheets (works in production + local)
        try {
            await saveToGoogleSheets(email);
            saved = true;
        } catch (err) {
            console.warn('Google Sheets save failed:', err);
        }

        // Try local file (works in local dev only)
        try {
            await saveToFile(email);
            saved = true;
        } catch {
            // Read-only filesystem in production - expected
        }

        if (!saved) {
            return NextResponse.json({ error: 'Failed to save email' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Subscribe error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
