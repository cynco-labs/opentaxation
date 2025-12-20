/**
 * Money utility for precise financial calculations
 * 
 * Uses integer cents to avoid floating-point precision issues.
 * All calculations are done in cents, and only converted to dollars at display boundaries.
 * 
 * This ensures:
 * - No floating-point drift in calculations
 * - Consistent rounding policy (always round to nearest cent)
 * - Deterministic results across platforms
 */

/**
 * Money class that stores values as integer cents
 * 
 * Example:
 * ```ts
 * const amount = Money.fromDollars(100.50); // 10050 cents
 * const tax = amount.multiply(0.15); // 15% tax
 * const result = tax.toDollars(); // 15.08 (rounded)
 * ```
 */
export class Money {
  private readonly cents: number;

  private constructor(cents: number) {
    if (!Number.isInteger(cents)) {
      throw new Error('Money must be constructed with integer cents');
    }
    this.cents = cents;
  }

  /**
   * Create Money from dollars (floating point)
   * Rounds to nearest cent
   */
  static fromDollars(dollars: number): Money {
    if (!isFinite(dollars)) {
      throw new Error('Money.fromDollars: dollars must be a finite number');
    }
    // Round to nearest cent
    const cents = Math.round(dollars * 100);
    return new Money(cents);
  }

  /**
   * Create Money from cents (integer)
   */
  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents)) {
      throw new Error('Money.fromCents: cents must be an integer');
    }
    return new Money(cents);
  }

  /**
   * Create Money from zero
   */
  static zero(): Money {
    return new Money(0);
  }

  /**
   * Convert to dollars (floating point, 2 decimal places)
   */
  toDollars(): number {
    return this.cents / 100;
  }

  /**
   * Get raw cents value
   */
  toCents(): number {
    return this.cents;
  }

  /**
   * Add two Money values
   */
  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  /**
   * Subtract two Money values
   */
  subtract(other: Money): Money {
    return new Money(this.cents - other.cents);
  }

  /**
   * Multiply by a scalar (rate/percentage)
   * Result is rounded to nearest cent
   */
  multiply(scalar: number): Money {
    if (!isFinite(scalar)) {
      throw new Error('Money.multiply: scalar must be a finite number');
    }
    const result = this.cents * scalar;
    return new Money(Math.round(result));
  }

  /**
   * Divide by a scalar
   * Result is rounded to nearest cent
   */
  divide(scalar: number): Money {
    if (!isFinite(scalar) || scalar === 0) {
      throw new Error('Money.divide: scalar must be a finite non-zero number');
    }
    const result = this.cents / scalar;
    return new Money(Math.round(result));
  }

  /**
   * Compare two Money values
   * Returns: -1 if this < other, 0 if equal, 1 if this > other
   */
  compare(other: Money): number {
    if (this.cents < other.cents) return -1;
    if (this.cents > other.cents) return 1;
    return 0;
  }

  /**
   * Check if this equals other
   */
  equals(other: Money): boolean {
    return this.cents === other.cents;
  }

  /**
   * Check if this is less than other
   */
  isLessThan(other: Money): boolean {
    return this.cents < other.cents;
  }

  /**
   * Check if this is greater than other
   */
  isGreaterThan(other: Money): boolean {
    return this.cents > other.cents;
  }

  /**
   * Check if this is zero or negative
   */
  isZeroOrNegative(): boolean {
    return this.cents <= 0;
  }

  /**
   * Check if this is positive
   */
  isPositive(): boolean {
    return this.cents > 0;
  }

  /**
   * Get absolute value
   */
  abs(): Money {
    return new Money(Math.abs(this.cents));
  }

  /**
   * Get maximum of two Money values
   */
  max(other: Money): Money {
    return this.cents >= other.cents ? this : other;
  }

  /**
   * Get minimum of two Money values
   */
  min(other: Money): Money {
    return this.cents <= other.cents ? this : other;
  }

  /**
   * Format as currency string (e.g., "RM1,234.56")
   */
  format(currency: string = 'RM'): string {
    const dollars = this.toDollars();
    return `${currency}${dollars.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  /**
   * String representation for debugging
   */
  toString(): string {
    return `Money(${this.toDollars().toFixed(2)})`;
  }
}

