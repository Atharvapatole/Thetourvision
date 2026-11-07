import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'tour_vision_secure_webhook_token_2026';

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WhatsApp Webhook verified successfully.');
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification token mismatch' }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const appSecret = process.env.WHATSAPP_APP_SECRET;

    // Validate Meta X-Hub-Signature-256 header if secret is configured
    if (appSecret) {
      const signature = request.headers.get('x-hub-signature-256');
      if (signature) {
        const expectedSignature = `sha256=${crypto
          .createHmac('sha256', appSecret)
          .update(rawBody)
          .digest('hex')}`;
        if (signature !== expectedSignature) {
          return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
        }
      }
    }

    const payload = JSON.parse(rawBody);

    // Record webhook event in Supabase logs
    try {
      const supabase = createAdminClient();
      await supabase.from('whatsapp_logs').insert({
        recipient_phone: 'webhook_incoming',
        message_type: 'cloud_api_webhook',
        status: 'delivered',
        payload: payload,
      });
    } catch {
      // Continue even if logging fails
    }

    return NextResponse.json({ status: 'EVENT_RECEIVED' });
  } catch (error: any) {
    console.error('WhatsApp Webhook POST error:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
