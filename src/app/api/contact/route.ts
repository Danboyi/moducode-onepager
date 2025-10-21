import nodemailer from 'nodemailer';
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

// Simple in-memory rate limiter (best-effort). Note: in serverless deployments memory may not persist between invocations.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;
const ipRequestLog: Map<string, { count: number; windowStart: number }> = new Map();

const getTransport = () => {
  // Reads SMTP credentials from environment variables.
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';

  if (!host || !port || !user || !pass) {
    throw new Error('Missing SMTP configuration in environment variables. Please set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: !!secure,
    auth: {
      user,
      pass,
    },
    // Add connection timeout and retry options
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,    // 5 seconds
    socketTimeout: 10000,     // 10 seconds
    // For Gmail and other providers that require TLS
    tls: {
      rejectUnauthorized: false
    }
  });
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<FormData>;

    // Rate limiting by IP (best-effort). Try to read x-forwarded-for or fallback to connection ip.
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

    // basic validation
    if (!body || !body.email || !body.firstName || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = getTransport();
      // Use a verified sender address for the From header (from env); set replyTo to the user so replies go to them
      const emailFrom = process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@moducode.com';
      const replyTo = body.email;
      const to = process.env.CONTACT_EMAIL || 'contact@moducode.com';

    const html = `
      <h2>New contact form submission</h2>
      <p><strong>From:</strong> ${body.firstName} ${body.lastName} &lt;${body.email}&gt;</p>
      <p><strong>Company:</strong> ${body.company || 'N/A'}</p>
      <p><strong>Job Title:</strong> ${body.jobTitle || 'N/A'}</p>
      <p><strong>Country:</strong> ${body.country || 'N/A'}</p>
      <p><strong>Phone:</strong> ${body.phone || 'N/A'}</p>
      <h3>Message</h3>
      <p>${(body.message || '').replace(/\n/g, '<br/>')}</p>
    `;

    await transporter.sendMail({
      from: emailFrom,
      to,
      replyTo,
      subject: `Moducode call booking submission — ${body.firstName} ${body.lastName}`,
      text: `${body.message}\n\n--\nFrom: ${body.firstName} ${body.lastName} <${body.email}>\nCompany: ${body.company || 'N/A'}\nJob Title: ${body.jobTitle || 'N/A'}\nCountry: ${body.country || 'N/A'}\nPhone: ${body.phone || 'N/A'}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error', err);
    
    // Provide more specific error messages
    let message = 'Server error';
    let status = 500;
    
    if (err instanceof Error) {
      if (err.message.includes('ETIMEDOUT') || err.message.includes('ECONNREFUSED')) {
        message = 'Email service temporarily unavailable. Please try again later.';
        status = 503;
      } else if (err.message.includes('Missing SMTP configuration')) {
        message = 'Email service not configured. Please contact support.';
        status = 500;
      } else if (err.message.includes('authentication')) {
        message = 'Email authentication failed. Please contact support.';
        status = 500;
      } else {
        message = err.message;
      }
    }
    
    return NextResponse.json({ error: message }, { status });
  }
}
