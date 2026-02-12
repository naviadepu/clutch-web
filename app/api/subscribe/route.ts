import { NextResponse } from 'next/server';

async function saveToGoogleSheets(email: string) {
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'your_google_script_url_here') {
        throw new Error('GOOGLE_SCRIPT_URL is not configured');
    }

    // Google Apps Script requires no-cors mode and works best with text/plain
    const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ email }),
        redirect: 'follow',
    });

    // Google Apps Script redirects to a response page, status may vary
    // If we get here without throwing, the request was sent
    if (!res.ok && res.status !== 302 && res.status !== 301) {
        throw new Error(`Google Script responded with status: ${res.status}`);
    }
}

async function saveToFile(email: string) {
    // Only works in local dev - serverless environments have read-only filesystems
    try {
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
    } catch {
        // Silently fail in production (read-only filesystem)
    }
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

        // Try Google Sheets first (works in production)
        try {
            await saveToGoogleSheets(email);
        } catch (err) {
            console.warn('Google Sheets save failed:', err);
        }

        // Also save locally (works in dev, silently fails in production)
        await saveToFile(email);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Subscribe error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
