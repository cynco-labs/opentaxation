/**
 * Malaysia Dividend Tax Rules
 * 
 * Individual taxpayers receiving dividend income exceeding a threshold
 * annually are subject to an additional surcharge on the excess amount.
 * 
 * Source: Budget 2025, LHDN Malaysia
 *
 * NOTE: This module now derives rates from taxYears.ts (single source of truth).
 * The exported constants are for backward compatibility.
 */

import { getCurrentTaxYear } from './taxYears';

/**
 * Get dividend tax configuration for the current tax year
 * This is the authoritative source - use this in new code
 */
export function getDividendConfig() {
  return getCurrentTaxYear().dividend;
}

/**
 * Calculate dividend tax for individuals
 * 
 * @param dividendAmount - Total dividend income received
 * @returns Tax amount (surcharge rate on excess above threshold)
 */
export function calculateDividendTax(dividendAmount: number): number {
  const config = getDividendConfig();
  if (dividendAmount <= config.threshold) {
    return 0;
  }

  const excessAmount = dividendAmount - config.threshold;
  const tax = excessAmount * config.surchargeRate;

  return Math.round(tax * 100) / 100;
}

/**
 * Dividend tax threshold (current tax year)
 * @deprecated Use getDividendConfig() for new code to support multiple tax years
 */
export const DIVIDEND_TAX_THRESHOLD = (() => getDividendConfig().threshold)();

/**
 * Dividend tax rate (on excess above threshold) (current tax year)
 * @deprecated Use getDividendConfig() for new code to support multiple tax years
 */
export const DIVIDEND_TAX_RATE = (() => getDividendConfig().surchargeRate)();

