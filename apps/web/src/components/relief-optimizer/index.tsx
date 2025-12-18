import { useMemo, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, Sparkle, Lightning } from 'phosphor-react';
import {
  CATEGORY_CONFIG,
  CATEGORY_ORDER,
  getClaimableReliefs,
  type ReliefCategory,
} from '@tax-engine/config';
import {
  calculateReliefOptimization,
  type ReliefClaimValues,
  type ReliefClaimEntry,
} from '@tax-engine/core';
import ReliefCategorySection from './ReliefCategorySection';
import SharedCapIndicator from './SharedCapIndicator';
import QuickSetup from './QuickSetup';

interface ReliefOptimizerProps {
  claims: ReliefClaimValues;
  onChange: (claims: ReliefClaimValues) => void;
  className?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-MY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Group reliefs by category
function groupReliefsByCategory() {
  const claimableReliefs = getClaimableReliefs();
  const grouped: Record<ReliefCategory, typeof claimableReliefs> = {
    lifestyle: [],
    family: [],
    medical: [],
    education: [],
    insurance_savings: [],
    other: [],
  };

  for (const relief of claimableReliefs) {
    grouped[relief.category].push(relief);
  }

  return grouped;
}

export default function ReliefOptimizer({
  claims,
  onChange,
  className,
}: ReliefOptimizerProps) {
  // Track whether to show Quick Setup
  // Show it if user has no claims yet
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [quickSetupCompleted, setQuickSetupCompleted] = useState(false);

  // Check if user has any claims
  const hasAnyClaims = Object.keys(claims).some(
    (id) => claims[id]?.amount && claims[id].amount > 0
  );

  // Show Quick Setup on first render if no claims
  useEffect(() => {
    if (!hasAnyClaims && !quickSetupCompleted) {
      setShowQuickSetup(true);
    }
  }, [hasAnyClaims, quickSetupCompleted]);

  // Handle Quick Setup completion
  const handleQuickSetupComplete = useCallback((quickClaims: ReliefClaimValues) => {
    onChange(quickClaims);
    setShowQuickSetup(false);
    setQuickSetupCompleted(true);
  }, [onChange]);

  // Handle Quick Setup skip
  const handleQuickSetupSkip = useCallback(() => {
    setShowQuickSetup(false);
    setQuickSetupCompleted(true);
  }, []);

  // Calculate optimization result
  const optimizationResult = useMemo(
    () => calculateReliefOptimization(claims),
    [claims]
  );

  // Group reliefs by category
  const reliefsByCategory = useMemo(() => groupReliefsByCategory(), []);

  // Handle individual relief claim change
  const handleClaimChange = useCallback(
    (reliefId: string, value: ReliefClaimEntry | undefined) => {
      const newClaims = { ...claims };
      if (value === undefined || (value.amount === 0 && (!value.quantity || value.quantity <= 1))) {
        delete newClaims[reliefId];
      } else {
        newClaims[reliefId] = value;
      }
      onChange(newClaims);
    },
    [claims, onChange]
  );

  // Filter shared cap groups that have usage
  const activeSharedCaps = optimizationResult.groupUsage.filter(
    (usage) => usage.reliefIds.length > 0
  );

  // Count total claimed reliefs
  const totalClaimedReliefs = Object.keys(claims).filter(
    (id) => claims[id]?.amount && claims[id].amount > 0
  ).length;

  // Show Quick Setup if active
  if (showQuickSetup) {
    return (
      <div className={className}>
        <QuickSetup
          onComplete={handleQuickSetupComplete}
          onSkip={handleQuickSetupSkip}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header with totals */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Tax Reliefs</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Claim eligible deductions to reduce your taxable income
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowQuickSetup(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Lightning weight="bold" className="h-3.5 w-3.5" />
            Quick Setup
          </button>
        </div>

        {/* Summary card */}
        <motion.div
          layout
          className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Sparkle weight="duotone" className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Relief</p>
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  RM{formatCurrency(optimizationResult.total)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {totalClaimedReliefs > 0
                  ? `${totalClaimedReliefs} relief${totalClaimedReliefs > 1 ? 's' : ''} claimed`
                  : 'Start claiming reliefs'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Basic RM{formatCurrency(optimizationResult.basicRelief)} +{' '}
                RM{formatCurrency(optimizationResult.additionalReliefs)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Shared cap indicators */}
      {activeSharedCaps.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Info weight="duotone" className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Shared Limits</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {activeSharedCaps.map((usage) => (
              <SharedCapIndicator key={usage.group} usage={usage} />
            ))}
          </div>
        </div>
      )}

      {/* Relief categories */}
      <div className="space-y-3">
        {CATEGORY_ORDER.map((category) => {
          const reliefs = reliefsByCategory[category];
          if (reliefs.length === 0) return null;

          const config = CATEGORY_CONFIG[category];

          // Determine if this category should be expanded by default
          // Expand if user has claims in this category
          const hasClaimsInCategory = reliefs.some(
            (relief) => claims[relief.id]?.amount && claims[relief.id].amount > 0
          );

          return (
            <ReliefCategorySection
              key={category}
              category={category}
              label={config.label}
              reliefs={reliefs}
              claims={claims}
              onClaimChange={handleClaimChange}
              breakdown={optimizationResult.breakdown}
              defaultExpanded={hasClaimsInCategory || category === 'insurance_savings'}
            />
          );
        })}
      </div>

      {/* Capped items warning */}
      {optimizationResult.cappedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5"
        >
          <div className="flex items-start gap-3">
            <Info weight="fill" className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Some claims were capped
              </p>
              <ul className="mt-2 space-y-1">
                {optimizationResult.cappedItems.slice(0, 3).map((item) => (
                  <li key={item.id} className="text-xs text-muted-foreground">
                    {item.name}: RM{formatCurrency(item.claimed)} → RM
                    {formatCurrency(item.allowed)}
                    <span className="text-muted-foreground/60">
                      {' '}
                      ({item.reason === 'shared_cap' ? 'shared limit' : 'max limit'})
                    </span>
                  </li>
                ))}
                {optimizationResult.cappedItems.length > 3 && (
                  <li className="text-xs text-muted-foreground">
                    +{optimizationResult.cappedItems.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Re-export sub-components for flexibility
export { default as ReliefCategorySection } from './ReliefCategorySection';
export { default as ReliefInputCard } from './ReliefInputCard';
export { default as SharedCapIndicator } from './SharedCapIndicator';
export { default as QuickSetup } from './QuickSetup';
