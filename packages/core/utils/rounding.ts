/**
 * Utility functions for rounding financial values
 * 
 * NOTE: These functions now use Money internally for consistent precision.
 * For new code, prefer using Money class directly.
 */

import { Money } from './money';

/**
 * Round a number to currency precision (2 decimal places)
 * Uses Money internally for consistent rounding
 */
export function roundCurrency(value: number): number {
  if (!isFinite(value)) {
    return value;
  }
  return Money.fromDollars(value).toDollars();
}

/**
 * Round a number to percentage precision (4 decimal places)
 * For percentages, we keep more precision than currency
 */
export function roundPercentage(value: number): number {
  if (!isFinite(value)) {
    return value;
  }
  return Math.round(value * 10000) / 10000;
}

/**
 * Safely check if a number is valid and finite
 */
export function isValidNumber(value: number): boolean {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

/**
 * Safely check if a number is non-negative
 */
export function isNonNegative(value: number): boolean {
  return isValidNumber(value) && value >= 0;
}

