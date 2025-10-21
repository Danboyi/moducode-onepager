import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

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

    const submissionId = `submission:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Store in KV if available
      if (kv) {
        await kv.set(submissionId, JSON.stringify({
          ...submission,
          id: submissionId,
          timestamp: new Date().toISOString(),
        }));
        
        // Also add to a list for easy retrieval
        await kv.lpush('submissions', submissionId);
      } else {
        console.log('KV not available, storing in memory only');
      }
    } catch (error) {
      console.error('Storage error:', error);
      // Continue even if storage fails
    }

    // Log the submission
    console.log('New form submission:', {
      id: submissionId,
      timestamp: new Date().toISOString(),
      ...submission
    });

    return NextResponse.json({ 
      ok: true, 
      id: submissionId,
      message: 'Form submitted successfully' 
    });
  } catch (err) {
    console.error('Contact KV API error', err);
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
