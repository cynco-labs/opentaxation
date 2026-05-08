import { calculateCorporateTaxFromBrackets } from '@tax-engine/config';
import { roundCurrency, roundPercentage, isNonNegative } from '../utils/rounding';

export function calculateCorporateTax(
  taxableProfit: number,
  options?: { forceStandardRate?: boolean }
): {
  tax: number;
  effectiveRate: number;
} {
  if (!isNonNegative(taxableProfit)) {
    throw new Error('Taxable profit must be a valid non-negative number');
  }

  const tax = options?.forceStandardRate
    ? Math.max(0, taxableProfit * 0.24)
    : calculateCorporateTaxFromBrackets(taxableProfit);
  const effectiveRate = taxableProfit > 0 ? tax / taxableProfit : 0;

  return {
    tax: roundCurrency(tax),
    effectiveRate: roundPercentage(effectiveRate),
  };
}
