/**
 * Malaysia SME Corporate Tax Brackets
 * For resident companies with revenue < RM50M and meeting shareholding requirements
 *
 * Progressive tax brackets:
 * - First RM150,000: 15%
 * - Next RM450,000 (RM150,001-RM600,000): 17%
 * - Above RM600,000: 24%
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

// Re-export as CorporateTaxBracket for backward compatibility
export type CorporateTaxBracket = TaxBracket;

/**
 * Get corporate SME tax brackets for the current tax year
 * This is the authoritative source - use this in new code
 */
export function getCorporateTaxBrackets(): CorporateTaxBracket[] {
  return getCurrentTaxYear().corporate.smeBrackets;
}

/**
 * Corporate tax brackets for the current tax year
 * @deprecated Use getCorporateTaxBrackets() for new code to support multiple tax years
 */
export const CORPORATE_TAX_BRACKETS: CorporateTaxBracket[] = getCorporateTaxBrackets();

/**
 * Calculate corporate tax for SME companies
 * Uses current tax year brackets
 */
export function calculateCorporateTaxFromBrackets(taxableProfit: number): number {
  return calculateProgressiveTax(taxableProfit, getCorporateTaxBrackets());
}

/**
 * Tax bracket breakdown with corporate-tax-specific field names
 */
export interface CorporateTaxBracketBreakdownItem {
  bracketMin: number;
  bracketMax: number | null;
  rate: number;
  profitInBracket: number;
  taxForBracket: number;
}

/**
 * Get detailed breakdown of how corporate tax is calculated across SME brackets
 * Shows exactly how much profit falls into each tier and the tax for each
 */
export function getCorporateTaxBracketBreakdown(
  taxableProfit: number
): CorporateTaxBracketBreakdownItem[] {
  const breakdown = getProgressiveTaxBreakdown(taxableProfit, getCorporateTaxBrackets());

  // Map to corporate-tax-specific field names for backward compatibility
  return breakdown.map((item: TaxBracketBreakdownItem) => ({
    bracketMin: item.bracketMin,
    bracketMax: item.bracketMax,
    rate: item.rate,
    profitInBracket: item.amountInBracket,
    taxForBracket: item.taxForBracket,
  }));
}
