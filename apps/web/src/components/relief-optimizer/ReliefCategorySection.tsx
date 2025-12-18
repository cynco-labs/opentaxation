import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretDown, Laptop, Users, FirstAid, GraduationCap, Vault, Gift } from 'phosphor-react';
import type { ReliefCategory, ReliefDefinition } from '@tax-engine/config';
import type { ReliefClaimValues, ReliefClaimEntry } from '@tax-engine/core';
import { cn } from '@/lib/utils';
import ReliefInputCard from './ReliefInputCard';

// Map category to icon component
const CATEGORY_ICONS: Record<ReliefCategory, React.ElementType> = {
  lifestyle: Laptop,
  family: Users,
  medical: FirstAid,
  education: GraduationCap,
  insurance_savings: Vault,
  other: Gift,
};

const CATEGORY_COLORS: Record<ReliefCategory, string> = {
  lifestyle: 'text-purple-600 bg-purple-500/10',
  family: 'text-blue-600 bg-blue-500/10',
  medical: 'text-rose-600 bg-rose-500/10',
  education: 'text-amber-600 bg-amber-500/10',
  insurance_savings: 'text-emerald-600 bg-emerald-500/10',
  other: 'text-teal-600 bg-teal-500/10',
};

interface ReliefCategorySectionProps {
  category: ReliefCategory;
  label: string;
  reliefs: ReliefDefinition[];
  claims: ReliefClaimValues;
  onClaimChange: (reliefId: string, value: ReliefClaimEntry | undefined) => void;
  breakdown?: Record<string, number>;
  defaultExpanded?: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-MY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ReliefCategorySection({
  category,
  label,
  reliefs,
  claims,
  onClaimChange,
  breakdown = {},
  defaultExpanded = false,
}: ReliefCategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const Icon = CATEGORY_ICONS[category];
  const colorClass = CATEGORY_COLORS[category];

  // Calculate category total from breakdown (after caps)
  const categoryTotal = reliefs.reduce((sum, relief) => {
    return sum + (breakdown[relief.id] || 0);
  }, 0);

  // Count how many reliefs have claims
  const claimedCount = reliefs.filter(
    (relief) => claims[relief.id]?.amount && claims[relief.id].amount > 0
  ).length;

  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between p-4 text-left',
          'hover:bg-muted/30 transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset'
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg', colorClass)}>
            <Icon weight="duotone" className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">{label}</h3>
            <p className="text-xs text-muted-foreground">
              {claimedCount > 0
                ? `${claimedCount} relief${claimedCount > 1 ? 's' : ''} claimed`
                : `${reliefs.length} relief${reliefs.length > 1 ? 's' : ''} available`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Category total */}
          {categoryTotal > 0 && (
            <span className="text-sm font-medium text-primary tabular-nums">
              RM{formatCurrency(categoryTotal)}
            </span>
          )}
          {/* Expand/collapse indicator */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <CaretDown
              weight="bold"
              className="h-5 w-5 text-muted-foreground"
            />
          </motion.div>
        </div>
      </button>

      {/* Content - Expandable */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-border/30">
              <div className="grid gap-3 mt-3">
                {reliefs.map((relief) => {
                  const claimValue = claims[relief.id];
                  const actualAllowed = breakdown[relief.id];
                  const effectiveClaim = claimValue
                    ? relief.perUnit
                      ? (claimValue.amount || 0) * (claimValue.quantity || 1)
                      : claimValue.amount || 0
                    : 0;
                  const isOverCap =
                    actualAllowed !== undefined && actualAllowed < effectiveClaim;

                  return (
                    <ReliefInputCard
                      key={relief.id}
                      relief={relief}
                      value={claimValue}
                      onChange={(value) => onClaimChange(relief.id, value)}
                      isOverCap={isOverCap}
                      actualAllowed={actualAllowed}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
