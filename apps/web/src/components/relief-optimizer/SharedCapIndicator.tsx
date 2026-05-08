import React from 'react';
import { motion } from 'framer-motion';
import { Warning } from 'phosphor-react';
import type { SharedCapUsage } from '@tax-engine/core';
import { cn } from '@/lib/utils';

interface SharedCapIndicatorProps {
  usage: SharedCapUsage;
  compact?: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-MY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const SharedCapIndicator = React.memo(function SharedCapIndicator({
  usage,
  compact = false,
}: SharedCapIndicatorProps) {
  const { label, used, limit, percentUsed, exceeded } = usage;

  // Color coding based on usage
  const getColorClasses = () => {
    if (exceeded || percentUsed > 100) {
      return {
        bar: 'bg-red-500',
        text: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-500/10',
      };
    }
    if (percentUsed >= 80) {
      return {
        bar: 'bg-amber-500',
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-500/10',
      };
    }
    return {
      bar: 'bg-emerald-500',
      text: 'text-muted-foreground',
      bg: 'bg-muted/50',
    };
  };

  const colors = getColorClasses();
  const clampedPercent = Math.min(percentUsed, 100);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full', colors.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${clampedPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <span className={cn('text-xs font-medium tabular-nums', colors.text)}>
          {Math.round(percentUsed)}%
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-3 transition-colors',
        exceeded ? 'border-red-500/30 bg-red-500/5' : 'border-border/50 bg-card'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {exceeded && (
            <Warning
              weight="fill"
              className="h-4 w-4 text-red-500"
            />
          )}
        </div>
        <span className={cn('text-sm font-medium tabular-nums', colors.text)}>
          RM{formatCurrency(used)} / RM{formatCurrency(limit)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', colors.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${clampedPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Excess warning */}
      {exceeded && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-red-600 dark:text-red-400"
        >
          Exceeds limit by RM{formatCurrency(used - limit)} — will be capped
        </motion.p>
      )}
    </div>
  );
});

export default SharedCapIndicator;
