/**
 * Malaysia Personal Income Tax Brackets
 * Source: LHDN Malaysia
 *
 * Progressive tax brackets - each bracket applies only to income within that range
 * Example: RM25,000 taxable income
 * - RM0-RM5,000: 0% = RM0
 * - RM5,001-RM20,000: 1% = RM150
 * - RM20,001-RM25,000: 3% = RM150
 * Total tax = RM300
 *
 * NOTE: This module now derives brackets from taxYears.ts (single source of truth).
 * The exported constants are for backward compatibility.
 */

import {
  type TaxBracket,
  type TaxBracketBreakdownItem,
  calculateProgressiveTax,
  getProgressiveTaxBreakdown,
} from './progressiveTax';
import { getCurrentTaxYear } from './taxYears';

// Re-export TaxBracket for backward compatibility
export type { TaxBracket };

/**
 * Get personal tax brackets for the current tax year
 * This is the authoritative source - use this in new code
 */
export function getPersonalTaxBrackets(): TaxBracket[] {
  return getCurrentTaxYear().personal.brackets;
}

/**
 * Personal tax brackets for the current tax year
 * @deprecated Use getPersonalTaxBrackets() for new code to support multiple tax years
 */
export const PERSONAL_TAX_BRACKETS: TaxBracket[] = getPersonalTaxBrackets();

/**
 * Calculate personal tax using progressive brackets
 * Uses current tax year brackets
 */
export function calculatePersonalTaxFromBrackets(taxableIncome: number): number {
  return calculateProgressiveTax(taxableIncome, getPersonalTaxBrackets());
}

/**
 * Tax bracket breakdown with personal-tax-specific field names
 */
export interface PersonalTaxBracketBreakdownItem {
  bracketMin: number;
  bracketMax: number | null;
  rate: number;
  incomeInBracket: number;
  taxForBracket: number;
}

// Re-export for backward compatibility
export type { TaxBracketBreakdownItem };

/**
 * Get detailed breakdown of how personal tax is calculated across brackets
 * Shows exactly how much income falls into each tier and the tax for each
 */
export function getPersonalTaxBracketBreakdown(
  taxableIncome: number
): PersonalTaxBracketBreakdownItem[] {
  const breakdown = getProgressiveTaxBreakdown(taxableIncome, getPersonalTaxBrackets());

  // Map to personal-tax-specific field names for backward compatibility
  return breakdown.map((item: TaxBracketBreakdownItem) => ({
    bracketMin: item.bracketMin,
    bracketMax: item.bracketMax,
    rate: item.rate,
    incomeInBracket: item.amountInBracket,
    taxForBracket: item.taxForBracket,
  }));
}

/**
 * Reverse calculation: Given a target net cash, find the required gross income
 *
 * Uses binary search since the relationship between income and net cash is monotonic.
 *
 * @param targetNetCash - Desired annual net cash after tax
 * @param totalReliefs - Total personal reliefs to apply
 * @returns Required gross income (business profit + other income)
 */
export function calculateRequiredIncomeForNetCash(
  targetNetCash: number,
  totalReliefs: number = 9000 // Default individual relief
): number {
  if (targetNetCash <= 0) return 0;

  // Binary search bounds
  let low = targetNetCash;
  let high = targetNetCash * 2;

  const tolerance = 1; // RM1 tolerance for convergence

  // Ensure high is enough for high tax scenarios
  const testHigh = high - calculatePersonalTaxFromBrackets(Math.max(0, high - totalReliefs));
  if (testHigh < targetNetCash) {
    high = targetNetCash * 3;
  }

  // Binary search
  let iterations = 0;
  const maxIterations = 50;

  while (high - low > tolerance && iterations < maxIterations) {
    const mid = (low + high) / 2;
    const taxableIncome = Math.max(0, mid - totalReliefs);
    const tax = calculatePersonalTaxFromBrackets(taxableIncome);
    const netCash = mid - tax;

    if (netCash < targetNetCash) {
      low = mid;
    } else {
      high = mid;
    }
    iterations++;
  }

  return Math.round((low + high) / 2);
}
