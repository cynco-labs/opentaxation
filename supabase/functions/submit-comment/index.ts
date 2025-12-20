import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') ?? '';
const TURNSTILE_SECRET_KEY = Deno.env.get('TURNSTILE_SECRET_KEY') ?? '';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_COMMENT_LENGTH = 2000;

// Get allowed origin from environment, default to * for development
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || '*';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type CommentPayload = {
  postId: string;
  content: string;
  userName: string;
  userAvatar?: string;
  parentId?: string | null;
  captchaToken?: string;
};

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

  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  let payload: CommentPayload;
  try {
    payload = (await req.json()) as CommentPayload;
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
  }

  const content = payload?.content?.trim();
  if (!payload?.postId || !content || content.length > MAX_COMMENT_LENGTH) {
    return jsonResponse({ error: 'Invalid comment payload.' }, 400);
  }

  // Validate postId format (should be UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(payload.postId)) {
    return jsonResponse({ error: 'Invalid post ID format.' }, 400);
  }

  // Validate userName length
  if (payload.userName && payload.userName.length > 120) {
    return jsonResponse({ error: 'User name too long.' }, 400);
  }

  if (!(await verifyTurnstile(payload.captchaToken))) {
    return jsonResponse({ error: 'CAPTCHA verification failed.' }, 400);
  }

  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count } = await supabase
    .from('blog_comments')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since)
    .eq('user_id', userData.user.id);

  if (count !== null && count >= RATE_LIMIT_MAX) {
    return jsonResponse({ error: 'Please wait before posting another comment.' }, 429);
  }

  const { data: post } = await supabase
    .from('blog_posts')
    .select('id, status')
    .eq('id', payload.postId)
    .single();

  if (!post || post.status !== 'published') {
    return jsonResponse({ error: 'Post not available.' }, 400);
  }

  const { data, error } = await supabase
    .from('blog_comments')
    .insert({
      post_id: payload.postId,
      user_id: userData.user.id,
      user_name: payload.userName?.trim().slice(0, 120) || 'Anonymous',
      user_avatar: payload.userAvatar,
      content,
      parent_id: payload.parentId || null,
      is_approved: false,
    })
    .select()
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ comment: data }, 200);
});
