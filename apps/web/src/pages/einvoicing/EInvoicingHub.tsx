import { useState, useCallback, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
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
  Browser,
  Code,
  Warning,
  ShieldCheck,
  Confetti,
  Clock,
  Info,
  ArrowLeft,
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

function CircularProgress({ progress, size = 56, strokeWidth = 4 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const isComplete = progress === 100;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8DDD0" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isComplete ? '#5B8A72' : '#722F37'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {isComplete ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}>
            <CheckCircle weight="fill" className="w-6 h-6 text-[#5B8A72]" />
          </motion.div>
        ) : (
          <span className="text-sm font-semibold tabular-nums text-[#4A3728]">{progress}%</span>
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

      <div className="min-h-[calc(100vh-3.5rem)] w-full bg-[#FAF7F2] flex flex-col">
        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {/* Hero Section - Two column on desktop */}
            <div className={cn(
              'grid gap-8 lg:gap-12',
              result ? 'lg:grid-cols-[1fr,400px]' : 'lg:grid-cols-1 max-w-3xl mx-auto'
            )}>
              {/* Left Column - Always visible */}
              <div className="space-y-8">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(!result && 'text-center')}
                >
                  <div className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/60 border border-[#E8DDD0] text-xs font-medium text-[#6B5B4F]',
                    !result && 'mx-auto'
                  )}>
                    <Receipt weight="fill" className="h-3.5 w-3.5 text-[#722F37]" />
                    MyInvois Compliance Checker
                  </div>

                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-[#4A3728] mb-4">
                    When does e-invoicing
                    <br />
                    <span className="text-[#722F37] italic">apply to you?</span>
                  </h1>

                  <p className={cn('text-[#6B5B4F] text-base lg:text-lg mb-6', !result && 'max-w-md mx-auto')}>
                    Select your annual revenue to see your compliance timeline and get a personalized action plan.
                  </p>

                  {/* Status Badge */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={previewResult?.name || result?.name || 'default'}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className={cn('h-7 mb-4', !result && 'flex items-center justify-center')}
                    >
                      {previewResult && !result ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#8B7B6B]">
                          <Info weight="fill" className="w-3 h-3" />
                          {previewResult.id === 'exempt' ? 'Exempt from e-invoicing' : `${previewResult.name} – Tap to confirm`}
                        </span>
                      ) : result ? (
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
                          isExempt ? 'bg-[#5B8A72]/10 text-[#5B8A72]' : 'bg-[#722F37]/10 text-[#722F37]'
                        )}>
                          {isExempt ? <ShieldCheck weight="fill" className="w-3.5 h-3.5" /> : <CalendarBlank weight="fill" className="w-3.5 h-3.5" />}
                          {isExempt ? 'Exempt' : result.name}
                        </span>
                      ) : (
                        <span className="text-[11px] uppercase tracking-[0.15em] text-[#8B7B6B]/60">
                          Select your annual revenue
                        </span>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Revenue Selector */}
                  <div className={cn('flex flex-wrap gap-2', !result && 'justify-center')}>
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
                            'relative min-h-[44px] px-4 py-3 rounded-2xl text-sm font-medium transition-all touch-manipulation',
                            isSelected
                              ? tierExempt
                                ? 'bg-[#5B8A72] text-white'
                                : 'bg-[#722F37] text-white'
                              : isHovered && !result
                                ? 'bg-white border-2 border-[#D4C4B0] text-[#4A3728]'
                                : 'bg-white border-2 border-[#E8DDD0] text-[#4A3728] hover:bg-white hover:border-[#D4C4B0]'
                          )}
                        >
                          <span className="hidden sm:inline">{tier.label}</span>
                          <span className="sm:hidden">{tier.shortLabel}</span>
                          {tierExempt && !isSelected && (
                            <span className="absolute -top-1.5 -right-1.5 text-[10px] px-1.5 py-0.5 bg-[#5B8A72] text-white rounded-full font-bold">
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
                      className="flex items-center justify-center gap-1.5 text-[11px] text-[#8B7B6B]/50 mt-5"
                    >
                      <ShieldCheck weight="fill" className="w-3 h-3" />
                      Based on LHDN Dec 2025 guidelines
                    </motion.p>
                  )}
                </motion.div>

                {/* Action Section - Shows below header when result is selected */}
                <AnimatePresence mode="wait">
                  {result && !isExempt && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Tab Switcher */}
                      <div className="flex mb-6">
                        <div className="relative inline-flex items-center p-1 bg-white/60 border border-[#E8DDD0] rounded-2xl">
                          <motion.div
                            className="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm"
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
                                'relative z-10 flex items-center gap-2 min-h-[44px] px-5 rounded-xl text-sm font-medium transition-colors touch-manipulation',
                                activeTab === id ? 'text-[#4A3728]' : 'text-[#8B7B6B]'
                              )}
                            >
                              <Icon weight={activeTab === id ? 'fill' : 'regular'} className="w-4 h-4" />
                              {label}
                              {id === 'checklist' && checked.length > 0 && (
                                <span className={cn(
                                  'text-[11px] px-1.5 py-0.5 rounded-full font-semibold',
                                  checkProgress === 100 ? 'bg-[#5B8A72] text-white' : 'bg-[#F5EDE3] text-[#6B5B4F]'
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
                            {/* Step 1 - Identifiers (always visible) */}
                            <div className="p-4 rounded-2xl bg-white border border-[#E8DDD0]">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-[#722F37] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                                <div className="flex-1">
                                  <span className="font-semibold text-[#4A3728]">Get your identifiers</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {IDENTIFIER_ITEMS.map((item) => (
                                  <div key={item.code} className="flex items-center gap-2 px-3 py-2 bg-[#F5EDE3] rounded-xl">
                                    <span className="font-mono font-bold text-[#722F37] text-sm">{item.code}</span>
                                    <span className="text-xs text-[#6B5B4F]">{item.name}</span>
                                    {item.link && (
                                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#722F37] hover:text-[#5A252C]">→</a>
                                    )}
                                    {item.hasAction && (
                                      <button onClick={() => setShowIndustries(true)} className="text-xs font-medium text-[#722F37] hover:text-[#5A252C]">→</button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Step 2 - Submission Method (Featured) */}
                            <div className="p-4 rounded-2xl bg-[#722F37] text-white">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                                <div className="flex-1">
                                  <span className="font-semibold">Choose submission method</span>
                                </div>
                                <span className="text-[11px] px-2 py-1 bg-[#E5A84B] text-[#4A3728] rounded-full font-semibold">Recommended</span>
                              </div>
                              <p className="text-sm text-white/70 mb-3">Use accounting software integrated with MyInvois:</p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {INTEGRATED_SOFTWARE.map((sw) => (
                                  sw.comingSoon ? (
                                    <span key={sw.name} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white/40">
                                      {sw.name}
                                      <span className="text-[10px] px-1.5 py-0.5 bg-[#5B8A72] text-white rounded-full font-bold">Soon</span>
                                    </span>
                                  ) : (
                                    <a key={sw.name} href={sw.url} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors">
                                      {sw.name}
                                    </a>
                                  )
                                ))}
                              </div>
                              <div className="flex gap-4 pt-3 border-t border-white/10 text-xs">
                                <a href="https://myinvois.hasil.gov.my/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors">
                                  <Browser weight="duotone" className="w-4 h-4" /> Portal
                                </a>
                                <a href="https://sdk.myinvois.hasil.gov.my/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors">
                                  <Code weight="duotone" className="w-4 h-4" /> API
                                </a>
                              </div>
                            </div>

                            {/* Step 3 - Test & Go Live */}
                            <div className="p-4 rounded-2xl bg-white border border-[#E8DDD0]">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#5B8A72] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                                <div className="flex-1">
                                  <span className="font-semibold text-[#4A3728]">Test & go live</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-[#6B5B4F]">
                                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#E8DDD0]" />Sandbox</span>
                                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#5B8A72]" />Production</span>
                                </div>
                              </div>
                            </div>

                            {/* Industry Rules Link */}
                            <button
                              onClick={() => setShowIndustries(true)}
                              className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E8DDD0] text-left bg-white/60 hover:bg-white hover:border-[#D4C4B0] transition-all touch-manipulation"
                            >
                              <div className="flex items-center gap-2">
                                <Buildings weight="duotone" className="w-4 h-4 text-[#8B7B6B]" />
                                <span className="text-sm text-[#6B5B4F]">Industry-specific rules</span>
                              </div>
                              <CaretRight weight="bold" className="w-3 h-3 text-[#8B7B6B]" />
                            </button>
                          </motion.div>
                        )}

                        {activeTab === 'checklist' && (
                          <motion.div
                            key="checklist"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                          >
                            {/* Progress Header */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#E8DDD0]">
                              <div className="flex items-center gap-3">
                                <CircularProgress progress={checkProgress} size={48} strokeWidth={3} />
                                <div>
                                  <span className="font-semibold text-[#4A3728]">{checked.length} of {checklistItems.length}</span>
                                  <p className="text-xs text-[#8B7B6B]">tasks completed</p>
                                </div>
                              </div>
                              {checkProgress === 100 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5B8A72] text-white rounded-full text-xs font-medium"
                                >
                                  <Confetti weight="fill" className="w-3.5 h-3.5" />
                                  Ready!
                                </motion.div>
                              )}
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
                                      'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all touch-manipulation',
                                      isChecked
                                        ? 'bg-[#5B8A72]/5 border-[#5B8A72]/20'
                                        : item.urgent
                                          ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
                                          : 'bg-white border-[#E8DDD0] hover:border-[#D4C4B0]'
                                    )}
                                  >
                                    <div className={cn(
                                      'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                                      isChecked ? 'bg-[#5B8A72] border-[#5B8A72]' : item.urgent ? 'border-red-400' : 'border-[#D4C4B0]'
                                    )}>
                                      {isChecked && <CheckCircle weight="fill" className="w-4 h-4 text-white" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className={cn(
                                        'font-medium text-sm',
                                        isChecked ? 'text-[#8B7B6B] line-through' : item.urgent ? 'text-red-600' : 'text-[#4A3728]'
                                      )}>
                                        {item.label}
                                      </span>
                                      {item.description && !isChecked && (
                                        <span className="text-xs text-[#8B7B6B] ml-2">{item.description}</span>
                                      )}
                                    </div>
                                    {item.link && !isChecked && (
                                      <a
                                        href={item.link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-xs font-medium text-[#722F37] hover:text-[#5A252C] flex-shrink-0"
                                      >
                                        {item.link.label} →
                                      </a>
                                    )}
                                    {item.urgent && !isChecked && (
                                      <span className="text-[11px] px-2 py-0.5 bg-red-500 text-white rounded-full font-bold flex-shrink-0">!</span>
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Resources */}
                      <div className="flex items-center gap-6 mt-6 text-xs text-[#8B7B6B]">
                        <a href="https://sdk.myinvois.hasil.gov.my/sample/" target="_blank" rel="noopener noreferrer" className="hover:text-[#722F37] flex items-center gap-1 transition-colors">
                          Samples <ArrowSquareOut weight="bold" className="w-3 h-3" />
                        </a>
                        <a href="https://www.hasil.gov.my/media/0xqitc2t/lhdnm-e-invoice-general-faqs.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-[#722F37] flex items-center gap-1 transition-colors">
                          FAQ <ArrowSquareOut weight="bold" className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Exempt Message */}
                {isExempt && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-3xl bg-white/60 border border-[#E8DDD0]"
                  >
                    <p className="text-[#6B5B4F] mb-5">
                      Businesses under RM1 million are exempt from mandatory e-invoicing. You can still implement voluntarily.
                    </p>
                    <a
                      href="https://www.hasil.gov.my/en/e-invoice/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#722F37] text-white text-sm font-medium hover:bg-[#5A252C] transition-colors touch-manipulation"
                    >
                      Learn more <ArrowSquareOut weight="bold" className="w-4 h-4" />
                    </a>
                  </motion.div>
                )}
              </div>

              {/* Right Column - Status Card (shows when result is selected) */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="lg:sticky lg:top-8 h-fit"
                  >
                    <div
                      className={cn(
                        'p-6 rounded-3xl',
                        isExempt
                          ? 'bg-[#5B8A72]/10 border border-[#5B8A72]/20'
                          : 'bg-[#722F37] text-white'
                      )}
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className={cn(
                            'w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0',
                            isExempt ? 'bg-[#5B8A72]/20' : 'bg-white/10'
                          )}>
                            {isExempt ? (
                              <ShieldCheck weight="fill" className="w-8 h-8 text-[#5B8A72]" />
                            ) : (
                              <Clock weight="light" className="w-8 h-8 text-white" />
                            )}
                          </div>
                          <div>
                            {!isExempt && result.startDate ? (
                              <>
                                <div
                                  className="font-serif text-3xl font-normal tracking-tight"
                                >
                                  {new Date(result.startDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                                </div>
                                <div className="text-sm text-white/60 font-medium">
                                  {new Date(result.startDate).getFullYear()} Deadline
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  className="font-serif text-2xl font-normal text-[#4A3728]"
                                >
                                  No Deadline
                                </div>
                                <div className="text-sm text-[#5B8A72]">Voluntary compliance</div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Days Counter */}
                        {!isExempt && daysUntil !== null && (
                          <motion.div
                            className={cn(
                              'text-center p-6 rounded-2xl mb-6',
                              isVeryUrgent ? 'bg-red-500' : isUrgent ? 'bg-[#E5A84B]' : 'bg-white/10'
                            )}
                            animate={isVeryUrgent ? { scale: [1, 1.01, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <AnimatedNumber
                              value={daysUntil}
                              className="text-5xl font-normal tabular-nums block leading-none text-white"
                            />
                            <span className="text-xs uppercase tracking-wider font-semibold mt-2 block text-white/70">
                              days remaining
                            </span>
                          </motion.div>
                        )}

                        {/* Timeline */}
                        {!isExempt && (
                          <div className="pt-4 border-t border-white/10">
                            <p className="text-xs text-white/40 mb-3">Phase Timeline</p>
                            <div className="flex items-center gap-1">
                              {TIMELINE_PHASES.map((phase) => {
                                const isCurrent = phase.id === result.id;
                                const isPast = (phase.id as number) < (result.id as number);
                                return (
                                  <div key={phase.id} className="flex-1">
                                    <div className="relative">
                                      <div className={cn(
                                        'h-2 rounded-full transition-all',
                                        isCurrent ? 'bg-[#E5A84B]' : isPast ? 'bg-white/40' : 'bg-white/15'
                                      )} />
                                      {isCurrent && (
                                        <motion.div
                                          className="absolute -top-0.5 left-1/2 w-3 h-3 bg-[#E5A84B] rounded-full border-2 border-white"
                                          initial={{ scale: 0, x: '-50%' }}
                                          animate={{ scale: 1 }}
                                          transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                                        />
                                      )}
                                    </div>
                                    <div className={cn(
                                      'text-[11px] mt-2 text-center font-medium',
                                      isCurrent ? 'text-[#E5A84B]' : 'text-white/40'
                                    )}>
                                      P{phase.id}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Penalty Warning */}
                        {!isExempt && (
                          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-white/10 text-xs text-white/70">
                            <Warning weight="fill" className="w-4 h-4 text-[#E5A84B] flex-shrink-0" />
                            <span>Penalty: RM200 – RM20K or 6 months</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-4 p-4 rounded-2xl bg-white/60 border border-[#E8DDD0]">
                      <p className="text-xs text-[#8B7B6B] mb-3">Quick Links</p>
                      <div className="flex flex-wrap gap-2">
                        <a href="https://myinvois.hasil.gov.my/" target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-2 bg-[#F5EDE3] rounded-xl text-[#4A3728] hover:bg-[#E8DDD0] transition-colors">
                          MyInvois Portal
                        </a>
                        <a href="https://sdk.myinvois.hasil.gov.my/" target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-2 bg-[#F5EDE3] rounded-xl text-[#4A3728] hover:bg-[#E8DDD0] transition-colors">
                          SDK Docs
                        </a>
                        <a href="https://mytax.hasil.gov.my/" target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-2 bg-[#F5EDE3] rounded-xl text-[#4A3728] hover:bg-[#E8DDD0] transition-colors">
                          MyTax
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* ===== FOOTER ===== */}
        <footer className="py-5 border-t border-[#E8DDD0] bg-[#FFFCF9]/50">
          <div className="max-w-7xl mx-auto px-4 flex justify-center gap-6 text-xs text-[#8B7B6B]">
            <a href="https://myinvois.hasil.gov.my/" target="_blank" rel="noopener noreferrer" className="hover:text-[#722F37] transition-colors">MyInvois</a>
            <a href="https://sdk.myinvois.hasil.gov.my/" target="_blank" rel="noopener noreferrer" className="hover:text-[#722F37] transition-colors">SDK</a>
            <a href="https://mytax.hasil.gov.my/" target="_blank" rel="noopener noreferrer" className="hover:text-[#722F37] transition-colors">MyTax</a>
          </div>
        </footer>

        {/* ===== INDUSTRY BOTTOM SHEET ===== */}
        <AnimatePresence>
          {showIndustries && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeIndustries} />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="absolute bottom-0 left-0 right-0 bg-[#FAF7F2] rounded-t-3xl max-h-[80vh] flex flex-col safe-area-bottom lg:left-auto lg:right-4 lg:bottom-4 lg:w-[480px] lg:rounded-3xl lg:max-h-[70vh]"
              >
                {/* Handle - mobile only */}
                <div className="flex justify-center pt-3 pb-2 lg:hidden">
                  <div className="w-9 h-1 rounded-full bg-[#E8DDD0]" />
                </div>

                {/* Header */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-[#E8DDD0]">
                  <div className="flex items-center gap-2">
                    {selectedIndustryData && (
                      <button onClick={() => setSelectedIndustry(null)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F5EDE3] touch-manipulation transition-colors">
                        <ArrowLeft weight="bold" className="w-4 h-4 text-[#4A3728]" />
                      </button>
                    )}
                    <span
                      className="font-serif font-normal text-[#4A3728]"
                    >
                      {selectedIndustryData?.name || 'Industry Guide'}
                    </span>
                  </div>
                  <button onClick={closeIndustries} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F5EDE3] touch-manipulation transition-colors">
                    <X weight="bold" className="w-4 h-4 text-[#4A3728]" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-4">
                  <AnimatePresence mode="wait">
                    {selectedIndustryData ? (
                      <motion.div key="detail" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
                        <p className="text-sm text-[#6B5B4F]">{selectedIndustryData.summary}</p>
                        <div className={cn(
                          'rounded-2xl p-4 flex items-center gap-3',
                          selectedIndustryData.consolidatedAllowed ? 'bg-[#5B8A72]/10' : 'bg-[#F5EDE3]'
                        )}>
                          {selectedIndustryData.consolidatedAllowed ? (
                            <CheckCircle weight="fill" className="w-6 h-6 text-[#5B8A72]" />
                          ) : (
                            <X weight="bold" className="w-6 h-6 text-[#8B7B6B]" />
                          )}
                          <div>
                            <span className="font-medium text-[#4A3728] block">Consolidated: {selectedIndustryData.consolidatedAllowed ? 'Yes' : 'No'}</span>
                            {selectedIndustryData.consolidatedNotes && (
                              <span className="text-sm text-[#6B5B4F]">{selectedIndustryData.consolidatedNotes}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-[#8B7B6B] block mb-2">Key Points</span>
                          <div className="space-y-2">
                            {selectedIndustryData.keyPoints.map((point, i) => (
                              <div key={i} className="flex items-start gap-2.5 text-sm text-[#4A3728]">
                                <Circle weight="fill" className="w-1.5 h-1.5 text-[#722F37] mt-2 flex-shrink-0" />
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
                            className="flex items-center justify-center gap-2 w-full p-4 rounded-full bg-[#722F37] text-white font-medium text-sm hover:bg-[#5A252C] touch-manipulation transition-colors"
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
                            className="flex items-center gap-2 p-4 rounded-2xl border border-[#E8DDD0] bg-white/60 text-left hover:bg-white hover:border-[#D4C4B0] transition-all touch-manipulation min-h-[52px]"
                          >
                            <span className="flex-1 min-w-0 font-medium text-sm text-[#4A3728] truncate">{ind.name}</span>
                            {ind.consolidatedAllowed ? (
                              <CheckCircle weight="fill" className="w-5 h-5 text-[#5B8A72] flex-shrink-0" />
                            ) : (
                              <X weight="bold" className="w-5 h-5 text-[#8B7B6B] flex-shrink-0" />
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
