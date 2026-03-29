/**
 * Generic Progressive Tax Calculator
 *
 * This utility provides a reusable implementation for calculating
 * progressive (tiered) taxes used by both personal and corporate tax systems.
 */

/**
 * Generic tax bracket definition
 */
export interface TaxBracket {
  min: number;
  max: number | null; // null means no upper limit
  rate: number;
}

/**
 * Breakdown item showing how income is taxed in each tier
 */
export interface TaxBracketBreakdownItem {
  bracketMin: number;
  bracketMax: number | null;
  rate: number;
  amountInBracket: number; // Generic name for income/profit in bracket
  taxForBracket: number;
}

/**
 * Result of a tax calculation
 */
export interface ProgressiveTaxResult {
  tax: number;
  breakdown: TaxBracketBreakdownItem[];
}

/**
 * Calculate tax using progressive brackets
 *
 * Delegates to calculateProgressiveTaxWithBreakdown to ensure the total
 * always matches the sum of individual bracket taxes shown to users.
 *
 * @param taxableAmount - The taxable income or profit
 * @param brackets - The tax brackets to apply
 * @returns Total tax rounded to 2 decimal places
 */
export function calculateProgressiveTax(
  taxableAmount: number,
  brackets: readonly TaxBracket[]
): number {
  return calculateProgressiveTaxWithBreakdown(taxableAmount, brackets).tax;
}

/**
 * Get detailed breakdown of how tax is calculated across brackets
 *
 * Shows exactly how much taxable amount falls into each tier
 * and the tax calculated for each.
 *
 * @param taxableAmount - The taxable income or profit
 * @param brackets - The tax brackets to apply
 * @returns Array of breakdown items for each applicable bracket
 */
export function getProgressiveTaxBreakdown(
  taxableAmount: number,
  brackets: readonly TaxBracket[]
): TaxBracketBreakdownItem[] {
  if (taxableAmount <= 0) return [];

  const breakdown: TaxBracketBreakdownItem[] = [];

  for (const bracket of brackets) {
    // taxableAmount is the cumulative total — compare against bracket floor
    if (taxableAmount <= bracket.min) break;

    const bracketMax = bracket.max ?? Infinity;

    const amountInBracket = Math.min(
      taxableAmount - bracket.min,
      bracketMax - bracket.min
    );

    if (amountInBracket > 0) {
      const taxForBracket = Math.round(amountInBracket * bracket.rate * 100) / 100;

      breakdown.push({
        bracketMin: bracket.min,
        bracketMax: bracket.max,
        rate: bracket.rate,
        amountInBracket: Math.round(amountInBracket * 100) / 100,
        taxForBracket,
      });
    }
  }

  return breakdown;
}

/**
 * Calculate both tax and breakdown in a single pass
 *
 * More efficient when you need both the total tax and the breakdown.
 *
 * @param taxableAmount - The taxable income or profit
 * @param brackets - The tax brackets to apply
 * @returns Object containing total tax and breakdown array
 */
export function calculateProgressiveTaxWithBreakdown(
  taxableAmount: number,
  brackets: readonly TaxBracket[]
): ProgressiveTaxResult {
  if (taxableAmount <= 0) {
    return { tax: 0, breakdown: [] };
  }

  const breakdown: TaxBracketBreakdownItem[] = [];
  let tax = 0;

  for (const bracket of brackets) {
    if (taxableAmount <= bracket.min) break;

    const bracketMax = bracket.max ?? Infinity;

    const amountInBracket = Math.min(
      taxableAmount - bracket.min,
      bracketMax - bracket.min
    );

    if (amountInBracket > 0) {
      const taxForBracket = Math.round(amountInBracket * bracket.rate * 100) / 100;
      tax += taxForBracket;

      breakdown.push({
        bracketMin: bracket.min,
        bracketMax: bracket.max,
        rate: bracket.rate,
        amountInBracket: Math.round(amountInBracket * 100) / 100,
        taxForBracket,
      });
    }
  }

  return {
    tax: Math.round(tax * 100) / 100,
    breakdown,
  };
}
