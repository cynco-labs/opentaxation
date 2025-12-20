import { supabase, isSupabaseConfigured } from './supabase';
import { checkRateLimit, RATE_LIMITS } from './rateLimiter';
import type { Database, Json } from '@/types/database';

// ============================================
// CONSTANTS
// ============================================

/** PostgreSQL unique constraint violation error code */
const PGSQL_UNIQUE_VIOLATION = '23505';

/** PostgREST not found error code */
const PGRST_NOT_FOUND = 'PGRST116';

/** Email validation regex */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================
// TYPES
// ============================================

type LeadType = Database['public']['Tables']['leads']['Row']['lead_type'];
type LeadStatus = Database['public']['Tables']['leads']['Row']['status'];

export interface LeadMetadata {
  businessProfit?: number;
  potentialSavings?: number;
  recommendation?: 'sdnBhd' | 'soleProp' | 'similar';
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface CreateLeadParams {
  email: string;
  leadType: LeadType;
  source?: string;
  metadata?: LeadMetadata;
  userId?: string | null;
  captchaToken?: string;
}

export interface Lead {
  id: string;
  email: string;
  lead_type: LeadType;
  source: string;
  metadata: LeadMetadata;
  user_id: string | null;
  created_at: string;
  contacted_at: string | null;
  status: LeadStatus;
}

type FunctionErrorContext = { status?: number; statusText?: string };

function getFunctionErrorStatus(error: unknown): FunctionErrorContext | null {
  if (!error || typeof error !== 'object') return null;
  const context = (error as { context?: FunctionErrorContext }).context;
  return context ?? null;
}

/**
 * Create a new lead in the database
 */
export async function createLead(params: CreateLeadParams): Promise<{ success: boolean; error?: string }> {
  // Validate email format
  if (!EMAIL_REGEX.test(params.email)) {
    return { success: false, error: 'Please enter a valid email address' };
  }

  if (!checkRateLimit('lead-submit', RATE_LIMITS.LEAD)) {
    return { success: false, error: 'Too many submissions. Please try again later.' };
  }

  // If Supabase isn't configured, return success silently
  // This allows the CTA to work in development without a database
  if (!isSupabaseConfigured || !supabase) {
    return { success: true };
  }

  try {
    const payload = {
      email: params.email,
      leadType: params.leadType,
      source: params.source || 'whats_next_cta',
      metadata: params.metadata || {},
      userId: params.userId || null,
      captchaToken: params.captchaToken,
    };

    const { data, error } = await supabase.functions.invoke('submit-lead', {
      body: payload,
    });

    if (!error && data?.success) {
      return { success: true };
    }

    const status = getFunctionErrorStatus(error)?.status;
    if (status && status !== 404 && status !== 405) {
      return { success: false, error: data?.error || error?.message || 'Failed to save your information.' };
    }

    const { error: insertError } = await supabase.from('leads').insert({
      email: params.email,
      lead_type: params.leadType,
      source: params.source || 'whats_next_cta',
      metadata: (params.metadata || {}) as Json,
      user_id: params.userId || null,
      status: 'new',
    });

    if (insertError) {
      // Handle duplicate email gracefully
      if (insertError.code === PGSQL_UNIQUE_VIOLATION) {
        return { success: true }; // Treat as success, user is already in system
      }
      console.error('[Leads] Error creating lead:', insertError);
      return { success: false, error: insertError.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[Leads] Unexpected error:', err);
    return { success: false, error: 'Failed to save your information. Please try again.' };
  }
}

/**
 * Check if an email already exists as a lead
 */
export async function checkLeadExists(email: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .single();

    if (error && error.code !== PGRST_NOT_FOUND) {
      console.error('[Leads] Error checking lead:', error);
    }

    return !!data;
  } catch {
    return false;
  }
}

/**
 * Get UTM parameters from URL
 */
export function getUtmParams(): Pick<LeadMetadata, 'utmSource' | 'utmMedium' | 'utmCampaign'> {
  if (typeof window === 'undefined') {
    return {};
  }

  const params = new URLSearchParams(window.location.search);

  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
  };
}

/**
 * Get referrer information
 */
export function getReferrer(): string | undefined {
  if (typeof window === 'undefined' || !document.referrer) {
    return undefined;
  }

  try {
    const referrerUrl = new URL(document.referrer);
    // Don't track internal referrers
    if (referrerUrl.hostname === window.location.hostname) {
      return undefined;
    }
    return referrerUrl.hostname;
  } catch {
    return undefined;
  }
}
