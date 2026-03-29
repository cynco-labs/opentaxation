import { checkRateLimit, RATE_LIMITS } from './rateLimiter';

/** Email validation regex */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  leadType: 'incorporation' | 'newsletter' | 'partner_inquiry';
  source?: string;
  metadata?: LeadMetadata;
  captchaToken?: string;
  // Convex mutation function passed from component
  submitLead?: (args: {
    email: string;
    leadType: 'incorporation' | 'newsletter' | 'partner_inquiry';
    source?: string;
    metadata?: Record<string, unknown>;
  }) => Promise<unknown>;
}

/**
 * Create a new lead
 */
export async function createLead(params: CreateLeadParams): Promise<{ success: boolean; error?: string }> {
  if (!EMAIL_REGEX.test(params.email)) {
    return { success: false, error: 'Please enter a valid email address' };
  }

  if (!checkRateLimit('lead-submit', RATE_LIMITS.LEAD)) {
    return { success: false, error: 'Too many submissions. Please try again later.' };
  }

  if (!params.submitLead) {
    console.warn('[Leads] submitLead mutation not provided — submission dropped');
    return { success: false, error: 'Lead submission is not configured' };
  }

  try {
    await params.submitLead({
      email: params.email,
      leadType: params.leadType,
      source: params.source || 'whats_next_cta',
      metadata: params.metadata || {},
    });
    return { success: true };
  } catch (err) {
    console.error('[Leads] Error creating lead:', err);
    return { success: false, error: 'Failed to save your information. Please try again.' };
  }
}

/**
 * Get UTM parameters from URL
 */
export function getUtmParams(): Pick<LeadMetadata, 'utmSource' | 'utmMedium' | 'utmCampaign'> {
  if (typeof window === 'undefined') return {};
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
  if (typeof window === 'undefined' || !document.referrer) return undefined;
  try {
    const referrerUrl = new URL(document.referrer);
    if (referrerUrl.hostname === window.location.hostname) return undefined;
    return referrerUrl.hostname;
  } catch {
    return undefined;
  }
}
