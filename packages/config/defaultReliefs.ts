/**
 * Default Personal Tax Reliefs (Malaysia)
 * Common reliefs for individuals
 * 
 * Source: LHDN Malaysia
 *
 * NOTE: This module now derives limits from taxYears.ts (single source of truth).
 * The exported constants are for backward compatibility.
 */

import { getCurrentTaxYear } from './taxYears';

export interface PersonalReliefs {
  basic: number; // Basic relief
  epfAndLifeInsurance: number; // EPF + Life Insurance (combined max)
  medical: number; // Medical insurance/expenses
  spouse?: number; // Spouse relief (if spouse has no income)
  children?: number; // Children relief (per child, max varies)
  education?: number; // Education/medical expenses for children
  [key: string]: number | undefined; // Allow for additional reliefs
}

/**
 * Get relief limits for the current tax year
 * This is the authoritative source - use this in new code
 */
export function getReliefLimits() {
  return getCurrentTaxYear().personal.reliefLimits;
}

/**
 * Default reliefs used in calculations (current tax year)
 * Based on common reliefs for typical taxpayers
 * 
 * - Basic relief: from tax year config (mandatory)
 * - EPF/Life Insurance: from tax year config (max combined)
 * - Medical: from tax year config
 * 
 * Note: Other reliefs (spouse, children, etc.) can be added but are not included
 * in default calculation as they vary by individual circumstances
 */
export const DEFAULT_RELIEFS: PersonalReliefs = (() => {
  const limits = getReliefLimits();
  return {
    basic: limits.basic,
    epfAndLifeInsurance: limits.epfAndLifeInsurance,
    medical: limits.medical,
  };
})();

/**
 * Calculate total reliefs from relief profile
 * 
 * @param reliefs - Relief profile object
 * @returns Total relief amount
 */
export function calculateTotalReliefs(reliefs: PersonalReliefs): number {
  return Object.values(reliefs).reduce((sum: number, value) => {
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
}

/**
 * Get default reliefs (can be overridden by user input)
 * 
 * @returns Default relief profile
 */
export function getDefaultReliefs(): PersonalReliefs {
  return { ...DEFAULT_RELIEFS };
}

/**
 * Common relief limits for reference (current tax year)
 * @deprecated Use getReliefLimits() for new code to support multiple tax years
 */
export const RELIEF_LIMITS = (() => {
  const limits = getReliefLimits();
  return {
    basic: limits.basic,
    epfAndLifeInsurance: limits.epfAndLifeInsurance,
    medical: limits.medical,
    spouse: limits.spouse,
    children: limits.children,
    education: limits.education,
  } as const;
})();
