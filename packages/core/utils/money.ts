/**
 * Stores currency values as integer cents to avoid floating-point drift.
 * Only convert to dollars at display boundaries.
 */
export class Money {
  private readonly cents: number;

  private constructor(cents: number) {
    if (!Number.isInteger(cents)) {
      throw new Error('Money must be constructed with integer cents');
    }
    this.cents = cents;
  }

  static fromDollars(dollars: number): Money {
    if (!isFinite(dollars)) {
      throw new Error('Money.fromDollars: dollars must be a finite number');
    }
    return new Money(Math.round(dollars * 100));
  }

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents)) {
      throw new Error('Money.fromCents: cents must be an integer');
    }
    return new Money(cents);
  }

  static zero(): Money {
    return new Money(0);
  }

  toDollars(): number {
    return this.cents / 100;
  }

  toCents(): number {
    return this.cents;
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  subtract(other: Money): Money {
    return new Money(this.cents - other.cents);
  }

  multiply(scalar: number): Money {
    if (!isFinite(scalar)) {
      throw new Error('Money.multiply: scalar must be a finite number');
    }
    return new Money(Math.round(this.cents * scalar));
  }

  divide(scalar: number): Money {
    if (!isFinite(scalar) || scalar === 0) {
      throw new Error('Money.divide: scalar must be a finite non-zero number');
    }
    return new Money(Math.round(this.cents / scalar));
  }

  compare(other: Money): number {
    if (this.cents < other.cents) return -1;
    if (this.cents > other.cents) return 1;
    return 0;
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }

  isLessThan(other: Money): boolean {
    return this.cents < other.cents;
  }

  isGreaterThan(other: Money): boolean {
    return this.cents > other.cents;
  }

  isZeroOrNegative(): boolean {
    return this.cents <= 0;
  }

  isPositive(): boolean {
    return this.cents > 0;
  }

  abs(): Money {
    return new Money(Math.abs(this.cents));
  }

  max(other: Money): Money {
    return this.cents >= other.cents ? this : other;
  }

  min(other: Money): Money {
    return this.cents <= other.cents ? this : other;
  }

  format(currency: string = 'RM'): string {
    const dollars = this.toDollars();
    return `${currency}${dollars.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  toString(): string {
    return `Money(${this.toDollars().toFixed(2)})`;
  }
}
