import { NextRequest, NextResponse } from 'next/server';

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  country: string;
  phone: string;
  message: string;
};

// Simple in-memory rate limiter
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;
const ipRequestLog: Map<string, { count: number; windowStart: number }> = new Map();

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<FormData>;

    // Rate limiting by IP
    const forwarded = req.headers.get('x-forwarded-for') || '';
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const now = Date.now();
    const entry = ipRequestLog.get(ip);
    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      ipRequestLog.set(ip, { count: 1, windowStart: now });
    } else {
      entry.count += 1;
      ipRequestLog.set(ip, entry);
      if (entry.count > RATE_LIMIT_MAX) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }
    }

    // Basic validation
    if (!body || !body.email || !body.firstName || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    // Send email using Resend
    const emailData = {
      from: process.env.EMAIL_FROM || 'noreply@moducode.com',
      to: process.env.CONTACT_EMAIL || 'contact@moducode.com',
      replyTo: body.email,
      subject: `Moducode call booking submission — ${body.firstName} ${body.lastName}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>From:</strong> ${body.firstName} ${body.lastName} &lt;${body.email}&gt;</p>
        <p><strong>Company:</strong> ${body.company || 'N/A'}</p>
        <p><strong>Job Title:</strong> ${body.jobTitle || 'N/A'}</p>
        <p><strong>Country:</strong> ${body.country || 'N/A'}</p>
        <p><strong>Phone:</strong> ${body.phone || 'N/A'}</p>
        <h3>Message</h3>
        <p>${(body.message || '').replace(/\n/g, '<br/>')}</p>
      `,
      text: `${body.message}\n\n--\nFrom: ${body.firstName} ${body.lastName} <${body.email}>\nCompany: ${body.company || 'N/A'}\nJob Title: ${body.jobTitle || 'N/A'}\nCountry: ${body.country || 'N/A'}\nPhone: ${body.phone || 'N/A'}`,
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to send email. Please try again later.' 
      }, { status: 500 });
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact Resend API error', err);
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
