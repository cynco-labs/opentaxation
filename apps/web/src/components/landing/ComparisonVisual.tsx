import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Buildings, CheckCircle } from 'phosphor-react';

/**
 * Interactive comparison visual showing Enterprise vs Sdn Bhd
 * Clean, minimal design that lets content breathe
 */
export default function ComparisonVisual() {
  const [hoveredSide, setHoveredSide] = useState<'enterprise' | 'sdnbhd' | null>(null);

  const enterpriseData = [
    { label: 'Tax Rate', value: '0–30%', note: 'Personal rates' },
    { label: 'Setup Cost', value: '~RM60', note: 'SSM registration' },
    { label: 'Annual Cost', value: '~RM200', note: 'Renewal only' },
    { label: 'Liability', value: 'Unlimited', note: 'Personal assets at risk' },
    { label: 'EPF/SOCSO', value: 'Optional', note: 'Self-contribution' },
  ];

  const sdnBhdData = [
    { label: 'Tax Rate', value: '15–24%', note: 'Corporate rates' },
    { label: 'Setup Cost', value: '~RM2,500', note: 'Inc. secretary' },
    { label: 'Annual Cost', value: '~RM5,000', note: 'Audit + secretary' },
    { label: 'Liability', value: 'Limited', note: 'Protected assets' },
    { label: 'EPF/SOCSO', value: 'Required', note: 'If paying salary' },
  ];

  return (
    <div className="relative max-w-4xl mx-auto mt-8 sm:mt-10 mb-4">
      {/* Card container */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-0">

        {/* Enterprise Side */}
        <motion.div
          className="relative p-4 sm:p-6 rounded-xl md:rounded-r-none bg-card border border-border"
          onMouseEnter={() => setHoveredSide('enterprise')}
          onMouseLeave={() => setHoveredSide(null)}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
              <User weight="regular" className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Enterprise</h3>
              <p className="text-[11px] text-muted-foreground">Sole Proprietor / Partnership</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-0 divide-y divide-border/50">
            {enterpriseData.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2.5 sm:py-3 first:pt-0 last:pb-0">
                <div>
                  <span className="text-xs sm:text-sm text-foreground/70">{item.label}</span>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground/60">{item.note}</p>
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-5 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-muted text-[10px] sm:text-xs font-medium text-foreground/70">
              <CheckCircle weight="fill" className="h-3 w-3 text-foreground/40" />
              Quick to start
            </span>
            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-muted text-[10px] sm:text-xs font-medium text-foreground/70">
              <CheckCircle weight="fill" className="h-3 w-3 text-foreground/40" />
              Low overhead
            </span>
          </div>

          {/* Best for */}
          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-border/50">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Best for</p>
            <p className="text-xs sm:text-sm font-medium text-foreground">Profits under ~RM150k/year</p>
          </div>
        </motion.div>

        {/* Center VS indicator */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex">
          <motion.div
            className="w-9 h-9 rounded-full bg-muted border border-border text-foreground/60 flex items-center justify-center font-medium text-[11px]"
            animate={{ scale: hoveredSide ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            vs
          </motion.div>
        </div>

        {/* Mobile VS */}
        <div className="flex md:hidden items-center justify-center -my-1.5 relative z-10">
          <div className="w-7 h-7 rounded-full bg-muted border border-border text-foreground/60 flex items-center justify-center font-medium text-[10px]">
            vs
          </div>
        </div>

        {/* Sdn Bhd Side */}
        <motion.div
          className="relative p-4 sm:p-6 rounded-xl md:rounded-l-none bg-foreground text-background"
          onMouseEnter={() => setHoveredSide('sdnbhd')}
          onMouseLeave={() => setHoveredSide(null)}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
            <div className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center">
              <Buildings weight="regular" className="h-4 w-4 text-background" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-background">Sdn Bhd</h3>
              <p className="text-[11px] text-background/60">Private Limited Company</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-0 divide-y divide-background/10">
            {sdnBhdData.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2.5 sm:py-3 first:pt-0 last:pb-0">
                <div>
                  <span className="text-xs sm:text-sm text-background/70">{item.label}</span>
                  <p className="text-[10px] sm:text-[11px] text-background/40">{item.note}</p>
                </div>
                <span className="text-xs sm:text-sm font-medium text-background tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-5 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-background/10 text-[10px] sm:text-xs font-medium text-background/70">
              <CheckCircle weight="fill" className="h-3 w-3 text-background/40" />
              Tax optimization
            </span>
            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-background/10 text-[10px] sm:text-xs font-medium text-background/70">
              <CheckCircle weight="fill" className="h-3 w-3 text-background/40" />
              Asset protection
            </span>
          </div>

          {/* Best for */}
          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-background/10">
            <p className="text-[10px] sm:text-xs text-background/50 mb-0.5">Best for</p>
            <p className="text-xs sm:text-sm font-medium text-background">Profits above ~RM150k/year</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom insight */}
      <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6 sm:mt-8 max-w-sm mx-auto px-4">
        The crossover point is usually around <span className="font-medium text-foreground">RM100k–200k</span> profit.
        <span className="block mt-1 text-[10px] sm:text-xs text-muted-foreground/70">Your exact number depends on expenses, salary structure, and more.</span>
      </p>
    </div>
  );
}
