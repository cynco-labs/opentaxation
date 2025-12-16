import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowElbowDownRight,
  User,
  Buildings,
  Coins,
  Receipt,
  Wallet,
  ChartLineUp,
  CheckCircle,
  CaretDown,
} from 'phosphor-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/UserMenu';
import { useState } from 'react';

interface CalculatorContentProps {
  onStart: () => void;
}

// Smooth easing
const smoothEase = [0.25, 0.1, 0.25, 1];

// Animation variants - only for one-time animations
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: smoothEase },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: smoothEase },
  },
};

// ============================================
// DECORATIVE COMPONENTS (Performance optimized)
// Using CSS animations instead of JS
// ============================================

// Topographic Map Background - Phosphor-inspired
function TopographicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute w-full h-full opacity-[0.35]"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Topographic contour lines */}
        <path
          d="M-100 400 Q 200 350, 400 380 T 800 360 T 1300 400"
          className="stroke-border"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M-100 450 Q 250 400, 500 420 T 900 400 T 1300 450"
          className="stroke-border"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M-100 500 Q 300 450, 550 470 T 950 450 T 1300 500"
          className="stroke-border"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M-100 550 Q 200 520, 450 540 T 850 520 T 1300 560"
          className="stroke-border"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M-100 300 Q 150 280, 350 300 T 700 280 T 1300 320"
          className="stroke-border"
          strokeWidth="1"
          fill="none"
        />

        {/* Closed contour - like a hill/peak */}
        <ellipse cx="900" cy="200" rx="120" ry="60" className="stroke-border" strokeWidth="1" fill="none" />
        <ellipse cx="900" cy="200" rx="80" ry="40" className="stroke-border" strokeWidth="1" fill="none" />
        <ellipse cx="900" cy="200" rx="40" ry="20" className="stroke-border" strokeWidth="1" fill="none" />

        {/* Another contour cluster */}
        <ellipse cx="200" cy="600" rx="100" ry="50" className="stroke-border" strokeWidth="1" fill="none" />
        <ellipse cx="200" cy="600" rx="60" ry="30" className="stroke-border" strokeWidth="1" fill="none" />
      </svg>

      {/* Scattered tax-themed icons with labels */}
      <div className="absolute top-[15%] left-[5%] flex flex-col items-center gap-1 opacity-40">
        <Receipt weight="light" className="h-6 w-6 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">receipt-light</span>
      </div>

      <div className="absolute top-[60%] left-[8%] flex flex-col items-center gap-1 opacity-40">
        <Wallet weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">wallet-light</span>
      </div>

      <div className="absolute top-[25%] right-[5%] flex flex-col items-center gap-1 opacity-40">
        <Buildings weight="light" className="h-6 w-6 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">buildings-light</span>
      </div>

      <div className="absolute top-[70%] right-[10%] flex flex-col items-center gap-1 opacity-40">
        <ChartLineUp weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">chart-line-up</span>
      </div>

      <div className="absolute bottom-[15%] left-[25%] flex flex-col items-center gap-1 opacity-40">
        <Coins weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">coins-light</span>
      </div>

      <div className="absolute top-[45%] right-[3%] flex flex-col items-center gap-1 opacity-40">
        <User weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">user-light</span>
      </div>

      {/* Place names - finance themed */}
      <span
        className="absolute top-[12%] right-[15%] text-[11px] text-muted-foreground/50 italic tracking-wide"
        style={{ fontFamily: 'ui-serif, Georgia, serif' }}
      >
        Profit Peak
      </span>
      <span
        className="absolute bottom-[25%] left-[15%] text-[11px] text-muted-foreground/50 italic tracking-wide"
        style={{ fontFamily: 'ui-serif, Georgia, serif' }}
      >
        Tax Valley
      </span>
      <span
        className="absolute top-[50%] left-[3%] text-[11px] text-muted-foreground/50 italic tracking-wide"
        style={{ fontFamily: 'ui-serif, Georgia, serif' }}
      >
        Deduction Bay
      </span>
      <span
        className="absolute bottom-[35%] right-[5%] text-[11px] text-muted-foreground/50 italic tracking-wide"
        style={{ fontFamily: 'ui-serif, Georgia, serif' }}
      >
        Crossover Point
      </span>
      <span
        className="absolute top-[35%] left-[12%] text-[11px] text-muted-foreground/50 italic tracking-wide"
        style={{ fontFamily: 'ui-serif, Georgia, serif' }}
      >
        EPF Heights
      </span>
    </div>
  );
}

