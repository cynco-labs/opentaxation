import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') ?? '';
const TURNSTILE_SECRET_KEY = Deno.env.get('TURNSTILE_SECRET_KEY') ?? '';

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60_000;

// Get allowed origin from environment, default to * for development
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || '*';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type LeadPayload = {
  email: string;
  leadType: 'incorporation' | 'newsletter' | 'partner_inquiry';
  source?: string;
  metadata?: Record<string, unknown>;
  userId?: string | null;
  captchaToken?: string;
};

const MAX_EMAIL_LENGTH = 255;
const MAX_SOURCE_LENGTH = 100;
const MAX_METADATA_SIZE = 10000; // 10KB limit for metadata JSON

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;

  const form = new FormData();
  form.append('secret', TURNSTILE_SECRET_KEY);
  form.append('response', token);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });

  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return Boolean(result.success);
}

function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? null;
  }
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return jsonResponse({ error: 'Server not configured.' }, 500);
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  let payload: LeadPayload;
  try {
    payload = (await req.json()) as LeadPayload;
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
  }

  if (!payload?.email || !payload.leadType) {
    return jsonResponse({ error: 'Missing required fields.' }, 400);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    return jsonResponse({ error: 'Invalid email format.' }, 400);
  }

  // Validate email length
  if (payload.email.length > MAX_EMAIL_LENGTH) {
    return jsonResponse({ error: 'Email too long.' }, 400);
  }

  // Validate leadType enum
  const validLeadTypes: LeadPayload['leadType'][] = ['incorporation', 'newsletter', 'partner_inquiry'];
  if (!validLeadTypes.includes(payload.leadType)) {
    return jsonResponse({ error: 'Invalid lead type.' }, 400);
  }

  // Validate source length if provided
  if (payload.source && payload.source.length > MAX_SOURCE_LENGTH) {
    return jsonResponse({ error: 'Source too long.' }, 400);
  }

  // Validate metadata size if provided
  if (payload.metadata) {
    const metadataSize = JSON.stringify(payload.metadata).length;
    if (metadataSize > MAX_METADATA_SIZE) {
      return jsonResponse({ error: 'Metadata too large.' }, 400);
    }
  }

  if (!(await verifyTurnstile(payload.captchaToken))) {
    return jsonResponse({ error: 'CAPTCHA verification failed.' }, 400);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const ip = getClientIp(req);

  const { count: emailCount } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since)
    .eq('email', payload.email);

  if (emailCount !== null && emailCount >= RATE_LIMIT_MAX) {
    return jsonResponse({ error: 'Too many submissions. Please try again later.' }, 429);
  }

  if (ip) {
    const { count: ipCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', since)
      .contains('metadata', { ip });

    if (ipCount !== null && ipCount >= RATE_LIMIT_MAX) {
      return jsonResponse({ error: 'Too many submissions. Please try again later.' }, 429);
    }
  }

  const metadata = { ...(payload.metadata ?? {}), ip };

  const { error } = await supabase.from('leads').insert({
    email: payload.email,
    lead_type: payload.leadType,
    source: payload.source || 'whats_next_cta',
    metadata,
    user_id: payload.userId || null,
    status: 'new',
  });

  if (error?.code === '23505') {
    return jsonResponse({ success: true }, 200);
  }

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ success: true }, 200);
});
