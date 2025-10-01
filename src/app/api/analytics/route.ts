import { NextRequest, NextResponse } from 'next/server';

type AnalyticsEvent = {
  name: string;
  params?: Record<string, unknown>;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body as AnalyticsEvent;

    // If GA measurement id and API secret are configured, forward to GA4 Measurement Protocol
    const measurementId = process.env.GA_MEASUREMENT_ID;
    const apiSecret = process.env.GA_API_SECRET;
    if (measurementId && apiSecret) {
      const payload = {
        client_id: body.client_id || 'web-client',
        events: [{ name: event.name, params: event.params || {} }],
      };
      const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
      await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Analytics forwarding error', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
