import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowElbowDownRight,
  Coins,
  Receipt,
  Wallet,
  ChartLineUp,
  CheckCircle,
  GithubLogo,
  Star,
  Command,
  Buildings,
} from 'phosphor-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/UserMenu';
import SupportButton from '@/components/SupportButton';
import {
  TopographicBackground,
  ComparisonVisual,
  CrossoverVisualization,
  FAQItem,
  FloatingCalcCard,
} from '@/components/landing';
import { useState, useEffect, useCallback, memo } from 'react';

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
// UI COMPONENTS
// ============================================

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

// ============================================
// HERO CTA BUTTON - Premium Command+K Style
// ============================================
function HeroCTA({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMac, setIsMac] = useState(true);

  // Detect OS for keyboard shortcut display
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  // Handle Command+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative inline-flex items-center gap-3 pl-6 pr-4 py-3.5 rounded-2xl bg-foreground text-background overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Animated gradient background on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent skew-x-12"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '200%' : '-100%' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* Main content */}
      <span className="relative text-[15px] font-medium tracking-wide">
        {children}
      </span>

      {/* Keyboard shortcut badge */}
      <div className="relative flex items-center gap-1 px-2 py-1 rounded-lg bg-background/15 border border-background/20">
        {isMac ? (
          <Command weight="bold" className="h-3 w-3" />
        ) : (
          <span className="text-[11px] font-medium">Ctrl</span>
        )}
        <span className="text-[11px] font-semibold">K</span>
      </div>

      {/* Subtle arrow that appears on hover */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -4 }}
        transition={{ duration: 0.2 }}
      >
        <ArrowRight weight="bold" className="h-4 w-4" />
      </motion.div>

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-foreground/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10" />
    </motion.button>
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
// GITHUB STAR BADGE
// ============================================

