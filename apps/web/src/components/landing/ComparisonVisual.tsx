import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Buildings, CheckCircle } from 'phosphor-react';

/**
 * Interactive comparison visual showing Enterprise vs Sdn Bhd
 * Used on the landing page to highlight key differences
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
    <div className="relative max-w-4xl mx-auto mt-10 mb-4">
      {/* Card container */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">

        {/* Enterprise Side */}
        <motion.div
          className="relative p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-r-none bg-card border border-border cursor-pointer overflow-hidden"
          onMouseEnter={() => setHoveredSide('enterprise')}
          onMouseLeave={() => setHoveredSide(null)}
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div className="relative">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center">
                <User weight="duotone" className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Enterprise</h3>
                <p className="text-xs text-muted-foreground">Sole Proprietor / Partnership</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-0 divide-y divide-border/50">
              {enterpriseData.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3">
                  <div>
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <p className="text-[11px] text-muted-foreground/60">{item.note}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle weight="fill" className="h-3.5 w-3.5" />
                Quick to start
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle weight="fill" className="h-3.5 w-3.5" />
                Low overhead
              </span>
            </div>

            {/* Best for */}
            <div className="mt-5 pt-5 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Best for</p>
              <p className="text-sm font-medium text-foreground">Profits under ~RM150k/year</p>
            </div>
          </div>
        </motion.div>

        {/* Center VS Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex">
          <motion.div
            className="w-12 h-12 rounded-full bg-amber text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-amber/30"
            animate={{ scale: hoveredSide ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            VS
          </motion.div>
        </div>

        {/* Mobile VS */}
        <div className="flex md:hidden items-center justify-center -my-2 relative z-10">
          <div className="w-10 h-10 rounded-full bg-amber text-white flex items-center justify-center font-bold text-xs shadow-md">
            VS
          </div>
        </div>

        {/* Sdn Bhd Side */}
        <motion.div
          className="relative p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-l-none bg-foreground text-background cursor-pointer overflow-hidden"
          onMouseEnter={() => setHoveredSide('sdnbhd')}
          onMouseLeave={() => setHoveredSide(null)}
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div className="relative">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-background/10 border border-background/20 flex items-center justify-center">
                <Buildings weight="duotone" className="h-6 w-6 text-background" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-background">Sdn Bhd</h3>
                <p className="text-xs text-background/60">Private Limited Company</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-0 divide-y divide-background/10">
              {sdnBhdData.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3">
                  <div>
                    <span className="text-sm text-background/70">{item.label}</span>
                    <p className="text-[11px] text-background/40">{item.note}</p>
                  </div>
                  <span className="text-sm font-semibold text-background tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/10 text-xs font-medium text-background/80">
                <CheckCircle weight="fill" className="h-3.5 w-3.5" />
                Tax optimization
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/10 text-xs font-medium text-background/80">
                <CheckCircle weight="fill" className="h-3.5 w-3.5" />
                Asset protection
              </span>
            </div>

            {/* Best for */}
            <div className="mt-5 pt-5 border-t border-background/10">
              <p className="text-xs text-background/50 mb-1">Best for</p>
              <p className="text-sm font-medium text-background">Profits above ~RM150k/year</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom insight */}
      <p className="text-center text-sm text-muted-foreground mt-8 max-w-md mx-auto">
        The crossover point? Usually around <span className="font-semibold text-foreground">RM100k–200k</span> profit.
        <span className="block mt-1 text-xs opacity-70">But your mileage may vary — that's why we built this calculator.</span>
      </p>
    </div>
  );
}