// Floating Calculation Card - CSS animation for infinite float
function FloatingCalcCard({
  children,
  className,
  animationDelay = '0s',
  accent = false,
}: {
  children: React.ReactNode;
  className?: string;
  animationDelay?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`absolute pointer-events-none select-none animate-float ${className}`}
      style={{ animationDelay }}
    >
      <div className={`px-4 py-2.5 rounded-xl shadow-sm ${accent ? 'bg-amber/10 border border-amber/30' : 'bg-card border border-border'}`}>
        <span className={`text-sm font-mono ${accent ? 'text-amber' : 'text-muted-foreground'}`}>{children}</span>
      </div>
    </div>
  );
}

// Static Crossover Visualization - no scroll-linked animation
function CrossoverVisualization() {
  return (
    <div className="relative w-full max-w-lg mx-auto h-56 my-8">
      <svg
        viewBox="0 0 400 180"
        fill="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`h-${i}`}
            x1="50"
            y1={30 + i * 30}
            x2="370"
            y2={30 + i * 30}
            className="stroke-border/40"
            strokeWidth="1"
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={`v-${i}`}
            x1={50 + i * 53.3}
            y1="30"
            x2={50 + i * 53.3}
            y2="150"
            className="stroke-border/40"
            strokeWidth="1"
          />
        ))}

        {/* Enterprise line - solid */}
        <path
          d="M 50 140 C 120 130, 180 100, 210 90 S 300 60, 370 45"
          className="stroke-foreground"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Sdn Bhd line - dashed */}
        <path
          d="M 50 45 C 100 55, 160 75, 210 90 S 300 115, 370 135"
          className="stroke-muted-foreground"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 4"
          fill="none"
        />

        {/* Crossover point - amber accent */}
        <circle cx="210" cy="90" r="12" className="fill-amber/20" />
        <circle cx="210" cy="90" r="8" className="fill-background stroke-amber" strokeWidth="2" />
        <circle cx="210" cy="90" r="3" className="fill-amber" />

        {/* Labels */}
        <text x="375" y="48" className="fill-foreground text-[10px] font-medium">Enterprise</text>
        <text x="375" y="138" className="fill-muted-foreground text-[10px] font-medium">Sdn Bhd</text>
        <text x="25" y="90" className="fill-muted-foreground/60 text-[9px]" textAnchor="middle" transform="rotate(-90, 25, 90)">Tax Burden</text>
        <text x="210" y="172" className="fill-muted-foreground/60 text-[9px]" textAnchor="middle">Business Profit →</text>
      </svg>

      {/* Crossover label - amber accent */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2">
        <div className="px-3 py-1.5 rounded-full bg-amber text-white text-xs font-medium shadow-sm">
          Crossover Point
        </div>
      </div>
    </div>
  );
}

// Simple Balance Scale - CSS animation
function BalanceScale() {
  return (
    <div className="relative w-48 h-32 mx-auto my-8">
      <svg viewBox="0 0 200 120" fill="none" className="w-full h-full" aria-hidden="true">
        {/* Base */}
        <rect x="80" y="105" width="40" height="8" rx="2" className="fill-border" />
        {/* Pillar */}
        <rect x="96" y="45" width="8" height="60" rx="1" className="fill-foreground" />
        {/* Fulcrum */}
        <polygon points="100,45 90,55 110,55" className="fill-foreground" />

        {/* Beam with CSS animation */}
        <g className="origin-center animate-tilt" style={{ transformOrigin: '100px 45px' }}>
          <rect x="25" y="42" width="150" height="6" rx="3" className="fill-foreground" />
          <line x1="40" y1="48" x2="40" y2="70" className="stroke-foreground" strokeWidth="2" />
          <path d="M 20 70 Q 40 85, 60 70" className="stroke-foreground fill-none" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="160" y1="48" x2="160" y2="70" className="stroke-foreground" strokeWidth="2" />
          <path d="M 140 70 Q 160 85, 180 70" className="stroke-foreground fill-none" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>

      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-muted-foreground">
        <span>Enterprise</span>
        <span>Sdn Bhd</span>
      </div>
    </div>
  );
}

