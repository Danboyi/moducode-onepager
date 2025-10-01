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
  });
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<FormData>;

    // basic validation
    if (!body || !body.email || !body.firstName || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = getTransport();

    const emailFrom = process.env.EMAIL_FROM || body.email;
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
      subject: `Website contact form — ${body.firstName} ${body.lastName}`,
      text: `${body.message}\n\n--\nFrom: ${body.firstName} ${body.lastName} <${body.email}>\nCompany: ${body.company || 'N/A'}\nJob Title: ${body.jobTitle || 'N/A'}\nCountry: ${body.country || 'N/A'}\nPhone: ${body.phone || 'N/A'}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error', err);
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
