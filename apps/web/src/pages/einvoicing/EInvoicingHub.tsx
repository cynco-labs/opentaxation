import { useState, useCallback, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Receipt,
  CheckCircle,
  Circle,
  CaretRight,
  ArrowSquareOut,
  X,
  Buildings,
  CalendarBlank,
  Lightning,
  ListChecks,
  Plugs,
  Browser,
  Code,
  Warning,
  IdentificationCard,
  Rocket,
  ShieldCheck,
  Confetti,
  Clock,
  ArrowRight,
  Info,
} from 'phosphor-react';
import { cn } from '@/lib/utils';
import { getPhaseByRevenue, einvoicePhases, industries } from './data';

// =============================================================================
// CONSTANTS
// =============================================================================

const REVENUE_TIERS = [
  { id: 0, label: '< RM1M', value: 500_000, shortLabel: '<1M' },
  { id: 1, label: 'RM1M – 5M', value: 3_000_000, shortLabel: '1-5M' },
  { id: 2, label: 'RM5M – 25M', value: 15_000_000, shortLabel: '5-25M' },
  { id: 3, label: 'RM25M – 100M', value: 50_000_000, shortLabel: '25-100M' },
  { id: 4, label: '> RM100M', value: 150_000_000, shortLabel: '>100M' },
] as const;

const INTEGRATED_SOFTWARE: Array<{ name: string; url: string; comingSoon?: boolean }> = [
  { name: 'SQL Accounting', url: 'https://www.sql.com.my/' },
  { name: 'AutoCount', url: 'https://www.autocountsoft.com/' },
  { name: 'Xero', url: 'https://www.xero.com/my/' },
  { name: 'Cynco', url: 'https://cynco.io/', comingSoon: true },
];

const TIMELINE_PHASES = einvoicePhases.filter((p) => p.id !== 'exempt');

const IDENTIFIER_ITEMS: Array<{ code: string; name: string; link?: string; linkLabel?: string; hasAction?: boolean; actionLabel?: string }> = [
  { code: 'TIN', name: 'Tax ID Number', link: 'https://mytax.hasil.gov.my/', linkLabel: 'MyTax' },
  { code: 'BRN', name: 'Business Reg Number' },
  { code: 'MSIC', name: '5-digit Industry Code', hasAction: true, actionLabel: 'Find' },
];

// =============================================================================
// TYPES
// =============================================================================

type ChecklistItem = {
  id: string;
  label: string;
  description?: string;
  critical: boolean;
  urgent?: boolean;
  link?: { label: string; url: string };
};

type TabType = 'action' | 'checklist';

// =============================================================================
// UTILITIES
// =============================================================================

const getChecklistItems = (daysLeft: number | null, phaseName: string | null): ChecklistItem[] => {
  const isUrgent = daysLeft !== null && daysLeft <= 30;
  const isVeryUrgent = daysLeft !== null && daysLeft <= 14;

  return [
    { id: 'tin', label: 'Verify TIN', description: 'Tax Identification Number from LHDN', critical: true, link: { label: 'MyTax', url: 'https://mytax.hasil.gov.my/' } },
    { id: 'brn', label: 'Confirm BRN', description: 'Business Registration Number matches SSM', critical: true },
    { id: 'msic', label: 'Get MSIC code', description: '5-digit industry classification code', critical: true, link: { label: 'Find', url: 'https://www.ssm.com.my/' } },
    { id: 'myinvois', label: 'Register MyInvois', description: 'Create your account on the portal', critical: true, urgent: isUrgent, link: { label: 'Register', url: 'https://myinvois.hasil.gov.my/' } },
    { id: 'method', label: 'Choose method', description: 'Integrated software, portal, or API', critical: false },
    { id: 'test', label: 'Test sandbox', description: 'Validate in pre-production environment', critical: true, urgent: isUrgent, link: { label: 'SDK', url: 'https://sdk.myinvois.hasil.gov.my/' } },
    { id: 'golive', label: isVeryUrgent ? 'Go live NOW!' : isUrgent ? 'Go live soon' : 'Go live', description: phaseName && daysLeft !== null ? `${daysLeft} days until ${phaseName} deadline` : 'Switch to production when ready', critical: true, urgent: isVeryUrgent },
  ];
};