// ============================================
// UI COMPONENTS
// ============================================

function FAQItem({
  question,
  answer,
  isOpen,
  onClick
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void
}) {
  const answerId = `faq-answer-${question.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={answerId}
        className="w-full flex items-center justify-between gap-4 py-6 text-left group"
      >
        <span className="text-base font-medium text-foreground group-hover:text-foreground/70 transition-colors">
          {question}
        </span>
        <CaretDown
          weight="bold"
          aria-hidden="true"
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={answerId}
        role="region"
        aria-hidden={!isOpen}
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="pb-6 text-[15px] text-muted-foreground leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

function PillButton({
  children,
  onClick,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline';
  className?: string;
}) {
  const baseStyles = "inline-flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-medium transition-all duration-200 active:scale-[0.98]";
  const variants = {
    default: "bg-foreground text-background hover:bg-foreground/90",
    outline: "bg-transparent border border-border text-foreground hover:bg-muted/50",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

function ArrowLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-2 text-[15px] text-foreground hover:text-muted-foreground transition-colors group"
    >
      <ArrowElbowDownRight weight="regular" className="h-4 w-4 text-muted-foreground" />
      <span className="group-hover:underline underline-offset-4">{children}</span>
    </a>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CalculatorContent({ onStart }: CalculatorContentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const featureItems = [
    { icon: Wallet, textKey: "landingPage.know.keep" },
    { icon: Coins, textKey: "landingPage.know.takehome" },
    { icon: Receipt, textKey: "landingPage.know.epf" },
    { icon: Buildings, textKey: "landingPage.know.cost" },
    { icon: ChartLineUp, textKey: "landingPage.know.crossover" },
    { icon: CheckCircle, textKey: "landingPage.know.fit" },
  ];

  const faqItems = [
    { qKey: 'landingPage.faq.q1', aKey: 'landingPage.faq.a1' },
    { qKey: 'landingPage.faq.q2', aKey: 'landingPage.faq.a2' },
    { qKey: 'landingPage.faq.q3', aKey: 'landingPage.faq.a3' },
    { qKey: 'landingPage.faq.q4', aKey: 'landingPage.faq.a4' },
    { qKey: 'landingPage.faq.q5', aKey: 'landingPage.faq.a5' },
    { qKey: 'landingPage.faq.q6', aKey: 'landingPage.faq.a6' },
  ];

  return (
    <div className="min-h-full bg-background">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Topographic map background - Phosphor-inspired */}
        <TopographicBackground />

        {/* Floating calculation cards - CSS animated */}
        <FloatingCalcCard className="top-[20%] left-[8%] hidden lg:block" animationDelay="0s">
          RM 150,000 × 24%
        </FloatingCalcCard>
        <FloatingCalcCard className="top-[25%] right-[10%] hidden lg:block" animationDelay="1s">
          = RM 36,000
        </FloatingCalcCard>
        <FloatingCalcCard className="bottom-[28%] left-[10%] hidden lg:block" animationDelay="2s">
          EPF: 11%
        </FloatingCalcCard>
        <FloatingCalcCard className="bottom-[22%] right-[8%] hidden lg:block" animationDelay="3s" accent>
          Net: RM 114,000
        </FloatingCalcCard>

        <div className="relative z-10 container-content text-center py-20 sm:py-28 max-w-4xl">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="font-serif text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.5rem] font-normal leading-[1.1] tracking-tight text-foreground mb-8"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            {t('landingPage.hero.title1')}
            <br />
            {t('landingPage.hero.title2')}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            {t('landingPage.hero.subtitle')}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            {isLoading ? (
              <div className="h-12 w-40 bg-muted animate-pulse rounded-full" />
            ) : (
              <>
                <PillButton onClick={onStart}>
                  <span>{t('landingPage.hero.cta')}</span>
                  <ArrowRight weight="bold" className="h-4 w-4" />
                </PillButton>
                {user && (
                  <>
                    <PillButton variant="outline" onClick={() => navigate('/dashboard')}>
                      {t('landingPage.hero.dashboard')}
                    </PillButton>
                    <UserMenu />
                  </>
                )}
              </>
            )}
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="text-sm text-muted-foreground"
          >
            {t('landingPage.hero.free')}
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="text-xs text-muted-foreground/60 mt-3"
          >
            {t('landingPage.hero.socialProof')}
          </motion.p>
        </div>
      </section>

      {/* THE DECISION */}
      <section className="py-20 sm:py-28 bg-background-secondary">
        <div className="container-content text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">The Question</p>
          <h2
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal mb-4 text-foreground"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            Which structure keeps more in your pocket?
          </h2>
          <BalanceScale />
        </div>
      </section>

      {/* COMPARISON CARDS - Beautiful Contrast Design */}
      <section className="py-24 sm:py-32">
        <div className="container-content">
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-0 max-w-5xl mx-auto">

            {/* VS Badge - Center */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-14 h-14 rounded-full bg-amber text-white flex items-center justify-center font-bold text-sm shadow-lg">
                VS
              </div>
            </div>

            {/* Enterprise Card - Light & Clean */}
            <motion.div
              variants={staggerItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative p-8 sm:p-10 lg:rounded-l-3xl lg:rounded-r-none rounded-3xl bg-card border border-border lg:border-r-0 overflow-hidden group"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-muted/50 to-transparent" />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center">
                    <User weight="light" className="h-7 w-7 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-foreground">{t('landingPage.enterprise.title')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('landingPage.enterprise.subtitle')}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-5 mb-8">
                  {[
                    { label: t('landingPage.enterprise.taxRate'), value: t('landingPage.enterprise.taxRateValue') },
                    { label: t('landingPage.enterprise.setupCost'), value: t('landingPage.enterprise.setupCostValue') },
                    { label: t('landingPage.enterprise.compliance'), value: t('landingPage.enterprise.complianceValue') },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-lg font-semibold text-foreground tabular-nums">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-border via-border to-transparent mb-6" />

                {/* Description */}
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-foreground/5 text-foreground font-medium text-sm mr-2">
                    {t('landingPage.enterprise.highlight')}
                  </span>
                  {t('landingPage.enterprise.description')}
                </p>
              </div>
            </motion.div>

            {/* Sdn Bhd Card - Dark & Bold */}
            <motion.div
              variants={staggerItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative p-8 sm:p-10 lg:rounded-r-3xl lg:rounded-l-none rounded-3xl bg-foreground text-background overflow-hidden group"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-background/10 to-transparent" />
              {/* Subtle pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-background/10 border border-background/20 flex items-center justify-center">
                    <Buildings weight="light" className="h-7 w-7 text-background" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-semibold">{t('landingPage.sdnbhd.title')}</h3>
                    <p className="text-sm text-background/60 mt-1">{t('landingPage.sdnbhd.subtitle')}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-5 mb-8">
                  {[
                    { label: t('landingPage.sdnbhd.taxRate'), value: t('landingPage.sdnbhd.taxRateValue') },
                    { label: t('landingPage.sdnbhd.setupCost'), value: t('landingPage.sdnbhd.setupCostValue') },
                    { label: t('landingPage.sdnbhd.compliance'), value: t('landingPage.sdnbhd.complianceValue') },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-background/60">{item.label}</span>
                      <span className="text-lg font-semibold text-background tabular-nums">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-background/20 to-background/20 mb-6" />

                {/* Description */}
                <p className="text-[15px] text-background/70 leading-relaxed">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-amber text-white font-medium text-sm mr-2">
                    {t('landingPage.sdnbhd.highlight')}
                  </span>
                  {t('landingPage.sdnbhd.description')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CROSSOVER VISUALIZATION */}
      <section id="crossover" className="py-24 sm:py-32 bg-background-secondary">
        <div className="container-content">
          <div className="text-center mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">The Insight</p>
            <h2
              className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal mb-4 text-foreground"
              style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
            >
              {t('landingPage.magic.title')}{' '}
              <span className="italic">{t('landingPage.magic.range')}</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('landingPage.magic.below')} {t('landingPage.magic.above')}
            </p>
          </div>
          <CrossoverVisualization />
          <p className="text-center text-sm text-muted-foreground/70 mt-4">{t('landingPage.magic.caveat')}</p>
        </div>
      </section>

      {/* THE HONEST TRUTH - Bento Grid Style */}
      <section className="py-24 sm:py-32">
        <div className="container-content">
          <div className="text-center mb-16">
            <h2
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal mb-4 text-foreground"
              style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
            >
              {t('landingPage.truth.title')}
            </h2>
            <p className="text-muted-foreground">{t('landingPage.truth.subtitle')}</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {/* Large feature card */}
            <div className="md:row-span-2 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-foreground to-foreground/90 text-background relative overflow-hidden group">
              <div className="absolute top-6 right-6 text-[120px] font-bold leading-none text-background/5 select-none">
                01
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-background/10 flex items-center justify-center mb-6">
                  <ChartLineUp weight="light" className="h-6 w-6 text-background" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4">{t('landingPage.truth.noWinner.title')}</h3>
                <p className="text-background/70 leading-relaxed">{t('landingPage.truth.noWinner.desc')}</p>
              </div>
            </div>

            {/* Amber accent card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-amber/10 border border-amber/20 relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-[80px] font-bold leading-none text-amber/10 select-none">
                02
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center mb-5">
                  <Receipt weight="light" className="h-5 w-5 text-amber" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{t('landingPage.truth.hidden.title')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('landingPage.truth.hidden.desc')}</p>
              </div>
            </div>

            {/* Simple card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border relative overflow-hidden group hover:border-foreground/20 transition-colors">
              <div className="absolute top-4 right-4 text-[80px] font-bold leading-none text-foreground/5 select-none">
                03
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-5">
                  <Coins weight="light" className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{t('landingPage.truth.changed.title')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('landingPage.truth.changed.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL KNOW - Elegant Checklist */}
      <section id="features" className="py-24 sm:py-32 bg-background-secondary">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-foreground"
                style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
              >
                {t('landingPage.know.title')}
              </h2>
            </div>

            {/* Two-column checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
              {featureItems.map((item, idx) => (
                <div
                  key={item.textKey}
                  className="flex items-start gap-4 group"
                >
                  {/* Animated check circle */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    <div className="w-6 h-6 rounded-full border-2 border-amber flex items-center justify-center bg-amber/10 group-hover:bg-amber/20 transition-colors">
                      <CheckCircle weight="fill" className="h-4 w-4 text-amber" />
                    </div>
                  </div>
                  {/* Text */}
                  <div className="flex-1">
                    <span className="text-[15px] sm:text-base text-foreground font-medium leading-relaxed">
                      {t(item.textKey)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtle bottom decoration */}
            <div className="flex items-center justify-center gap-2 mt-12 text-muted-foreground/40">
              <div className="w-12 h-px bg-border" />
              <span className="text-xs uppercase tracking-widest">2 min</span>
              <div className="w-12 h-px bg-border" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 sm:py-32">
        <div className="container-content max-w-3xl">
          <div className="text-center mb-16">
            <h2
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-foreground"
              style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
            >
              {t('landingPage.faq.title')}
            </h2>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 sm:p-10">
            {faqItems.map((faq, idx) => (
              <FAQItem
                key={idx}
                question={t(faq.qKey)}
                answer={t(faq.aKey)}
                isOpen={openFAQ === idx}
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 sm:py-32 bg-background-secondary">
        <div className="container-content text-center max-w-2xl">
          <h2
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal mb-6 text-foreground"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            Ready to find out?
          </h2>
          <p className="text-muted-foreground mb-10 text-lg">
            Stop guessing. Get the numbers. Make the right decision.
          </p>
          <PillButton onClick={onStart}>
            <span>{t('landingPage.hero.cta')}</span>
            <ArrowRight weight="bold" className="h-4 w-4" />
          </PillButton>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 sm:py-20 border-t border-border">
        <div className="container-content">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            <ArrowLink href="https://github.com/hazlijohar95/opentaxation.my" external>GitHub</ArrowLink>
            <ArrowLink href="#features">Features</ArrowLink>
            <ArrowLink href="#faq">FAQ</ArrowLink>
            <ArrowLink href="#crossover">The Crossover</ArrowLink>
          </div>

          <div className="pt-8 border-t border-border text-center space-y-4">
            <p
              className="text-[15px] text-muted-foreground italic"
              style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
            >
              {t('landingPage.footer.disclaimer')}
            </p>
            <p className="text-sm text-muted-foreground/60">{t('landingPage.footer.vibeCoded')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
