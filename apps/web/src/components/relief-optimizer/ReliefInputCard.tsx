import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Minus, Plus } from 'phosphor-react';
import type { ReliefDefinition } from '@tax-engine/config';
import type { ReliefClaimEntry } from '@tax-engine/core';
import { cn } from '@/lib/utils';

interface ReliefInputCardProps {
  relief: ReliefDefinition;
  value: ReliefClaimEntry | undefined;
  onChange: (value: ReliefClaimEntry | undefined) => void;
  isOverCap?: boolean;
  actualAllowed?: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-MY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ReliefInputCard({
  relief,
  value,
  onChange,
  isOverCap,
  actualAllowed,
}: ReliefInputCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const amount = value?.amount || 0;
  const quantity = value?.quantity || 1;

  // Calculate effective claim
  const effectiveClaim = relief.perUnit ? amount * quantity : amount;

  const handleAmountChange = useCallback(
    (newAmount: number) => {
      const sanitized = Math.max(0, Math.min(newAmount, relief.limit));
      if (sanitized === 0 && (!relief.perUnit || quantity <= 1)) {
        onChange(undefined);
      } else {
        onChange({
          amount: sanitized,
          ...(relief.perUnit ? { quantity } : {}),
        });
      }
    },
    [onChange, relief.limit, relief.perUnit, quantity]
  );

  const handleQuantityChange = useCallback(
    (delta: number) => {
      const newQuantity = Math.max(1, quantity + delta);
      if (amount === 0) {
        onChange(undefined);
      } else {
        onChange({
          amount,
          quantity: newQuantity,
        });
      }
    },
    [onChange, amount, quantity]
  );

  const handleQuickFill = useCallback(() => {
    const maxAmount = relief.limit;
    if (relief.perUnit) {
      onChange({ amount: maxAmount, quantity: quantity || 1 });
    } else {
      onChange({ amount: maxAmount });
    }
  }, [onChange, relief.limit, relief.perUnit, quantity]);

  return (
    <div
      className={cn(
        'group relative rounded-xl border bg-card p-4 transition-all duration-200',
        amount > 0
          ? 'border-primary/30 shadow-sm'
          : 'border-border/50 hover:border-border',
        isOverCap && 'ring-1 ring-amber-500/50'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-foreground truncate">
              {relief.name}
            </h4>
            {relief.conditions && relief.conditions.length > 0 && (
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-1 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Show conditions"
              >
                <Info weight="duotone" className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {relief.description}
          </p>
        </div>

        {/* Max limit badge */}
        <button
          onClick={handleQuickFill}
          className="flex-shrink-0 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-primary bg-muted/50 hover:bg-muted rounded-md transition-colors"
          title="Click to fill maximum"
        >
          Max RM{formatCurrency(relief.limit)}
          {relief.perUnit && `/${relief.unitLabel}`}
        </button>
      </div>

      {/* Conditions tooltip */}
      <AnimatePresence>
        {showInfo && relief.conditions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-3 p-2.5 rounded-lg bg-muted/30 border border-border/30">
              <ul className="space-y-1">
                {relief.conditions.map((condition, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-primary/60 mt-0.5">•</span>
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="flex items-center gap-3">
        {/* Amount input */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            RM
          </span>
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => handleAmountChange(Number(e.target.value) || 0)}
            placeholder="0"
            min={0}
            max={relief.limit}
            className={cn(
              'w-full h-11 pl-10 pr-3 rounded-lg border bg-background text-sm font-numbers',
              'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
              'transition-all duration-200',
              isOverCap ? 'border-amber-500/50' : 'border-border/60'
            )}
          />
        </div>

        {/* Quantity controls for per-unit reliefs */}
        {relief.perUnit && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-2 rounded-lg border border-border/60 hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus weight="bold" className="h-4 w-4" />
            </button>
            <div className="w-10 text-center">
              <span className="text-sm font-medium">{quantity}</span>
              <span className="text-xs text-muted-foreground block -mt-0.5">
                {relief.unitLabel}
              </span>
            </div>
            <button
              onClick={() => handleQuantityChange(1)}
              className="p-2 rounded-lg border border-border/60 hover:bg-muted/50 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus weight="bold" className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Cap warning */}
      {isOverCap && actualAllowed !== undefined && actualAllowed < effectiveClaim && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-amber-600 dark:text-amber-400"
        >
          Capped at RM{formatCurrency(actualAllowed)} due to shared limit
        </motion.p>
      )}

      {/* Total for per-unit */}
      {relief.perUnit && amount > 0 && quantity > 1 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Total: RM{formatCurrency(effectiveClaim)}
        </p>
      )}
    </div>
  );
}
