/**
 * Supabase Edge Function: Calculate and Save Tax Calculation
 * 
 * This function:
 * 1. Verifies the user (JWT)
 * 2. Sanitizes and validates inputs
 * 3. Recomputes results using the tax calculation engine
 * 4. Stores results with metadata (tax_year, engine_version, verified)
 * 5. Returns server-confirmed results
 * 
 * This ensures saved calculations are verified server-side for high confidence.
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') ?? '';

// Engine version - update this when calculation logic changes
const ENGINE_VERSION = '1.0.0';

// Current tax year - should match packages/config/taxYears.ts
const CURRENT_TAX_YEAR = 'YA2024-2025';

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalculateAndSavePayload {
  name: string;
  inputs: Record<string, unknown>;
  // Optional: if provided, we'll verify it matches server calculation
  clientResults?: Record<string, unknown>;
}

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Import tax calculation functions
 * Note: In production, you may need to bundle these or use import maps
 * For now, we'll use a simplified approach that calls the calculation logic
 * 
 * TODO: Bundle @tax-engine/core and @tax-engine/config for Deno
 * This is a placeholder that shows the structure
 */
async function calculateTaxResults(inputs: Record<string, unknown>): Promise<Record<string, unknown>> {
  // For now, we'll return a placeholder
  // In production, you would:
  // 1. Bundle @tax-engine/core and @tax-engine/config as ESM
  // 2. Import and use calculateSolePropScenario, calculateSdnBhdScenario, compareScenarios
  // 3. Or create a separate calculation service
  
  // Placeholder implementation
  // In real implementation, this would call:
  // import { calculateSolePropScenario, calculateSdnBhdScenario, compareScenarios, sanitizeInputs, validateInputs } from '@tax-engine/core';
  
  throw new Error('Tax calculation engine not yet bundled for Deno. Use client-side calculation for now.');
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

  // Verify authentication
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

  let payload: CalculateAndSavePayload;
  try {
    payload = (await req.json()) as CalculateAndSavePayload;
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
  }

  if (!payload?.name || !payload?.inputs) {
    return jsonResponse({ error: 'Missing required fields: name, inputs.' }, 400);
  }

  // Validate inputs structure (basic validation)
  if (typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    return jsonResponse({ error: 'Name must be a non-empty string.' }, 400);
  }

  if (typeof payload.inputs !== 'object' || payload.inputs === null) {
    return jsonResponse({ error: 'Inputs must be an object.' }, 400);
  }

  try {
    // Calculate results server-side
    // TODO: Replace with actual calculation once engine is bundled
    const results = await calculateTaxResults(payload.inputs);

    // Store in database with metadata
    const { data, error } = await supabase
      .from('saved_calculations')
      .insert({
        user_id: userData.user.id,
        name: payload.name.trim(),
        inputs: payload.inputs,
        results,
        tax_year: CURRENT_TAX_YEAR,
        engine_version: ENGINE_VERSION,
        verified: true,
        computed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return jsonResponse({ error: error.message }, 500);
    }

    return jsonResponse(
      {
        success: true,
        calculation: data,
        message: 'Calculation saved and verified server-side.',
      },
      200
    );
  } catch (error) {
    console.error('Calculation error:', error);
    return jsonResponse(
      {
        error: 'Calculation failed.',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

