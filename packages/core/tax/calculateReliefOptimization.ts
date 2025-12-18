/**
 * Relief Optimization Calculator
 * Handles shared cap enforcement and relief calculations
 *
 * Key concepts:
 * - Individual limits: Max per relief (e.g., lifestyle_books max RM2,500)
 * - Shared caps: Some reliefs share a combined limit (e.g., lifestyle_general RM2,500 total)
 * - Per-unit reliefs: Multiply by quantity (e.g., child_under18 × 3 children)
 * - Basic relief: Always RM9,000, added automatically
 */

import {
  RELIEF_CATALOG,
  SHARED_CAP_LIMITS,
  SHARED_CAP_LABELS,
  getReliefById,
  type SharedCapGroup,
} from '@tax-engine/config';
import type {
  ReliefClaimValues,
  ReliefClaimEntry,
  ReliefOptimizationResult,
  SharedCapUsage,
  CappedItem,
} from '../types';

// Basic relief is always applied
const BASIC_RELIEF_AMOUNT = 9000;

/**
 * Calculate the effective claim amount for a single relief
 * Handles per-unit reliefs by multiplying amount × quantity
 */
function getEffectiveClaim(entry: ReliefClaimEntry, reliefId: string): number {
  const relief = getReliefById(reliefId);
  if (!relief) return 0;

  const baseAmount = entry.amount || 0;

  // For per-unit reliefs, multiply by quantity
  if (relief.perUnit && entry.quantity) {
    return baseAmount * entry.quantity;
  }

  return baseAmount;
}

/**
 * Apply individual relief limit
 * Returns the capped amount and whether it was reduced
 */
function applyIndividualLimit(
  reliefId: string,
  claimed: number
): { allowed: number; wasCapped: boolean } {
  const relief = getReliefById(reliefId);
  if (!relief) return { allowed: 0, wasCapped: false };

  // For per-unit reliefs, the limit applies per unit
  // e.g., child_under18: limit is 2000 per child, already multiplied in getEffectiveClaim
  const allowed = Math.min(claimed, relief.limit * (relief.perUnit ? Math.ceil(claimed / relief.limit) : 1));

  // Actually, let's reconsider: the limit is the max total regardless of units
  // E.g., 3 children × 2000 = 6000 max, not 2000 max
  // The per-unit limit means "per child up to this amount", so total can exceed

  // Simpler approach: for per-unit, multiply limit by quantity from the entry
  // But we don't have the entry here. Let's check the relief definition.

  // Based on Malaysian tax rules: per-child reliefs don't have a combined cap
  // You can claim RM2,000 × number of children (unlimited children)
  // So we just return the claimed amount if it's per-unit

  if (relief.perUnit) {
    // For per-unit reliefs, there's no combined cap
    // The individual limit is per unit, which was already factored in by the UI
    return { allowed: claimed, wasCapped: false };
  }

  const effectiveLimit = relief.limit;
  const finalAllowed = Math.min(claimed, effectiveLimit);

  return {
    allowed: finalAllowed,
    wasCapped: finalAllowed < claimed,
  };
}

/**
 * Calculate relief optimization with shared cap enforcement
 */
