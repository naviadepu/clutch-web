import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

async function sendConfirmationEmail(email: string) {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
        console.warn('SendGrid not configured — skipping confirmation email');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: 'apikey',
            pass: apiKey,
        },
    });

    await transporter.sendMail({
        from: `Clutch <${fromEmail}>`,
        to: email,
        subject: "you're in! welcome to clutch",
        html: `
            <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
                <h1 style="color: #D23669; font-size: 28px; margin: 0 0 20px;">&#128206; clutch</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.7; margin: 0 0 14px;">
                    thanks for joining the list!
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
                    you'll be one of our first beta testers when clutch launches. we'll keep you posted.
                </p>
                <div style="border-top: 2px solid #D23669; padding-top: 16px;">
                    <p style="color: #999; font-size: 13px; margin: 0;">the clutch team</p>
                </div>
            </div>
        `,
    });
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

        // Send confirmation email (non-blocking — don't fail the request if this errors)
        try {
            await sendConfirmationEmail(email);
        } catch (err) {
            console.error('Confirmation email failed:', err);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Subscribe error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
