/**
 * Tax Year Configuration — validates LHDN rate accuracy
 *
 * These tests verify the tax brackets, EPF rates, SOCSO caps, and SME criteria
 * match the official Malaysian tax authority (LHDN/PERKESO) published rates.
 */
import { describe, it, expect } from 'vitest';
import { getCurrentTaxYear, getTaxYear, getAvailableTaxYears } from '../taxYears';

const config = getCurrentTaxYear();

describe('Tax Year Configuration', () => {
  it('has at least one available tax year', () => {
    expect(getAvailableTaxYears().length).toBeGreaterThan(0);
  });

  it('current tax year is retrievable', () => {
    expect(config).toBeDefined();
    expect(config.yearAssessment).toBe('YA2024-2025');
  });

  it('getTaxYear returns undefined for unknown year', () => {
    expect(getTaxYear('YA1900')).toBeUndefined();
  });
});

describe('Personal tax brackets — LHDN YA2024-2025 accuracy', () => {
  const b = config.personal.brackets;

  it('has 10 brackets', () => {
    expect(b.length).toBe(10);
  });

  it('first bracket is 0% up to RM5,000', () => {
    expect(b[0]).toEqual({ min: 0, max: 5000, rate: 0 });
  });

  it('bracket at RM100k-400k is 25% (not 26%)', () => {
    const bracket = b.find(br => br.min === 100000);
    expect(bracket?.max).toBe(400000);
    expect(bracket?.rate).toBe(0.25);
  });

  it('bracket at RM400k-600k is 26%', () => {
    const bracket = b.find(br => br.min === 400000);
    expect(bracket?.max).toBe(600000);
    expect(bracket?.rate).toBe(0.26);
  });

  it('bracket at RM600k-2M is 28%', () => {
    const bracket = b.find(br => br.min === 600000);
    expect(bracket?.max).toBe(2000000);
    expect(bracket?.rate).toBe(0.28);
  });

  it('top bracket above RM2M is 30%', () => {
    const top = b[b.length - 1];
    expect(top.min).toBe(2000000);
    expect(top.max).toBeNull();
    expect(top.rate).toBe(0.30);
  });

  it('brackets are contiguous (no gaps)', () => {
    for (let i = 1; i < b.length; i++) {
      expect(b[i].min).toBe(b[i - 1].max);
    }
  });

  it('rates are monotonically non-decreasing', () => {
    for (let i = 1; i < b.length; i++) {
      expect(b[i].rate).toBeGreaterThanOrEqual(b[i - 1].rate);
    }
  });
});

describe('EPF configuration accuracy', () => {
  const epf = config.epf;

  it('employee rate is 11%', () => {
    expect(epf.employeeRate).toBe(0.11);
  });

  it('employer rate below threshold is 13%', () => {
    expect(epf.employerRateLow).toBe(0.13);
  });

  it('employer rate above threshold is 12%', () => {
    expect(epf.employerRateHigh).toBe(0.12);
  });

  it('salary threshold is RM5,000', () => {
    expect(epf.salaryThreshold).toBe(5000);
  });
});

describe('SOCSO configuration accuracy', () => {
  const socso = config.socso;

  it('wage threshold is RM6,000 (post Oct 2024)', () => {
    expect(socso.wageThreshold).toBe(6000);
  });

  it('EIS wage cap is RM6,000 (post Oct 2024)', () => {
    expect(socso.eisWageCap).toBe(6000);
  });

  it('EIS rates are 0.2% each', () => {
    expect(socso.eisEmployerRate).toBe(0.002);
    expect(socso.eisEmployeeRate).toBe(0.002);
  });
});

describe('SME criteria accuracy', () => {
  const sme = config.corporate.smeCriteria;

  it('max paid-up capital is RM2.5M', () => {
    expect(sme.maxPaidUpCapital).toBe(2_500_000);
  });

  it('max gross income is RM50M', () => {
    expect(sme.maxGrossIncome).toBe(50_000_000);
  });

  it('max related company share is 20% (not 50%)', () => {
    expect(sme.maxRelatedCompanyShare).toBe(20);
  });
});

describe('Relief limits', () => {
  const r = config.personal.reliefLimits;

  it('basic relief is RM9,000', () => {
    expect(r.basic).toBe(9000);
  });

  it('EPF + life insurance combined is RM7,000', () => {
    expect(r.epfAndLifeInsurance).toBe(7000);
  });

  it('medical is RM8,000', () => {
    expect(r.medical).toBe(8000);
  });
});
