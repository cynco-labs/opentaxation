/**
 * Unit Tests for Validation Functions
 *
 * Tests validateInputs and sanitizeInputs for all edge cases
 */

import { describe, it, expect } from 'vitest';
import { validateInputs, sanitizeInputs } from '../validation';
import type { TaxCalculationInputs } from '../types';

describe('validateInputs', () => {
  const validInputs: TaxCalculationInputs = {
    businessProfit: 100000,
    otherIncome: 0,
  };

  describe('businessProfit validation', () => {
    it('returns no errors for valid businessProfit', () => {
      const errors = validateInputs(validInputs);
      expect(errors).toHaveLength(0);
    });

    it('returns error for negative businessProfit', () => {
      const errors = validateInputs({ ...validInputs, businessProfit: -100 });
      expect(errors).toContainEqual(
        expect.objectContaining({ field: 'businessProfit' })
      );
    });

    it('accepts zero businessProfit', () => {
      const errors = validateInputs({ ...validInputs, businessProfit: 0 });
      expect(errors.find(e => e.field === 'businessProfit')).toBeUndefined();
    });
  });

  describe('otherIncome validation', () => {
    it('returns error for negative otherIncome', () => {
      const errors = validateInputs({ ...validInputs, otherIncome: -500 });
      expect(errors).toContainEqual(
        expect.objectContaining({ field: 'otherIncome' })
      );
    });

    it('accepts zero otherIncome', () => {
      const errors = validateInputs({ ...validInputs, otherIncome: 0 });
      expect(errors.find(e => e.field === 'otherIncome')).toBeUndefined();
    });
  });

  describe('monthlySalary validation', () => {
    it('returns error for negative monthlySalary', () => {
      const errors = validateInputs({ ...validInputs, monthlySalary: -1000 });
      expect(errors).toContainEqual(
        expect.objectContaining({ field: 'monthlySalary' })
      );
    });

    it('accepts undefined monthlySalary', () => {
      const errors = validateInputs({ ...validInputs, monthlySalary: undefined });
      expect(errors.find(e => e.field === 'monthlySalary')).toBeUndefined();
    });

    it('accepts zero monthlySalary', () => {
      const errors = validateInputs({ ...validInputs, monthlySalary: 0 });
      expect(errors.find(e => e.field === 'monthlySalary')).toBeUndefined();
    });
  });

  describe('complianceCosts validation', () => {
    it('returns error for negative complianceCosts', () => {
      const errors = validateInputs({ ...validInputs, complianceCosts: -500 });
      expect(errors).toContainEqual(
        expect.objectContaining({ field: 'complianceCosts' })
      );
    });

    it('accepts undefined complianceCosts', () => {
      const errors = validateInputs({ ...validInputs, complianceCosts: undefined });
      expect(errors.find(e => e.field === 'complianceCosts')).toBeUndefined();
    });
  });

  describe('auditCost validation', () => {
    it('returns error for negative auditCost', () => {
      const errors = validateInputs({ ...validInputs, auditCost: -1000 });
      expect(errors).toContainEqual(
        expect.objectContaining({ field: 'auditCost' })
      );
    });
  });

  describe('auditCriteria validation', () => {
    it('returns error for negative revenue', () => {
      const errors = validateInputs({
        ...validInputs,
        auditCriteria: { revenue: -100, totalAssets: 1000, employees: 5 },
      });
      expect(errors).toContainEqual(
        expect.objectContaining({ field: 'auditCriteria.revenue' })
      );
    });

    it('returns error for negative totalAssets', () => {
      const errors = validateInputs({
        ...validInputs,
        auditCriteria: { revenue: 1000, totalAssets: -100, employees: 5 },
      });
      expect(errors).toContainEqual(
        expect.objectContaining({ field: 'auditCriteria.totalAssets' })
      );
    });

    it('returns error for negative employees', () => {
      const errors = validateInputs({
        ...validInputs,
        auditCriteria: { revenue: 1000, totalAssets: 1000, employees: -1 },
      });
      expect(errors).toContainEqual(
        expect.objectContaining({ field: 'auditCriteria.employees' })
      );
    });

    it('accepts valid auditCriteria', () => {
      const errors = validateInputs({
        ...validInputs,
        auditCriteria: { revenue: 1000000, totalAssets: 500000, employees: 10 },
      });
      expect(errors.filter(e => e.field.startsWith('auditCriteria'))).toHaveLength(0);
    });
  });

  describe('dividendDistributionPercent validation', () => {
    it('returns error for percentage below 0', () => {
      const errors = validateInputs({ ...validInputs, dividendDistributionPercent: -10 });
      expect(errors).toContainEqual(
        expect.objectContaining({ field: 'dividendDistributionPercent' })
      );
    });

    it('returns error for percentage above 100', () => {
      const errors = validateInputs({ ...validInputs, dividendDistributionPercent: 150 });
      expect(errors).toContainEqual(
        expect.objectContaining({ field: 'dividendDistributionPercent' })
      );
    });

    it('accepts percentage at boundaries (0 and 100)', () => {
      const errors0 = validateInputs({ ...validInputs, dividendDistributionPercent: 0 });
      const errors100 = validateInputs({ ...validInputs, dividendDistributionPercent: 100 });
      expect(errors0.find(e => e.field === 'dividendDistributionPercent')).toBeUndefined();
      expect(errors100.find(e => e.field === 'dividendDistributionPercent')).toBeUndefined();
    });

    it('accepts percentage within range', () => {
      const errors = validateInputs({ ...validInputs, dividendDistributionPercent: 50 });
      expect(errors.find(e => e.field === 'dividendDistributionPercent')).toBeUndefined();
    });
  });

  describe('zakat validation', () => {
    it('returns error for negative zakat amountPaid', () => {
      const errors = validateInputs({
        ...validInputs,
        zakat: { enabled: true, amountPaid: -100 },
      });
      expect(errors).toContainEqual(
        expect.objectContaining({ field: 'zakat.amountPaid' })
      );
    });

    it('accepts valid zakat configuration', () => {
      const errors = validateInputs({
        ...validInputs,
        zakat: { enabled: true, amountPaid: 1000, autoCalculate: false },
      });
      expect(errors.find(e => e.field.startsWith('zakat'))).toBeUndefined();
    });

    it('accepts zakat with only enabled flag', () => {
      const errors = validateInputs({
        ...validInputs,
        zakat: { enabled: true },
      });
      expect(errors.find(e => e.field.startsWith('zakat'))).toBeUndefined();
    });
  });

  describe('multiple validation errors', () => {
    it('returns all errors for multiple invalid fields', () => {
      const errors = validateInputs({
        businessProfit: -100,
        otherIncome: -50,
        monthlySalary: -1000,
        dividendDistributionPercent: 200,
      });
      expect(errors.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('NaN and Infinity handling', () => {
    it('returns error for NaN businessProfit', () => {
      const errors = validateInputs({ ...validInputs, businessProfit: NaN });
      expect(errors).toContainEqual(
        expect.objectContaining({ 
          field: 'businessProfit',
          message: expect.stringContaining('valid number')
        })
      );
    });

    it('returns error for Infinity businessProfit', () => {
      const errors = validateInputs({ ...validInputs, businessProfit: Infinity });
      expect(errors).toContainEqual(
        expect.objectContaining({ 
          field: 'businessProfit',
          message: expect.stringContaining('valid number')
        })
      );
    });

    it('returns error for -Infinity businessProfit', () => {
      const errors = validateInputs({ ...validInputs, businessProfit: -Infinity });
      expect(errors).toContainEqual(
        expect.objectContaining({ 
          field: 'businessProfit',
          message: expect.stringContaining('valid number')
        })
      );
    });

    it('returns error for NaN in dividendDistributionPercent', () => {
      const errors = validateInputs({ ...validInputs, dividendDistributionPercent: NaN });
      expect(errors).toContainEqual(
        expect.objectContaining({ 
          field: 'dividendDistributionPercent',
          message: expect.stringContaining('valid number')
        })
      );
    });

    it('returns error for NaN in auditCriteria', () => {
      const errors = validateInputs({
        ...validInputs,
        auditCriteria: { revenue: NaN, totalAssets: 1000, employees: 5 },
      });
      expect(errors).toContainEqual(
        expect.objectContaining({ 
          field: 'auditCriteria.revenue',
          message: expect.stringContaining('valid number')
        })
      );
    });

    it('returns error for non-integer employees', () => {
      const errors = validateInputs({
        ...validInputs,
        auditCriteria: { revenue: 1000, totalAssets: 1000, employees: 5.5 },
      });
      expect(errors).toContainEqual(
        expect.objectContaining({ 
          field: 'auditCriteria.employees',
          message: expect.stringContaining('integer')
        })
      );
    });
  });
});

describe('sanitizeInputs', () => {
  describe('businessProfit sanitization', () => {
    it('clamps negative businessProfit to 0', () => {
      const result = sanitizeInputs({ businessProfit: -100, otherIncome: 0 });
      expect(result.businessProfit).toBe(0);
    });

    it('preserves positive businessProfit', () => {
      const result = sanitizeInputs({ businessProfit: 50000, otherIncome: 0 });
      expect(result.businessProfit).toBe(50000);
    });

    it('uses 0 as default when businessProfit is undefined', () => {
      const result = sanitizeInputs({ otherIncome: 0 });
      expect(result.businessProfit).toBe(0);
    });
  });

  describe('otherIncome sanitization', () => {
    it('clamps negative otherIncome to 0', () => {
      const result = sanitizeInputs({ businessProfit: 0, otherIncome: -500 });
      expect(result.otherIncome).toBe(0);
    });
  });

  describe('monthlySalary sanitization', () => {
    it('clamps negative monthlySalary to 0', () => {
      const result = sanitizeInputs({ businessProfit: 0, otherIncome: 0, monthlySalary: -1000 });
      expect(result.monthlySalary).toBe(0);
    });

    it('preserves undefined monthlySalary', () => {
      const result = sanitizeInputs({ businessProfit: 0, otherIncome: 0 });
      expect(result.monthlySalary).toBeUndefined();
    });
  });

  describe('dividendDistributionPercent sanitization', () => {
    it('clamps percentage below 0 to 0', () => {
      const result = sanitizeInputs({ businessProfit: 0, otherIncome: 0, dividendDistributionPercent: -50 });
      expect(result.dividendDistributionPercent).toBe(0);
    });

    it('clamps percentage above 100 to 100', () => {
      const result = sanitizeInputs({ businessProfit: 0, otherIncome: 0, dividendDistributionPercent: 150 });
      expect(result.dividendDistributionPercent).toBe(100);
    });

    it('preserves percentage within range', () => {
      const result = sanitizeInputs({ businessProfit: 0, otherIncome: 0, dividendDistributionPercent: 75 });
      expect(result.dividendDistributionPercent).toBe(75);
    });
  });

  describe('auditCriteria sanitization', () => {
    it('clamps negative values to 0', () => {
      const result = sanitizeInputs({
        businessProfit: 0,
        otherIncome: 0,
        auditCriteria: { revenue: -100, totalAssets: -200, employees: -5 },
      });
      expect(result.auditCriteria?.revenue).toBe(0);
      expect(result.auditCriteria?.totalAssets).toBe(0);
      expect(result.auditCriteria?.employees).toBe(0);
    });

    it('rounds employees to integer', () => {
      const result = sanitizeInputs({
        businessProfit: 0,
        otherIncome: 0,
        auditCriteria: { revenue: 1000, totalAssets: 1000, employees: 5.7 },
      });
      expect(result.auditCriteria?.employees).toBe(6);
    });

    it('preserves undefined auditCriteria', () => {
      const result = sanitizeInputs({ businessProfit: 0, otherIncome: 0 });
      expect(result.auditCriteria).toBeUndefined();
    });
  });

  describe('zakat sanitization', () => {
    it('clamps negative amountPaid to 0', () => {
      const result = sanitizeInputs({
        businessProfit: 0,
        otherIncome: 0,
        zakat: { enabled: true, amountPaid: -500 },
      });
      expect(result.zakat?.amountPaid).toBe(0);
    });

    it('defaults enabled to false', () => {
      const result = sanitizeInputs({
        businessProfit: 0,
        otherIncome: 0,
        zakat: {} as any,
      });
      expect(result.zakat?.enabled).toBe(false);
    });

    it('defaults autoCalculate to true', () => {
      const result = sanitizeInputs({
        businessProfit: 0,
        otherIncome: 0,
        zakat: { enabled: true },
      });
      expect(result.zakat?.autoCalculate).toBe(true);
    });

    it('preserves method field', () => {
      const result = sanitizeInputs({
        businessProfit: 0,
        otherIncome: 0,
        zakat: { enabled: true, method: 'gross_income' },
      });
      expect(result.zakat?.method).toBe('gross_income');
    });
  });

  describe('reliefs passthrough', () => {
    it('preserves provided relief values', () => {
      const reliefs = { personal: 9000, education: 2000 };
      const result = sanitizeInputs({
        businessProfit: 0,
        otherIncome: 0,
        reliefs: reliefs as any,
      });
      expect(result.reliefs).toMatchObject(reliefs);
    });
  });

  describe('NaN and Infinity sanitization', () => {
    it('replaces NaN businessProfit with 0', () => {
      const result = sanitizeInputs({ businessProfit: NaN, otherIncome: 0 });
      expect(result.businessProfit).toBe(0);
    });

    it('replaces Infinity businessProfit with 0', () => {
      const result = sanitizeInputs({ businessProfit: Infinity, otherIncome: 0 });
      expect(result.businessProfit).toBe(0);
    });

    it('replaces -Infinity businessProfit with 0', () => {
      const result = sanitizeInputs({ businessProfit: -Infinity, otherIncome: 0 });
      expect(result.businessProfit).toBe(0);
    });

    it('replaces NaN in optional fields with 0', () => {
      const result = sanitizeInputs({
        businessProfit: 0,
        otherIncome: 0,
        monthlySalary: NaN,
        complianceCosts: NaN,
        auditCost: NaN,
      });
      expect(result.monthlySalary).toBe(0);
      expect(result.complianceCosts).toBe(0);
      expect(result.auditCost).toBe(0);
    });

    it('replaces NaN in auditCriteria with 0', () => {
      const result = sanitizeInputs({
        businessProfit: 0,
        otherIncome: 0,
        auditCriteria: { revenue: NaN, totalAssets: Infinity, employees: NaN },
      });
      expect(result.auditCriteria?.revenue).toBe(0);
      expect(result.auditCriteria?.totalAssets).toBe(0);
      expect(result.auditCriteria?.employees).toBe(0);
    });

    it('replaces NaN in dividendDistributionPercent with 0', () => {
      const result = sanitizeInputs({
        businessProfit: 0,
        otherIncome: 0,
        dividendDistributionPercent: NaN,
      });
      expect(result.dividendDistributionPercent).toBe(0);
    });

    it('replaces Infinity in dividendDistributionPercent with 100 (clamped)', () => {
      const result = sanitizeInputs({
        businessProfit: 0,
        otherIncome: 0,
        dividendDistributionPercent: Infinity,
      });
      expect(result.dividendDistributionPercent).toBe(100);
    });

    it('replaces NaN in zakat amountPaid with 0', () => {
      const result = sanitizeInputs({
        businessProfit: 0,
        otherIncome: 0,
        zakat: { enabled: true, amountPaid: NaN },
      });
      expect(result.zakat?.amountPaid).toBe(0);
    });
  });
});