function GitHubStarBadge() {
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch star count from GitHub API
    fetch('https://api.github.com/repos/hazlijohar95/opentaxation.my')
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count !== undefined) {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {
        // Silently fail - badge will just not show count
      });
  }, []);

  return (
    <motion.a
      href="https://github.com/hazlijohar95/opentaxation.my"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="group inline-flex items-center gap-3 mb-8"
    >
      {/* Main badge container */}
      <div className="relative inline-flex items-center">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-foreground/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-full bg-background border border-border/60 shadow-sm group-hover:border-foreground/20 group-hover:shadow-md transition-all duration-300">
          {/* GitHub icon with subtle animation */}
          <div className="relative">
            <GithubLogo
              weight="fill"
              className="h-5 w-5 text-foreground transition-transform duration-300 group-hover:scale-110"
            />
            {/* Subtle ring on hover */}
            <div className="absolute inset-0 rounded-full border border-foreground/20 scale-150 opacity-0 group-hover:opacity-100 group-hover:scale-[1.8] transition-all duration-500" />
          </div>

          {/* Separator dot */}
          <div className="w-1 h-1 rounded-full bg-border" />

          {/* Star section */}
          <div className="flex items-center gap-1.5">
            <Star
              weight="fill"
              className="h-4 w-4 text-amber-500 transition-all duration-300 group-hover:text-amber-400 group-hover:scale-110"
            />
            <span className="text-sm font-medium text-foreground">
              Star
            </span>
            {starCount !== null && (
              <>
                <div className="w-px h-3 bg-border mx-0.5" />
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {starCount}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Animated sparkle on hover */}
        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Star
            weight="fill"
            className="h-3 w-3 text-amber-400 animate-pulse"
          />
        </div>
      </div>
    </motion.a>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

const CalculatorContent = memo(function CalculatorContent({ onStart }: CalculatorContentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

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
          {/* GitHub Star Badge */}
          <GitHubStarBadge />

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
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-balance"
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
              <div className="h-14 w-48 bg-muted animate-pulse rounded-2xl" />
            ) : (
              <>
                <HeroCTA onClick={onStart}>
                  {t('landingPage.hero.cta')}
                </HeroCTA>
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

      {/* THE DECISION - Interactive Comparison */}
      <section className="py-20 sm:py-28 bg-background-secondary">
        <div className="container-content text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">The Question</p>
          <h2
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-foreground"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            Which structure keeps more in your pocket?
          </h2>
          <ComparisonVisual />
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
            <p className="text-muted-foreground max-w-lg mx-auto text-balance">
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
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Common Questions
            </p>
            <h2
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-foreground mb-4"
              style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
            >
              {t('landingPage.faq.title')}
            </h2>
            <p className="text-muted-foreground text-[15px] max-w-lg mx-auto text-balance">
              Everything you need to know about Enterprise vs <span className="whitespace-nowrap">Sdn Bhd</span>
            </p>
          </div>

          {/* FAQ Items - Card-style accordion */}
          <div className="space-y-3">
            {faqItems.map((faq, idx) => (
              <FAQItem
                key={idx}
                index={idx}
                question={t(faq.qKey)}
                answer={t(faq.aKey)}
                isOpen={openFAQ === idx}
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              />
            ))}
          </div>

          {/* Bottom helper text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-10"
          >
            Still have questions?{' '}
            <a
              href="mailto:hello@opentaxation.my"
              className="text-foreground underline underline-offset-4 hover:text-foreground/70 transition-colors"
            >
              Get in touch
            </a>
          </motion.p>
        </div>
      </section>

      {/* FINAL CTA - Stunning Visual Section */}
      <section className="relative py-32 sm:py-40 bg-foreground text-background overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating circles - respects prefers-reduced-motion */}
          <motion.div
            className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-background/[0.03] blur-3xl"
            animate={prefersReducedMotion ? {} : {
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-[15%] w-96 h-96 rounded-full bg-amber/[0.05] blur-3xl"
            animate={prefersReducedMotion ? {} : {
              y: [0, 20, 0],
              scale: [1, 0.95, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-background/[0.02] blur-3xl"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative container-content text-center max-w-3xl">
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-16 h-px bg-background/30 mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.3em] text-background/50 mb-6"
          >
            Take the next step
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-background"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            Ready to find out?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-background/60 mb-12 text-lg sm:text-xl max-w-xl mx-auto text-balance"
          >
            Stop guessing. Get the numbers. Make the right decision.
          </motion.p>

          {/* CTA Button - Inverted style for dark background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.button
              onClick={onStart}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-background text-foreground font-medium overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.8 }}
              />

              <span className="relative text-[15px]">{t('landingPage.hero.cta')}</span>
              <ArrowRight weight="bold" className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-12 text-sm text-background/40"
          >
            <span className="flex items-center gap-2">
              <CheckCircle weight="fill" className="h-4 w-4 text-background/30" />
              Free forever
            </span>
            <span className="w-1 h-1 rounded-full bg-background/20" />
            <span className="flex items-center gap-2">
              <CheckCircle weight="fill" className="h-4 w-4 text-background/30" />
              No signup required
            </span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-background/20" />
            <span className="hidden sm:flex items-center gap-2">
              <CheckCircle weight="fill" className="h-4 w-4 text-background/30" />
              YA 2024/2025 rates
            </span>
          </motion.div>
        </div>
      </section>

      {/* FOOTER - Clean & Modern */}
      <footer className="py-16 sm:py-20 bg-background">
        <div className="container-content">
          {/* Main footer content */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-12">
            {/* Logo & tagline */}
            <div className="flex flex-col gap-3">
              <a href="/" className="inline-flex items-center gap-2.5 group">
                {/* Mark - matches header Logo component */}
                <div className="relative flex-shrink-0 w-6 h-6">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" aria-hidden="true">
                    <path
                      d="M12 3a9 9 0 1 0 6.36 2.64"
                      className="stroke-foreground"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
                <span className="font-medium tracking-tight text-[17px] text-foreground">
                  opentaxation<span className="text-muted-foreground">.my</span>
                </span>
              </a>
              <p className="text-sm text-muted-foreground">
                Open-source tax calculator for Malaysian businesses
              </p>
            </div>

            {/* Navigation links */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              {[
                { href: "https://github.com/hazlijohar95/opentaxation.my", label: "GitHub", external: true },
                { href: "#features", label: "Features" },
                { href: "#faq", label: "FAQ" },
                { href: "#crossover", label: "The Crossover" },
              ].map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                  whileHover={{ y: -1 }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all group-hover:w-full" />
                </motion.a>
              ))}
              <SupportButton />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-8" />

          {/* Bottom section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p
              className="text-muted-foreground italic text-center sm:text-left max-w-2xl text-balance"
              style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
            >
              {t('landingPage.footer.disclaimer')}
            </p>
            <p className="text-muted-foreground/60 whitespace-nowrap">
              {t('landingPage.footer.vibeCoded')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
});

export default CalculatorContent;