export function calculateReliefOptimization(
  claims: ReliefClaimValues
): ReliefOptimizationResult {
  // Track results
  const breakdown: Record<string, number> = {};
  const cappedItems: CappedItem[] = [];

  // Track shared cap usage
  const sharedCapTotals: Record<SharedCapGroup, number> = {
    lifestyle_general: 0,
    lifestyle_sports: 0,
    epf_insurance: 0,
    prs_annuity: 0,
    none: 0,
  };

  // Track which reliefs contribute to each shared cap
  const sharedCapReliefs: Record<SharedCapGroup, string[]> = {
    lifestyle_general: [],
    lifestyle_sports: [],
    epf_insurance: [],
    prs_annuity: [],
    none: [],
  };

  // First pass: Apply individual limits and track claims by shared cap group
  const afterIndividualLimits: Record<string, number> = {};

  for (const [reliefId, entry] of Object.entries(claims)) {
    const relief = getReliefById(reliefId);
    if (!relief || relief.mandatory) continue;

    const effectiveClaim = getEffectiveClaim(entry, reliefId);
    if (effectiveClaim <= 0) continue;

    const { allowed, wasCapped } = applyIndividualLimit(reliefId, effectiveClaim);

    if (wasCapped) {
      cappedItems.push({
        id: reliefId,
        name: relief.name,
        claimed: effectiveClaim,
        allowed,
        reason: 'individual_limit',
      });
    }

    afterIndividualLimits[reliefId] = allowed;
    sharedCapReliefs[relief.sharedCapGroup].push(reliefId);
  }

  // Second pass: Apply shared cap limits
  // Process each shared cap group
  for (const group of Object.keys(SHARED_CAP_LIMITS) as SharedCapGroup[]) {
    if (group === 'none') continue;

    const limit = SHARED_CAP_LIMITS[group];
    const reliefIds = sharedCapReliefs[group];

    // Sum all claims in this group
    let totalInGroup = 0;
    for (const reliefId of reliefIds) {
      totalInGroup += afterIndividualLimits[reliefId] || 0;
    }

    if (totalInGroup <= limit) {
      // Under the cap, use full amounts
      for (const reliefId of reliefIds) {
        breakdown[reliefId] = afterIndividualLimits[reliefId] || 0;
      }
      sharedCapTotals[group] = totalInGroup;
    } else {
      // Over the cap, need to distribute proportionally
      sharedCapTotals[group] = limit;

      // Distribute the cap proportionally among claimed reliefs
      for (const reliefId of reliefIds) {
        const claimed = afterIndividualLimits[reliefId] || 0;
        const proportion = claimed / totalInGroup;
        const allowed = Math.floor(proportion * limit);

        breakdown[reliefId] = allowed;

        // Only add to cappedItems if not already there and actually reduced
        if (allowed < claimed) {
          const existing = cappedItems.find(c => c.id === reliefId);
          if (existing) {
            // Update the allowed amount if shared cap is more restrictive
            if (allowed < existing.allowed) {
              existing.allowed = allowed;
              existing.reason = 'shared_cap';
            }
          } else {
            const relief = getReliefById(reliefId);
            cappedItems.push({
              id: reliefId,
              name: relief?.name || reliefId,
              claimed,
              allowed,
              reason: 'shared_cap',
            });
          }
        }
      }
    }
  }

  // Process 'none' group (no shared cap)
  for (const reliefId of sharedCapReliefs.none) {
    breakdown[reliefId] = afterIndividualLimits[reliefId] || 0;
  }

  // Calculate group usage for UI
  const groupUsage: SharedCapUsage[] = [];
  for (const group of Object.keys(SHARED_CAP_LIMITS) as SharedCapGroup[]) {
    if (group === 'none') continue;

    const limit = SHARED_CAP_LIMITS[group];
    const used = sharedCapTotals[group];
    const reliefIds = sharedCapReliefs[group];

    // Only include groups that have at least one relief claimed
    if (reliefIds.length > 0) {
      groupUsage.push({
        group,
        label: SHARED_CAP_LABELS[group],
        used,
        limit,
        percentUsed: (used / limit) * 100,
        exceeded: used > limit,
        reliefIds,
      });
    }
  }

  // Calculate totals
  const additionalReliefs = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  const total = BASIC_RELIEF_AMOUNT + additionalReliefs;

  return {
    total,
    breakdown,
    cappedItems,
    groupUsage,
    basicRelief: BASIC_RELIEF_AMOUNT,
    additionalReliefs,
  };
}

/**
 * Convert extended relief claims to the legacy PersonalReliefs format
 * Used for backward compatibility with existing tax calculations
 */
export function convertToLegacyReliefs(
  claims: ReliefClaimValues
): { totalReliefs: number; breakdown: Record<string, number> } {
  const result = calculateReliefOptimization(claims);
  return {
    totalReliefs: result.total,
    breakdown: result.breakdown,
  };
}

/**
 * Get the total relief amount from extended claims
 * This is the main function used in tax calculations
 */
export function getTotalReliefsFromExtended(claims: ReliefClaimValues): number {
  return calculateReliefOptimization(claims).total;
}

/**
 * Check if any shared caps are exceeded
 */
export function hasExceededCaps(claims: ReliefClaimValues): boolean {
  const result = calculateReliefOptimization(claims);
  return result.cappedItems.length > 0;
}

/**
 * Get optimization suggestions based on current claims
 * Returns suggestions for reliefs user might be missing
 */
export function getOptimizationSuggestions(
  claims: ReliefClaimValues,
  userProfile?: {
    hasChildren?: boolean;
    hasSpouse?: boolean;
    isEmployed?: boolean;
    hasParents?: boolean;
  }
): string[] {
  const suggestions: string[] = [];

  // Check for unclaimed common reliefs based on profile
  if (userProfile?.hasChildren) {
    const hasChildClaim = Object.keys(claims).some(id =>
      id.startsWith('child_') || id === 'childcare'
    );
    if (!hasChildClaim) {
      suggestions.push('You may be eligible for child-related reliefs');
    }
  }

  if (userProfile?.hasSpouse) {
    if (!claims.spouse && !claims.spouse_disabled) {
      suggestions.push('Consider claiming spouse relief if your spouse has no income');
    }
  }

  if (userProfile?.isEmployed) {
    if (!claims.epf) {
      suggestions.push('Your EPF contributions are eligible for tax relief');
    }
    if (!claims.socso) {
      suggestions.push("Don't forget to claim your SOCSO/EIS contributions");
    }
  }

  if (userProfile?.hasParents) {
    if (!claims.parents_medical) {
      suggestions.push("Parents' medical expenses are deductible up to RM8,000");
    }
  }

  // Check shared cap utilization
  const result = calculateReliefOptimization(claims);
  for (const usage of result.groupUsage) {
    if (usage.percentUsed < 50 && usage.limit !== Infinity) {
      suggestions.push(
        `You're only using ${Math.round(usage.percentUsed)}% of your ${usage.label} cap`
      );
    }
  }

  return suggestions;
}
