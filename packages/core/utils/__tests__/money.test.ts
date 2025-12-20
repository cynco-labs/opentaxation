/**
 * Tests for Money utility class
 */

import { describe, it, expect } from 'vitest';
import { Money } from '../money';

describe('Money', () => {
  describe('fromDollars', () => {
    it('creates Money from dollars and rounds to nearest cent', () => {
      const m1 = Money.fromDollars(100.50);
      expect(m1.toCents()).toBe(10050);

      const m2 = Money.fromDollars(100.499);
      expect(m2.toCents()).toBe(10050); // Rounds up

      const m3 = Money.fromDollars(100.494);
      expect(m3.toCents()).toBe(10049); // Rounds down
    });

    it('handles negative values', () => {
      const m = Money.fromDollars(-100.50);
      expect(m.toCents()).toBe(-10050);
    });

    it('throws on non-finite values', () => {
      expect(() => Money.fromDollars(NaN)).toThrow();
      expect(() => Money.fromDollars(Infinity)).toThrow();
      expect(() => Money.fromDollars(-Infinity)).toThrow();
    });
  });

  describe('fromCents', () => {
    it('creates Money from integer cents', () => {
      const m = Money.fromCents(10050);
      expect(m.toDollars()).toBe(100.50);
    });

    it('throws on non-integer values', () => {
      expect(() => Money.fromCents(100.5)).toThrow();
    });
  });

  describe('zero', () => {
    it('creates zero Money', () => {
      const m = Money.zero();
      expect(m.toCents()).toBe(0);
      expect(m.toDollars()).toBe(0);
    });
  });

  describe('toDollars', () => {
    it('converts cents to dollars with 2 decimal places', () => {
      const m = Money.fromCents(10050);
      expect(m.toDollars()).toBe(100.50);
    });
  });

  describe('arithmetic operations', () => {
    it('adds two Money values', () => {
      const m1 = Money.fromDollars(100.50);
      const m2 = Money.fromDollars(50.25);
      const result = m1.add(m2);
      expect(result.toDollars()).toBe(150.75);
    });

    it('subtracts two Money values', () => {
      const m1 = Money.fromDollars(100.50);
      const m2 = Money.fromDollars(50.25);
      const result = m1.subtract(m2);
      expect(result.toDollars()).toBe(50.25);
    });

    it('multiplies by scalar and rounds to nearest cent', () => {
      const m = Money.fromDollars(100.50);
      const result = m.multiply(0.15); // 15% tax
      expect(result.toDollars()).toBe(15.08); // 100.50 * 0.15 = 15.075, rounds to 15.08
    });

    it('divides by scalar and rounds to nearest cent', () => {
      const m = Money.fromDollars(100.50);
      const result = m.divide(3);
      expect(result.toDollars()).toBe(33.50); // 100.50 / 3 = 33.5
    });

    it('throws on invalid scalar in multiply', () => {
      const m = Money.fromDollars(100);
      expect(() => m.multiply(NaN)).toThrow();
      expect(() => m.multiply(Infinity)).toThrow();
    });

    it('throws on zero or invalid scalar in divide', () => {
      const m = Money.fromDollars(100);
      expect(() => m.divide(0)).toThrow();
      expect(() => m.divide(NaN)).toThrow();
    });
  });

  describe('comparison operations', () => {
    it('compares two Money values', () => {
      const m1 = Money.fromDollars(100);
      const m2 = Money.fromDollars(50);
      const m3 = Money.fromDollars(100);

      expect(m1.compare(m2)).toBe(1);
      expect(m2.compare(m1)).toBe(-1);
      expect(m1.compare(m3)).toBe(0);
    });

    it('checks equality', () => {
      const m1 = Money.fromDollars(100.50);
      const m2 = Money.fromDollars(100.50);
      const m3 = Money.fromDollars(100.51);

      expect(m1.equals(m2)).toBe(true);
      expect(m1.equals(m3)).toBe(false);
    });

    it('checks less than', () => {
      const m1 = Money.fromDollars(50);
      const m2 = Money.fromDollars(100);
      expect(m1.isLessThan(m2)).toBe(true);
      expect(m2.isLessThan(m1)).toBe(false);
    });

    it('checks greater than', () => {
      const m1 = Money.fromDollars(100);
      const m2 = Money.fromDollars(50);
      expect(m1.isGreaterThan(m2)).toBe(true);
      expect(m2.isGreaterThan(m1)).toBe(false);
    });
  });

  describe('predicates', () => {
    it('checks if zero or negative', () => {
      expect(Money.zero().isZeroOrNegative()).toBe(true);
      expect(Money.fromDollars(-10).isZeroOrNegative()).toBe(true);
      expect(Money.fromDollars(10).isZeroOrNegative()).toBe(false);
    });

    it('checks if positive', () => {
      expect(Money.fromDollars(10).isPositive()).toBe(true);
      expect(Money.zero().isPositive()).toBe(false);
      expect(Money.fromDollars(-10).isPositive()).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('gets absolute value', () => {
      const m = Money.fromDollars(-100.50);
      expect(m.abs().toDollars()).toBe(100.50);
    });

    it('gets maximum of two values', () => {
      const m1 = Money.fromDollars(50);
      const m2 = Money.fromDollars(100);
      expect(m1.max(m2).equals(m2)).toBe(true);
    });

    it('gets minimum of two values', () => {
      const m1 = Money.fromDollars(50);
      const m2 = Money.fromDollars(100);
      expect(m1.min(m2).equals(m1)).toBe(true);
    });
  });

  describe('formatting', () => {
    it('formats as currency string', () => {
      const m = Money.fromDollars(1234.56);
      expect(m.format('RM')).toBe('RM1,234.56');
    });

    it('formats zero correctly', () => {
      const m = Money.zero();
      expect(m.format('RM')).toBe('RM0.00');
    });
  });

  describe('precision edge cases', () => {
    it('handles floating point precision issues', () => {
      // 0.1 + 0.2 = 0.30000000000000004 in JS
      const m1 = Money.fromDollars(0.1);
      const m2 = Money.fromDollars(0.2);
      const result = m1.add(m2);
      expect(result.toDollars()).toBe(0.30); // Correctly rounded
    });

    it('handles multiplication precision', () => {
      // 100.50 * 0.15 = 15.075, should round to 15.08
      const m = Money.fromDollars(100.50);
      const result = m.multiply(0.15);
      expect(result.toCents()).toBe(1508); // 15.08 in cents
    });
  });
});

