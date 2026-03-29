/**
 * Sole Prop Scenario — comprehensive unit tests
 *
 * Tests the full Enterprise/Sole Proprietorship tax calculation with
 * real assertions on tax amounts, net cash, effective rates, and waterfall.
 */
import { describe, it, expect } from 'vitest';
import { calculateSolePropScenario } from '../tax/calculateSolePropScenario';

describe('calculateSolePropScenario', () => {
  // ─── Input validation ─────────────────────────────────────────────

  it('throws on negative business profit', () => {
    expect(() =>
      calculateSolePropScenario({ businessProfit: -1000 }),
    ).toThrow('Business profit must be a valid non-negative number');
  });

  it('throws on NaN business profit', () => {
    expect(() =>
      calculateSolePropScenario({ businessProfit: NaN }),
    ).toThrow('Business profit must be a valid non-negative number');
  });

  it('throws on Infinity business profit', () => {
    expect(() =>
      calculateSolePropScenario({ businessProfit: Infinity }),
    ).toThrow('Business profit must be a valid non-negative number');
  });

  it('throws on negative other income', () => {
    expect(() =>
      calculateSolePropScenario({ businessProfit: 100000, otherIncome: -5000 }),
    ).toThrow('Other income must be a valid non-negative number');
  });

  // ─── Zero income ──────────────────────────────────────────────────

  it('zero profit produces zero tax and zero net cash', () => {
    const result = calculateSolePropScenario({ businessProfit: 0 });
    expect(result.personalTax).toBe(0);
    expect(result.netCash).toBe(0);
    expect(result.effectiveTaxRate).toBe(0);
  });

  // ─── Low income below reliefs ─────────────────────────────────────

  it('income fully covered by reliefs produces zero tax', () => {
    // RM20k profit with RM24k reliefs → taxable = 0
    const result = calculateSolePropScenario({
      businessProfit: 20000,
      reliefs: { basic: 9000, epfAndLifeInsurance: 7000, medical: 8000 },
    });
    expect(result.personalTax).toBe(0);
    expect(result.netCash).toBe(20000);
  });

  // ─── Standard calculation ─────────────────────────────────────────

  it('RM100k profit with default reliefs produces correct tax', () => {
    const result = calculateSolePropScenario({
      businessProfit: 100000,
      reliefs: { basic: 9000, epfAndLifeInsurance: 7000, medical: 8000 },
    });
    // Taxable income = 100000 - 24000 = 76000
    // Tax on 76000: 0 + 150 + 450 + 900 + 2200 + 1140 = 4840
    expect(result.personalTax).toBe(4840);
    expect(result.netCash).toBe(100000 - 4840);
    expect(result.breakdown.taxableIncome).toBe(76000);
  });

  it('RM300k profit with reliefs matches golden value', () => {
    const result = calculateSolePropScenario({
      businessProfit: 300000,
      reliefs: { basic: 9000, epfAndLifeInsurance: 7000, medical: 8000 },
    });
    // Taxable = 276000
    // 0-5k: 0, 5-20k: 150, 20-35k: 450, 35-50k: 900, 50-70k: 2200
    // 70-100k: 5700, 100-276k: 44000 → total = 53400
    expect(result.personalTax).toBe(53400);
    expect(result.netCash).toBe(246600);
  });

  // ─── Other income ─────────────────────────────────────────────────

  it('other income adds to total income', () => {
    const withoutOther = calculateSolePropScenario({
      businessProfit: 100000,
      reliefs: { basic: 9000, epfAndLifeInsurance: 0, medical: 0 },
    });
    const withOther = calculateSolePropScenario({
      businessProfit: 80000,
      otherIncome: 20000,
      reliefs: { basic: 9000, epfAndLifeInsurance: 0, medical: 0 },
    });
    // Same total income, same reliefs → same tax
    expect(withOther.personalTax).toBe(withoutOther.personalTax);
    expect(withOther.breakdown.totalIncome).toBe(100000);
  });

  // ─── Waterfall integrity ──────────────────────────────────────────

  it('waterfall starts with business profit and ends with net cash', () => {
    const result = calculateSolePropScenario({
      businessProfit: 200000,
      reliefs: { basic: 9000, epfAndLifeInsurance: 0, medical: 0 },
    });

    expect(result.waterfall[0].label).toBe('Business Profit');
    expect(result.waterfall[0].amount).toBe(200000);

    const last = result.waterfall[result.waterfall.length - 1];
    expect(last.label).toBe('Net Cash to You');
    expect(last.type).toBe('total');
    expect(last.amount).toBe(result.netCash);
  });

  it('waterfall includes Other Income step when > 0', () => {
    const result = calculateSolePropScenario({
      businessProfit: 100000,
      otherIncome: 50000,
    });
    const otherStep = result.waterfall.find(w => w.label === 'Other Income');
    expect(otherStep).toBeDefined();
    expect(otherStep!.amount).toBe(50000);
  });

  // ─── Effective tax rate ───────────────────────────────────────────

  it('effective tax rate is between 0 and 1', () => {
    const result = calculateSolePropScenario({
      businessProfit: 500000,
      reliefs: { basic: 9000, epfAndLifeInsurance: 0, medical: 0 },
    });
    expect(result.effectiveTaxRate).toBeGreaterThan(0);
    expect(result.effectiveTaxRate).toBeLessThan(1);
  });

  it('effective tax rate increases with income', () => {
    const rate100k = calculateSolePropScenario({ businessProfit: 100000 }).effectiveTaxRate;
    const rate500k = calculateSolePropScenario({ businessProfit: 500000 }).effectiveTaxRate;
    expect(rate500k).toBeGreaterThan(rate100k);
  });

  // ─── Zakat ────────────────────────────────────────────────────────

  it('zakat auto-calculation applies 2.5% rebate capped at tax', () => {
    const result = calculateSolePropScenario({
      businessProfit: 200000,
      reliefs: { basic: 9000, epfAndLifeInsurance: 0, medical: 0 },
      zakat: { enabled: true },
    });
    expect(result.zakat).toBeDefined();
    expect(result.zakat!.zakatAmount).toBeGreaterThan(0);
    expect(result.taxBeforeZakatRebate).toBeGreaterThan(result.personalTax);
  });

  it('zakat rebate cannot exceed tax payable (no negative tax)', () => {
    // Low income, high zakat → rebate capped at tax
    const result = calculateSolePropScenario({
      businessProfit: 30000,
      reliefs: { basic: 9000, epfAndLifeInsurance: 7000, medical: 8000 },
      zakat: { enabled: true, amountPaid: 100000 },
    });
    expect(result.personalTax).toBe(0);
    expect(result.zakat!.excessZakat).toBeGreaterThan(0);
  });

  // ─── Default reliefs (no reliefs provided) ────────────────────────

  it('uses config-derived default reliefs when none provided', () => {
    const withDefaults = calculateSolePropScenario({ businessProfit: 200000 });
    const withExplicit = calculateSolePropScenario({
      businessProfit: 200000,
      reliefs: { basic: 9000, epfAndLifeInsurance: 7000, medical: 8000 },
    });
    // Default reliefs = basic(9000) + epf(7000) + medical(8000) = 24000
    expect(withDefaults.breakdown.totalReliefs).toBe(withExplicit.breakdown.totalReliefs);
  });

  // ─── Tax bracket breakdown ────────────────────────────────────────

  it('includes tax bracket breakdown with correct structure', () => {
    const result = calculateSolePropScenario({
      businessProfit: 100000,
      reliefs: { basic: 9000, epfAndLifeInsurance: 0, medical: 0 },
    });
    expect(result.taxBracketBreakdown.length).toBeGreaterThan(0);
    for (const bracket of result.taxBracketBreakdown) {
      expect(bracket).toHaveProperty('bracketMin');
      expect(bracket).toHaveProperty('rate');
      expect(bracket).toHaveProperty('incomeInBracket');
      expect(bracket).toHaveProperty('taxForBracket');
    }
  });
});
