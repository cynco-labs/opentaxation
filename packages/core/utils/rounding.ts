import { Money } from './money';

export function roundCurrency(value: number): number {
  if (!isFinite(value)) {
    return value;
  }
  return Money.fromDollars(value).toDollars();
}

export function roundPercentage(value: number): number {
  if (!isFinite(value)) {
    return value;
  }
  return Math.round(value * 10000) / 10000;
}

export function isValidNumber(value: number): boolean {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

export function isNonNegative(value: number): boolean {
  return isValidNumber(value) && value >= 0;
}