const calculateDaysUntil = (dateString: string | null): number | null => {
  if (!dateString) return null;
  return Math.max(0, Math.ceil((new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.5, ease: 'easeOut' });
    return controls.stop;
  }, [value, motionValue]);

  return <motion.span className={className}>{rounded}</motion.span>;
}

function CircularProgress({ progress, size = 48, strokeWidth = 3.5 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const isComplete = progress === 100;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-border" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          strokeLinecap="round"
          className={isComplete ? 'text-emerald-500' : 'text-foreground'}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {isComplete ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}>
            <CheckCircle weight="fill" className="w-5 h-5 text-emerald-500" />
          </motion.div>
        ) : (
          <span className="text-[11px] font-semibold tabular-nums text-foreground">{progress}%</span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function EInvoicingHub() {
  // State
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('action');
  const [showIndustries, setShowIndustries] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // Derived state
  const result = selectedTier !== null ? getPhaseByRevenue(REVENUE_TIERS[selectedTier].value) : null;
  const previewResult = hoveredTier !== null && selectedTier === null ? getPhaseByRevenue(REVENUE_TIERS[hoveredTier].value) : null;
  const isExempt = result?.id === 'exempt';
  const daysUntil = calculateDaysUntil(result?.startDate || null);
  const isUrgent = daysUntil !== null && daysUntil <= 30;
  const isVeryUrgent = daysUntil !== null && daysUntil <= 14;

  // Memoized values
  const checklistItems = useMemo(() => getChecklistItems(daysUntil, result?.name || null), [daysUntil, result?.name]);
  const checkProgress = Math.round((checked.length / checklistItems.length) * 100);
  const selectedIndustryData = useMemo(() => selectedIndustry ? industries.find((i) => i.id === selectedIndustry) : null, [selectedIndustry]);

  // Handlers
  const handleTierSelect = useCallback((tierId: number) => {
    setSelectedTier(tierId);
    setHoveredTier(null);
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setChecked((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }, []);

  const closeIndustries = useCallback(() => {
    setShowIndustries(false);
    setSelectedIndustry(null);
  }, []);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <>
      <Helmet>
        <title>E-Invoicing Malaysia 2025 | Check Your Status</title>
        <meta name="description" content="Interactive e-invoicing compliance checker for Malaysian businesses. Find your phase, deadline, and get a personalized action plan." />
      </Helmet>

      <div className="min-h-screen min-h-[100dvh] w-full bg-background flex flex-col">
        {/* ===== HEADER ===== */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40 supports-[backdrop-filter]:bg-background/80 safe-area-top">
          <div className="flex items-center justify-between h-14 px-4">
            <Link
              to="/"
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-xl active:bg-muted/70 transition-colors touch-manipulation"
              aria-label="Back to home"
            >
              <ArrowLeft weight="bold" className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-foreground flex items-center justify-center">
                <Receipt weight="fill" className="w-3.5 h-3.5 text-background" />
              </div>
              <span className="font-semibold text-sm">E-Invoicing</span>
            </div>
            <div className="w-10" />
          </div>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 overflow-y-auto overscroll-contain">
          {/* Hero Section */}
          <section className="px-4 pt-6 pb-4 sm:pt-10 sm:pb-6">
            <div className="max-w-lg mx-auto text-center">
              {/* Status Badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewResult?.name || result?.name || 'default'}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="h-7 mb-4 flex items-center justify-center"
                >
                  {previewResult && !result ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Info weight="fill" className="w-3 h-3" />
                      {previewResult.id === 'exempt' ? 'Exempt from e-invoicing' : `${previewResult.name} – Tap to confirm`}
                    </span>
                  ) : result ? (
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
                      isExempt ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-foreground/5 text-foreground'
                    )}>
                      {isExempt ? <ShieldCheck weight="fill" className="w-3.5 h-3.5" /> : <CalendarBlank weight="fill" className="w-3.5 h-3.5" />}
                      {isExempt ? 'Exempt' : result.name}
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                      Select your annual revenue
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Revenue Selector */}
              <div className="flex flex-wrap justify-center gap-2">
                {REVENUE_TIERS.map((tier, index) => {
                  const tierResult = getPhaseByRevenue(tier.value);
                  const tierExempt = tierResult.id === 'exempt';
                  const isSelected = selectedTier === tier.id;
                  const isHovered = hoveredTier === tier.id;

                  return (
                    <motion.button
                      key={tier.id}
                      onClick={() => handleTierSelect(tier.id)}
                      onHoverStart={() => !result && setHoveredTier(tier.id)}
                      onHoverEnd={() => setHoveredTier(null)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.25 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        'relative min-h-[44px] px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-sm font-medium transition-all touch-manipulation',
                        isSelected
                          ? tierExempt
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                            : 'bg-foreground text-background shadow-lg shadow-foreground/20'
                          : isHovered && !result
                            ? 'bg-muted border-2 border-foreground/20'
                            : 'bg-card border-2 border-border active:bg-muted/50'
                      )}
                    >
                      <span className="hidden sm:inline">{tier.label}</span>
                      <span className="sm:hidden">{tier.shortLabel}</span>
                      {tierExempt && !isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 text-[8px] px-1.5 py-0.5 bg-emerald-500 text-white rounded-full font-bold shadow-sm">
                          FREE
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Trust Indicator */}
              {!result && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/50 mt-5"
                >
                  <ShieldCheck weight="fill" className="w-3 h-3" />
                  Based on LHDN Dec 2025 guidelines
                </motion.p>
              )}
            </div>
          </section>

          {/* Result Section */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={String(result.id)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35 }}
              >
                {/* Status Card */}
                <section className="px-4 pb-5">
                  <div className="max-w-lg mx-auto">
                    <motion.div
                      className={cn(
                        'p-4 sm:p-5 rounded-2xl relative overflow-hidden',
                        isExempt
                          ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20'
                          : 'bg-foreground text-background'
                      )}
                      initial={{ scale: 0.96 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {/* Decorative Background */}
                      {!isExempt && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <div className="absolute -top-16 -right-16 w-32 h-32 bg-background/5 rounded-full blur-2xl" />
                          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-background/5 rounded-full blur-xl" />
                        </div>
                      )}

                      <div className="relative z-10">
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                              isExempt ? 'bg-emerald-500/20' : 'bg-background/10'
                            )}>
                              {isExempt ? (
                                <ShieldCheck weight="fill" className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Clock weight="light" className="w-6 h-6 text-background" />
                              )}
                            </div>
                            <div>
                              {!isExempt && result.startDate ? (
                                <>
                                  <div className="text-xl sm:text-2xl font-bold tracking-tight">
                                    {new Date(result.startDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                                  </div>
                                  <div className="text-sm text-background/60 font-medium">
                                    {new Date(result.startDate).getFullYear()} Deadline
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="text-xl font-bold">No Deadline</div>
                                  <div className="text-sm text-emerald-600 dark:text-emerald-400">Voluntary compliance</div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Days Counter */}
                          {!isExempt && daysUntil !== null && (
                            <motion.div
                              className={cn(
                                'text-center px-3 py-2 rounded-xl flex-shrink-0',
                                isVeryUrgent ? 'bg-red-500' : isUrgent ? 'bg-amber-500' : 'bg-background/10'
                              )}
                              animate={isVeryUrgent ? { scale: [1, 1.02, 1] } : {}}
                              transition={{ repeat: Infinity, duration: 2 }}
                            >
                              <AnimatedNumber
                                value={daysUntil}
                                className={cn(
                                  'text-2xl sm:text-3xl font-bold tabular-nums block leading-none',
                                  isVeryUrgent || isUrgent ? 'text-white' : 'text-background'
                                )}
                              />
                              <span className={cn(
                                'text-[9px] uppercase tracking-wider font-semibold mt-0.5 block',
                                isVeryUrgent || isUrgent ? 'text-white/80' : 'text-background/50'
                              )}>
                                days
                              </span>
                            </motion.div>
                          )}
                        </div>

                        {/* Timeline */}
                        {!isExempt && (
                          <div className="mt-4 pt-4 border-t border-background/10">
                            <div className="flex items-center gap-1">
                              {TIMELINE_PHASES.map((phase) => {
                                const isCurrent = phase.id === result.id;
                                const isPast = (phase.id as number) < (result.id as number);
                                return (
                                  <div key={phase.id} className="flex-1">
                                    <div className="relative">
                                      <div className={cn(
                                        'h-1.5 rounded-full transition-all',
                                        isCurrent ? 'bg-background' : isPast ? 'bg-background/40' : 'bg-background/15'
                                      )} />
                                      {isCurrent && (
                                        <motion.div
                                          className="absolute -top-0.5 left-1/2 w-2.5 h-2.5 bg-background rounded-full border-2 border-foreground"
                                          initial={{ scale: 0, x: '-50%' }}
                                          animate={{ scale: 1 }}
                                          transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                                        />
                                      )}
                                    </div>
                                    <div className={cn(
                                      'text-[9px] mt-1.5 text-center font-medium',
                                      isCurrent ? 'text-background' : 'text-background/40'
                                    )}>
                                      P{phase.id}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </section>

                {/* Action Section */}
                {!isExempt && (
                  <section className="px-4 pb-6">
                    <div className="max-w-lg mx-auto">
                      {/* Tab Switcher */}
                      <div className="flex justify-center mb-5">
                        <div className="relative inline-flex items-center p-1 bg-muted/50 rounded-xl">
                          <motion.div
                            className="absolute top-1 bottom-1 bg-background rounded-lg shadow-sm"
                            initial={false}
                            animate={{ left: activeTab === 'action' ? 4 : '50%', width: 'calc(50% - 4px)' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                          {[
                            { id: 'action' as const, label: 'Guide', Icon: Lightning },
                            { id: 'checklist' as const, label: 'Checklist', Icon: ListChecks },
                          ].map(({ id, label, Icon }) => (
                            <button
                              key={id}
                              onClick={() => setActiveTab(id)}
                              className={cn(
                                'relative z-10 flex items-center gap-2 min-h-[40px] px-4 rounded-lg text-sm font-medium transition-colors touch-manipulation',
                                activeTab === id ? 'text-foreground' : 'text-muted-foreground'
                              )}
                            >
                              <Icon weight={activeTab === id ? 'fill' : 'regular'} className="w-4 h-4" />
                              {label}
                              {id === 'checklist' && checked.length > 0 && (
                                <span className={cn(
                                  'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
                                  checkProgress === 100 ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                                )}>
                                  {checked.length}/{checklistItems.length}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tab Content */}
                      <AnimatePresence mode="wait">
                        {activeTab === 'action' && (
                          <motion.div
                            key="action"
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 16 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                          >
                            {/* Step 1 - Expandable */}
                            <button
                              onClick={() => setExpandedStep(expandedStep === 1 ? null : 1)}
                              className={cn(
                                'w-full p-4 rounded-2xl border text-left transition-all touch-manipulation',
                                expandedStep === 1 ? 'bg-card border-foreground/20' : 'bg-card border-border active:bg-muted/30'
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                                  <IdentificationCard weight="duotone" className="w-5 h-5 text-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-[10px] font-semibold text-muted-foreground block">STEP 1</span>
                                  <span className="font-semibold text-foreground">Get your identifiers</span>
                                </div>
                                <motion.div animate={{ rotate: expandedStep === 1 ? 90 : 0 }} transition={{ duration: 0.15 }}>
                                  <CaretRight weight="bold" className="w-4 h-4 text-muted-foreground" />
                                </motion.div>
                              </div>
                              <AnimatePresence>
                                {expandedStep === 1 && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pt-4 mt-4 border-t border-border space-y-3">
                                      {IDENTIFIER_ITEMS.map((item) => (
                                        <div key={item.code} className="flex items-center justify-between text-sm">
                                          <div className="flex items-center gap-3">
                                            <span className="font-mono font-bold text-foreground">{item.code}</span>
                                            <span className="text-muted-foreground">{item.name}</span>
                                          </div>
                                          {item.link && (
                                            <a
                                              href={item.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={(e) => e.stopPropagation()}
                                              className="text-xs font-medium text-foreground active:opacity-70 flex items-center gap-0.5"
                                            >
                                              {item.linkLabel} <ArrowRight weight="bold" className="w-3 h-3" />
                                            </a>
                                          )}
                                          {item.hasAction && (
                                            <span
                                              onClick={(e) => { e.stopPropagation(); setShowIndustries(true); }}
                                              className="text-xs font-medium text-foreground active:opacity-70 flex items-center gap-0.5 cursor-pointer"
                                            >
                                              {item.actionLabel} <ArrowRight weight="bold" className="w-3 h-3" />
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </button>

                            {/* Step 2 - Featured */}
                            <div className="p-4 rounded-2xl bg-foreground text-background">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center flex-shrink-0">
                                  <Plugs weight="duotone" className="w-5 h-5 text-background" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-semibold text-background/50">STEP 2</span>
                                    <span className="text-[9px] px-1.5 py-0.5 bg-background/20 rounded-full font-medium">Recommended</span>
                                  </div>
                                  <span className="font-semibold block">Choose submission method</span>
                                </div>
                              </div>
                              <p className="text-sm text-background/60 mb-3">Use accounting software already integrated with MyInvois.</p>
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {INTEGRATED_SOFTWARE.map((sw) => (
                                  sw.comingSoon ? (
                                    <span key={sw.name} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-background/5 border border-background/10 rounded-full text-background/40">
                                      {sw.name}
                                      <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500 text-white rounded-full font-bold">Soon</span>
                                    </span>
                                  ) : (
                                    <a
                                      key={sw.name}
                                      href={sw.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs px-2.5 py-1.5 bg-background/10 border border-background/20 rounded-full active:bg-background/20 transition-colors"
                                    >
                                      {sw.name}
                                    </a>
                                  )
                                ))}
                              </div>
                              <div className="flex gap-4 pt-3 border-t border-background/10">
                                <a href="https://myinvois.hasil.gov.my/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-background/50 active:text-background/70">
                                  <Browser weight="duotone" className="w-4 h-4" /> Portal
                                </a>
                                <a href="https://sdk.myinvois.hasil.gov.my/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-background/50 active:text-background/70">
                                  <Code weight="duotone" className="w-4 h-4" /> API
                                </a>
                              </div>
                            </div>

                            {/* Step 3 */}
                            <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                                  <Rocket weight="duotone" className="w-5 h-5 text-foreground" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-[10px] font-semibold text-muted-foreground block">STEP 3</span>
                                  <span className="font-semibold text-foreground">Test & go live</span>
                                </div>
                              </div>
                              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />Sandbox</span>
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />Validate</span>
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-foreground" />Production</span>
                              </div>
                            </div>

                            {/* Warning */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                              <Warning weight="fill" className="w-5 h-5 text-red-500/60 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">
                                <strong className="text-foreground">Penalty:</strong> RM200 – RM20K or 6 months
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {activeTab === 'checklist' && (
                          <motion.div
                            key="checklist"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.2 }}
                          >
                            {/* Progress Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-foreground">Your progress</h3>
                                <p className="text-sm text-muted-foreground">{checklistItems.length - checked.length} remaining</p>
                              </div>
                              <CircularProgress progress={checkProgress} />
                            </div>

                            {/* Checklist Items */}
                            <div className="space-y-2">
                              {checklistItems.map((item, index) => {
                                const isChecked = checked.includes(item.id);
                                return (
                                  <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => toggleCheck(item.id)}
                                    className={cn(
                                      'w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all touch-manipulation min-h-[60px]',
                                      isChecked
                                        ? 'bg-emerald-500/5 border-emerald-500/20'
                                        : item.urgent
                                          ? 'bg-red-500/5 border-red-500/20 active:bg-red-500/10'
                                          : 'bg-card border-border active:bg-muted/40'
                                    )}
                                  >
                                    <div className={cn(
                                      'w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                                      isChecked ? 'bg-emerald-500 border-emerald-500' : item.urgent ? 'border-red-400' : 'border-border'
                                    )}>
                                      <AnimatePresence>
                                        {isChecked && (
                                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                            <CheckCircle weight="fill" className="w-4 h-4 text-white" />
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className={cn(
                                        'font-medium text-sm block',
                                        isChecked ? 'text-muted-foreground line-through' : item.urgent ? 'text-red-600 dark:text-red-400' : 'text-foreground'
                                      )}>
                                        {item.label}
                                      </span>
                                      {item.description && <span className="text-xs text-muted-foreground mt-0.5 block">{item.description}</span>}
                                    </div>
                                    {item.link && !isChecked && (
                                      <a
                                        href={item.link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-xs font-medium text-foreground active:opacity-70 flex-shrink-0"
                                      >
                                        {item.link.label}
                                      </a>
                                    )}
                                    {item.urgent && !isChecked && (
                                      <span className="text-[9px] px-2 py-0.5 bg-red-500 text-white rounded-full font-bold flex-shrink-0">Urgent</span>
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>

                            {/* Completion */}
                            <AnimatePresence>
                              {checkProgress === 100 && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-center"
                                >
                                  <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>
                                    <Confetti weight="fill" className="w-10 h-10 mx-auto mb-2" />
                                  </motion.div>
                                  <div className="text-lg font-bold">All set!</div>
                                  <p className="text-sm text-white/80 mt-1">You're ready for compliance</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Industry Link */}
                      <button
                        onClick={() => setShowIndustries(true)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-border mt-5 text-left active:bg-muted/30 transition-colors touch-manipulation"
                      >
                        <div className="flex items-center gap-3">
                          <Buildings weight="duotone" className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <span className="text-sm font-medium block">Industry-specific rules</span>
                            <span className="text-xs text-muted-foreground">Consolidated invoices & more</span>
                          </div>
                        </div>
                        <CaretRight weight="bold" className="w-4 h-4 text-muted-foreground" />
                      </button>

                      {/* Resources */}
                      <div className="flex items-center justify-center gap-6 mt-5 text-xs text-muted-foreground">
                        <a href="https://sdk.myinvois.hasil.gov.my/sample/" target="_blank" rel="noopener noreferrer" className="active:text-foreground flex items-center gap-1">
                          Samples <ArrowSquareOut weight="bold" className="w-3 h-3" />
                        </a>
                        <a href="https://www.hasil.gov.my/media/0xqitc2t/lhdnm-e-invoice-general-faqs.pdf" target="_blank" rel="noopener noreferrer" className="active:text-foreground flex items-center gap-1">
                          FAQ <ArrowSquareOut weight="bold" className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </section>
                )}

                {/* Exempt CTA */}
                {isExempt && (
                  <section className="px-4 pb-6">
                    <div className="max-w-lg mx-auto text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Businesses under RM1 million are exempt from mandatory e-invoicing. You can still implement voluntarily.
                      </p>
                      <a
                        href="https://www.hasil.gov.my/en/e-invoice/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background text-sm font-medium active:opacity-90 transition-opacity touch-manipulation"
                      >
                        Learn more <ArrowSquareOut weight="bold" className="w-4 h-4" />
                      </a>
                    </div>
                  </section>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ===== FOOTER ===== */}
        <footer className="py-4 border-t border-border/50 safe-area-bottom">
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <a href="https://myinvois.hasil.gov.my/" target="_blank" rel="noopener noreferrer" className="active:text-foreground">MyInvois</a>
            <a href="https://sdk.myinvois.hasil.gov.my/" target="_blank" rel="noopener noreferrer" className="active:text-foreground">SDK</a>
            <a href="https://mytax.hasil.gov.my/" target="_blank" rel="noopener noreferrer" className="active:text-foreground">MyTax</a>
          </div>
        </footer>

        {/* ===== INDUSTRY BOTTOM SHEET ===== */}
        <AnimatePresence>
          {showIndustries && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeIndustries} />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[80vh] flex flex-col safe-area-bottom"
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-9 h-1 rounded-full bg-border" />
                </div>

                {/* Header */}
                <div className="px-4 py-2.5 flex items-center justify-between border-b border-border">
                  <div className="flex items-center gap-2">
                    {selectedIndustryData && (
                      <button onClick={() => setSelectedIndustry(null)} className="w-9 h-9 flex items-center justify-center rounded-lg active:bg-muted touch-manipulation">
                        <ArrowLeft weight="bold" className="w-4 h-4" />
                      </button>
                    )}
                    <span className="font-semibold">{selectedIndustryData?.name || 'Industry Guide'}</span>
                  </div>
                  <button onClick={closeIndustries} className="w-9 h-9 flex items-center justify-center rounded-lg active:bg-muted touch-manipulation">
                    <X weight="bold" className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-4">
                  <AnimatePresence mode="wait">
                    {selectedIndustryData ? (
                      <motion.div key="detail" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
                        <p className="text-sm text-muted-foreground">{selectedIndustryData.summary}</p>
                        <div className={cn(
                          'rounded-xl p-4 flex items-center gap-3',
                          selectedIndustryData.consolidatedAllowed ? 'bg-emerald-500/10' : 'bg-muted/50'
                        )}>
                          {selectedIndustryData.consolidatedAllowed ? (
                            <CheckCircle weight="fill" className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <X weight="bold" className="w-6 h-6 text-muted-foreground" />
                          )}
                          <div>
                            <span className="font-medium block">Consolidated: {selectedIndustryData.consolidatedAllowed ? 'Yes' : 'No'}</span>
                            {selectedIndustryData.consolidatedNotes && (
                              <span className="text-sm text-muted-foreground">{selectedIndustryData.consolidatedNotes}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">Key Points</span>
                          <div className="space-y-2">
                            {selectedIndustryData.keyPoints.map((point, i) => (
                              <div key={i} className="flex items-start gap-2.5 text-sm">
                                <Circle weight="fill" className="w-1.5 h-1.5 text-foreground mt-2 flex-shrink-0" />
                                <span>{point}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {selectedIndustryData.officialGuideUrl && (
                          <a
                            href={selectedIndustryData.officialGuideUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full p-3.5 rounded-xl bg-foreground text-background font-medium text-sm active:opacity-90 touch-manipulation"
                          >
                            <ArrowSquareOut weight="bold" className="w-4 h-4" /> Official Guide
                          </a>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-2">
                        {industries.map((ind) => (
                          <button
                            key={ind.id}
                            onClick={() => setSelectedIndustry(ind.id)}
                            className="flex items-center gap-2 p-3.5 rounded-xl border border-border text-left active:bg-muted/50 transition-colors touch-manipulation min-h-[52px]"
                          >
                            <span className="flex-1 min-w-0 font-medium text-sm truncate">{ind.name}</span>
                            {ind.consolidatedAllowed ? (
                              <CheckCircle weight="fill" className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <X weight="bold" className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
