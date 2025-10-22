import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Resend } from 'resend';

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

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiter (fallback if KV not available)
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
    
    // Try to use KV for rate limiting, fallback to in-memory
    let rateLimitExceeded = false;
    try {
      if (kv) {
        const key = `rate_limit:${ip}`;
        const current = await kv.get(key) as number || 0;
        if (current >= RATE_LIMIT_MAX) {
          rateLimitExceeded = true;
        } else {
          await kv.setex(key, 3600, current + 1); // 1 hour expiry
        }
      } else {
        // Fallback to in-memory rate limiting
        const entry = ipRequestLog.get(ip);
        if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
          ipRequestLog.set(ip, { count: 1, windowStart: now });
        } else {
          entry.count += 1;
          ipRequestLog.set(ip, entry);
          if (entry.count > RATE_LIMIT_MAX) {
            rateLimitExceeded = true;
          }
        }
      }
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Continue without rate limiting if KV fails
    }

    if (rateLimitExceeded) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Basic validation
    if (!body || !body.email || !body.firstName || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare submission data
    const submission: FormData = {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName || '',
      company: body.company || '',
      jobTitle: body.jobTitle || '',
      country: body.country || '',
      phone: body.phone || '',
      message: body.message,
    };

    const submissionId = `submission:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const submissionWithMeta = {
      ...submission,
      id: submissionId,
      timestamp,
      ip,
    };

    // Store in KV (database)
    let kvSuccess = false;
    try {
      if (kv) {
        await kv.set(submissionId, JSON.stringify(submissionWithMeta));
        await kv.lpush('submissions', submissionId);
        kvSuccess = true;
        console.log('✅ Stored in KV:', submissionId);
      } else {
        console.log('⚠️ KV not available, skipping database storage');
      }
    } catch (error) {
      console.error('❌ KV storage error:', error);
    }

    // Send email using Resend
    let emailSuccess = false;
    try {
      if (process.env.RESEND_API_KEY) {
        const emailData = {
          from: process.env.EMAIL_FROM || 'noreply@moducode.com',
          to: process.env.CONTACT_EMAIL || 'contact@moducode.com',
          replyTo: submission.email,
          subject: `Moducode call booking submission — ${submission.firstName} ${submission.lastName}`,
          html: `
            <h2>New contact form submission</h2>
            <p><strong>From:</strong> ${submission.firstName} ${submission.lastName} &lt;${submission.email}&gt;</p>
            <p><strong>Company:</strong> ${submission.company || 'N/A'}</p>
            <p><strong>Job Title:</strong> ${submission.jobTitle || 'N/A'}</p>
            <p><strong>Country:</strong> ${submission.country || 'N/A'}</p>
            <p><strong>Phone:</strong> ${submission.phone || 'N/A'}</p>
            <h3>Message</h3>
            <p>${(submission.message || '').replace(/\n/g, '<br/>')}</p>
            <hr>
            <p><small>Submission ID: ${submissionId}</small></p>
            <p><small>Timestamp: ${timestamp}</small></p>
          `,
          text: `${submission.message}\n\n--\nFrom: ${submission.firstName} ${submission.lastName} <${submission.email}>\nCompany: ${submission.company || 'N/A'}\nJob Title: ${submission.jobTitle || 'N/A'}\nCountry: ${submission.country || 'N/A'}\nPhone: ${submission.phone || 'N/A'}\n\nSubmission ID: ${submissionId}\nTimestamp: ${timestamp}`,
        };

        const emailResult = await resend.emails.send(emailData);
        emailSuccess = true;
        console.log('✅ Email sent successfully:', emailResult);
      } else {
        console.log('⚠️ RESEND_API_KEY not configured, skipping email');
      }
    } catch (error) {
      console.error('❌ Email sending error:', error);
    }

    // Log the submission
    console.log('📝 Form submission processed:', {
      id: submissionId,
      timestamp,
      kvSuccess,
      emailSuccess,
      email: submission.email,
      name: `${submission.firstName} ${submission.lastName}`,
    });

    // Return success if at least one method worked
    if (kvSuccess || emailSuccess) {
      return NextResponse.json({ 
        ok: true, 
        id: submissionId,
        kvSuccess,
        emailSuccess,
        message: 'Form submitted successfully' 
      });
    } else {
      return NextResponse.json({ 
        error: 'Failed to process submission. Please try again.' 
      }, { status: 500 });
    }

  } catch (err) {
    console.error('❌ Contact unified API error:', err);
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET endpoint to retrieve submissions (for admin use)
export async function GET() {
  try {
    if (!kv) {
      return NextResponse.json({ 
        error: 'KV not available',
        submissions: [],
        count: 0 
      });
    }

    const submissionIds = await kv.lrange('submissions', 0, -1) as string[];
    const submissions = [];
    
    for (const id of submissionIds) {
      try {
        const submission = await kv.get(id);
        if (submission) {
          submissions.push(JSON.parse(submission as string));
        }
      } catch (error) {
        console.error(`Error retrieving submission ${id}:`, error);
      }
    }

    return NextResponse.json({ 
      submissions,
      count: submissions.length 
    });
  } catch (err) {
    console.error('Error retrieving submissions:', err);
    return NextResponse.json({ error: 'Failed to retrieve submissions' }, { status: 500 });
  }
}
