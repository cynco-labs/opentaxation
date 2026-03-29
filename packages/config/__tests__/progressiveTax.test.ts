/**
 * Progressive Tax Calculator — comprehensive unit tests
 *
 * Tests calculateProgressiveTax, getProgressiveTaxBreakdown,
 * calculateProgressiveTaxWithBreakdown for Malaysian personal + corporate brackets.
 */
import { describe, it, expect } from 'vitest';
import {
  calculateProgressiveTax,
  getProgressiveTaxBreakdown,
  calculateProgressiveTaxWithBreakdown,
  type TaxBracket,
} from '../progressiveTax';
import { getCurrentTaxYear } from '../taxYears';

const personalBrackets = getCurrentTaxYear().personal.brackets;
const smeBrackets = getCurrentTaxYear().corporate.smeBrackets;

// ─── calculateProgressiveTax — happy path ─────────────────────────────

describe('calculateProgressiveTax', () => {
  it('returns 0 for zero income', () => {
    expect(calculateProgressiveTax(0, personalBrackets)).toBe(0);
  });

  it('returns 0 for income in the 0% bracket (RM5,000)', () => {
    expect(calculateProgressiveTax(5000, personalBrackets)).toBe(0);
  });

  it('taxes RM10,000 at 1% on RM5,000 above the 0% bracket = RM50', () => {
    // RM0-5000: 0% = 0, RM5001-10000: 1% on 5000 = 50
    expect(calculateProgressiveTax(10000, personalBrackets)).toBe(50);
  });

  it('taxes RM100,000 correctly across 6 brackets', () => {
    // 0-5k: 0, 5-20k: 150, 20-35k: 450, 35-50k: 900, 50-70k: 2200, 70-100k: 5700
    const expected = 0 + 150 + 450 + 900 + 2200 + 5700;
    expect(calculateProgressiveTax(100000, personalBrackets)).toBe(expected);
  });

  it('taxes RM500,000 correctly including the 25% and 26% brackets', () => {
    // 0-5k: 0, 5-20k: 150, 20-35k: 450, 35-50k: 900, 50-70k: 2200
    // 70-100k: 5700, 100-400k: 75000, 400-500k: 26000
    const expected = 0 + 150 + 450 + 900 + 2200 + 5700 + 75000 + 26000;
    expect(calculateProgressiveTax(500000, personalBrackets)).toBe(expected);
  });

  it('taxes income above RM2M at 30%', () => {
    const tax2M = calculateProgressiveTax(2000000, personalBrackets);
    const tax2_1M = calculateProgressiveTax(2100000, personalBrackets);
    // Extra 100k at 30% = 30000
    expect(tax2_1M - tax2M).toBe(30000);
  });

  it('uses SME corporate brackets correctly', () => {
    // RM100k at 15% = 15000
    expect(calculateProgressiveTax(100000, smeBrackets)).toBe(15000);
    // RM200k: 150k at 15% + 50k at 17% = 22500 + 8500 = 31000
    expect(calculateProgressiveTax(200000, smeBrackets)).toBe(31000);
  });

  // ─── Edge cases ───────────────────────────────────────────────────

  it('returns 0 for negative income', () => {
    expect(calculateProgressiveTax(-50000, personalBrackets)).toBe(0);
  });

  it('returns 0 for empty brackets array', () => {
    expect(calculateProgressiveTax(100000, [])).toBe(0);
  });

  it('handles single flat-rate bracket', () => {
    const flat: TaxBracket[] = [{ min: 0, max: null, rate: 0.10 }];
    expect(calculateProgressiveTax(100000, flat)).toBe(10000);
  });

  it('handles income exactly at a bracket boundary', () => {
    // RM20,000 is exact boundary between 1% and 3% brackets
    const tax = calculateProgressiveTax(20000, personalBrackets);
    // 0-5k: 0, 5-20k: 150 = 150
    expect(tax).toBe(150);
  });

  it('handles very small income (RM1)', () => {
    expect(calculateProgressiveTax(1, personalBrackets)).toBe(0);
  });

  it('handles very large income (RM100M)', () => {
    const tax = calculateProgressiveTax(100_000_000, personalBrackets);
    expect(tax).toBeGreaterThan(0);
    // Effective rate should approach 30% for very high income
    expect(tax / 100_000_000).toBeGreaterThan(0.29);
  });
});

// ─── calculateProgressiveTaxWithBreakdown ─────────────────────────────

describe('calculateProgressiveTaxWithBreakdown', () => {
  it('returns empty breakdown for zero income', () => {
    const result = calculateProgressiveTaxWithBreakdown(0, personalBrackets);
    expect(result.tax).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });

  it('breakdown sum equals the total tax exactly', () => {
    const testAmounts = [10000, 50000, 100000, 300000, 500000, 1000000, 2500000];

    for (const amount of testAmounts) {
      const result = calculateProgressiveTaxWithBreakdown(amount, personalBrackets);
      const breakdownSum = result.breakdown.reduce((s, b) => s + b.taxForBracket, 0);
      // Breakdown sum must match total tax to 2 decimal places
      expect(Math.round(breakdownSum * 100) / 100).toBe(result.tax);
    }
  });

  it('calculateProgressiveTax matches calculateProgressiveTaxWithBreakdown.tax', () => {
    // This verifies our rounding fix: both functions must return identical values
    const testAmounts = [7777.77, 33333.33, 99999.99, 250001, 600001, 2000001];

    for (const amount of testAmounts) {
      const standalone = calculateProgressiveTax(amount, personalBrackets);
      const withBreakdown = calculateProgressiveTaxWithBreakdown(amount, personalBrackets);
      expect(standalone).toBe(withBreakdown.tax);
    }
  });

  it('each breakdown item has correct bracket boundaries', () => {
    const result = calculateProgressiveTaxWithBreakdown(100000, personalBrackets);
    expect(result.breakdown[0].bracketMin).toBe(0);
    expect(result.breakdown[0].bracketMax).toBe(5000);
    expect(result.breakdown[0].rate).toBe(0);
    expect(result.breakdown[0].amountInBracket).toBe(5000);
    expect(result.breakdown[0].taxForBracket).toBe(0);
  });

  it('does not include brackets beyond taxable amount', () => {
    const result = calculateProgressiveTaxWithBreakdown(10000, personalBrackets);
    // Should only include 0% and 1% brackets
    expect(result.breakdown.length).toBe(2);
    expect(result.breakdown[1].rate).toBe(0.01);
  });
});

// ─── getProgressiveTaxBreakdown ───────────────────────────────────────

describe('getProgressiveTaxBreakdown', () => {
  it('returns empty array for zero income', () => {
    expect(getProgressiveTaxBreakdown(0, personalBrackets)).toHaveLength(0);
  });

  it('returns empty array for negative income', () => {
    expect(getProgressiveTaxBreakdown(-1000, personalBrackets)).toHaveLength(0);
  });

  it('breakdown matches calculateProgressiveTaxWithBreakdown', () => {
    const amount = 150000;
    const standalone = getProgressiveTaxBreakdown(amount, personalBrackets);
    const combined = calculateProgressiveTaxWithBreakdown(amount, personalBrackets);

    expect(standalone.length).toBe(combined.breakdown.length);
    for (let i = 0; i < standalone.length; i++) {
      expect(standalone[i].taxForBracket).toBe(combined.breakdown[i].taxForBracket);
      expect(standalone[i].amountInBracket).toBe(combined.breakdown[i].amountInBracket);
    }
  });
});
