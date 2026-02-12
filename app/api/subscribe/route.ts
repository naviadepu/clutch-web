import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'subscribers.json');

async function saveToFile(email: string) {
    let subscribers: { email: string; timestamp: string }[] = [];

    try {
        const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
        subscribers = JSON.parse(data);
    } catch {
        // File doesn't exist yet, start fresh
    }

    // Check for duplicate
    if (subscribers.some((s) => s.email === email)) {
        return; // Already subscribed
    }

    subscribers.push({ email, timestamp: new Date().toISOString() });
    await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

async function saveToGoogleSheets(email: string) {
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'your_google_script_url_here') {
        return;
    }

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            redirect: 'follow',
        });
    } catch (err) {
        console.warn('Google Sheets sync failed (emails are still saved locally):', err);
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

        // Always save locally (reliable)
        await saveToFile(email);

        // Also try Google Sheets (best-effort, won't block success)
        saveToGoogleSheets(email);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Subscribe error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
