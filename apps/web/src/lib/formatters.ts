export function formatRM(
  amount: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSign?: boolean;
    compact?: boolean;
  } = {}
): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSign = false,
    compact = false,
  } = options;

  if (!isFinite(amount)) {
    return 'RM0.00';
  }

  const absAmount = Math.abs(amount);
  const sign = showSign && amount !== 0 ? (amount > 0 ? '+' : '-') : '';

  // Compact notation for large numbers to prevent UI overflow
  if (compact || absAmount >= 10_000_000) {
    if (absAmount >= 1_000_000_000) {
      return `${sign}RM${(absAmount / 1_000_000_000).toFixed(2)}B`;
    }
    if (absAmount >= 1_000_000) {
      return `${sign}RM${(absAmount / 1_000_000).toFixed(2)}M`;
    }
  }

  const formatted = absAmount.toLocaleString('en-MY', {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return `${sign}RM${formatted}`;
}

export function formatBracketLabel(
  min: number,
  max: number | null,
  isFirst: boolean
): string {
  if (isFirst && min === 0) {
    if (max !== null) {
      return `First RM${max.toLocaleString('en-MY')}`;
    }
    return 'All income';
  }

  if (max === null) {
    return `Above RM${min.toLocaleString('en-MY')}`;
  }

  const bracketSize = max - min;
  return `Next RM${bracketSize.toLocaleString('en-MY')}`;
}

export function formatPercent(rate: number, decimals: number = 0): string {
  return `${(rate * 100).toFixed(decimals)}%`;
}
