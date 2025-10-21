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

// Simple in-memory storage for demo purposes
// In production, use a real database like PostgreSQL, MongoDB, or Supabase
// For Vercel, consider using Vercel KV (Redis) or a database service
const submissions: FormData[] = [];

// In production, you could use:
// - Vercel KV (Redis)
// - Supabase
// - PlanetScale
// - Neon
// - MongoDB Atlas

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

    // Store the submission
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

    submissions.push(submission);

    // Log the submission (in production, this would be stored in a database)
    console.log('New form submission:', {
      id: submissions.length,
      timestamp: new Date().toISOString(),
      ...submission
    });

    // In production, you could also:
    // 1. Send an email notification to admin
    // 2. Store in a database
    // 3. Send to a webhook
    // 4. Add to a queue for processing

    return NextResponse.json({ 
      ok: true, 
      id: submissions.length,
      message: 'Form submitted successfully' 
    });
  } catch (err) {
    console.error('Contact DB API error', err);
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET endpoint to retrieve submissions (for admin use)
export async function GET() {
  try {
    return NextResponse.json({ 
      submissions,
      count: submissions.length 
    });
  } catch (err) {
    console.error('Error retrieving submissions:', err);
    return NextResponse.json({ error: 'Failed to retrieve submissions' }, { status: 500 });
  }
}
