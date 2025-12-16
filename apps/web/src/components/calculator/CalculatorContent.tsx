import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowRight,
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
} from '@/components/landing';
import { useState, useEffect, memo } from 'react';

interface CalculatorContentProps {
  onStart: () => void;
}

// Smooth easing
const smoothEase = [0.25, 0.1, 0.25, 1];

// Reduced animation for mobile - shorter duration, less movement
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: delay * 0.8, ease: smoothEase },
  }),
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
  const baseStyles = "inline-flex items-center gap-2 px-6 py-3 sm:py-3 rounded-full text-[15px] font-medium transition-all duration-200 active:scale-95 active:opacity-90";
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
      whileTap={{ scale: 0.95, opacity: 0.9 }}
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
      <section className="relative flex items-center justify-center overflow-hidden">
        {/* Subtle topographic background - desktop only */}
        <div className="hidden sm:block">
          <TopographicBackground />
        </div>

        <div className="relative z-10 container-content text-center py-10 sm:py-16 lg:py-24 max-w-4xl px-4 sm:px-6">
          {/* GitHub Star Badge */}
          <GitHubStarBadge />

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="font-serif text-[1.75rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.75rem] font-normal leading-[1.15] tracking-tight text-foreground mb-5 sm:mb-6"
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
            className="text-[15px] sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-6 sm:mb-10 text-balance"
          >
            {t('landingPage.hero.subtitle')}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-10"
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
      <section className="py-12 sm:py-20 bg-background-secondary">
        <div className="container-content text-center px-4 sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3">The Question</p>
          <h2
            className="font-serif text-xl sm:text-2xl md:text-3xl font-normal text-foreground"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            Which structure keeps more in your pocket?
          </h2>
          <ComparisonVisual />
        </div>
      </section>

      {/* CROSSOVER VISUALIZATION */}
      <section id="crossover" className="py-12 sm:py-20 bg-background-secondary">
        <div className="container-content px-4 sm:px-6">
          <div className="text-center mb-2">
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3">The Insight</p>
            <h2
              className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal mb-3 text-foreground"
              style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
            >
              {t('landingPage.magic.title')}{' '}
              <span className="italic">{t('landingPage.magic.range')}</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto text-balance">
              {t('landingPage.magic.below')} {t('landingPage.magic.above')}
            </p>
          </div>
          <CrossoverVisualization />
          <p className="text-center text-xs sm:text-sm text-muted-foreground/70 mt-3">{t('landingPage.magic.caveat')}</p>
        </div>
      </section>

      {/* THE HONEST TRUTH - Bento Grid Style */}
      <section className="py-12 sm:py-20">
        <div className="container-content px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2
              className="font-serif text-xl sm:text-2xl md:text-3xl font-normal mb-3 text-foreground"
              style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
            >
              {t('landingPage.truth.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">{t('landingPage.truth.subtitle')}</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {/* Large feature card */}
            <div className="md:row-span-2 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-foreground text-background relative overflow-hidden">
              <div className="absolute top-4 right-4 text-[60px] sm:text-[80px] font-bold leading-none text-background/5 select-none">
                01
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center mb-4 sm:mb-5">
                  <ChartLineUp weight="light" className="h-5 w-5 text-background" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">{t('landingPage.truth.noWinner.title')}</h3>
                <p className="text-sm sm:text-base text-background/70 leading-relaxed">{t('landingPage.truth.noWinner.desc')}</p>
              </div>
            </div>

            {/* Muted accent card */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-muted/50 border border-border relative overflow-hidden">
              <div className="absolute top-3 right-3 text-[50px] sm:text-[60px] font-bold leading-none text-foreground/5 select-none">
                02
              </div>
              <div className="relative z-10">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <Receipt weight="light" className="h-4 w-4 text-foreground" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{t('landingPage.truth.hidden.title')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('landingPage.truth.hidden.desc')}</p>
              </div>
            </div>

            {/* Simple card */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border border-border relative overflow-hidden">
              <div className="absolute top-3 right-3 text-[50px] sm:text-[60px] font-bold leading-none text-foreground/5 select-none">
                03
              </div>
              <div className="relative z-10">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <Coins weight="light" className="h-4 w-4 text-foreground" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{t('landingPage.truth.changed.title')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('landingPage.truth.changed.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL KNOW - Elegant Checklist */}
      <section id="features" className="py-12 sm:py-20 bg-background-secondary">
        <div className="container-content px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2
                className="font-serif text-xl sm:text-2xl md:text-3xl font-normal text-foreground"
                style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
              >
                {t('landingPage.know.title')}
              </h2>
            </div>

            {/* Two-column checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-5">
              {featureItems.map((item) => (
                <div
                  key={item.textKey}
                  className="flex items-start gap-3"
                >
                  {/* Check circle */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full border border-foreground/20 flex items-center justify-center bg-muted/50">
                      <CheckCircle weight="fill" className="h-3.5 w-3.5 text-foreground/60" />
                    </div>
                  </div>
                  {/* Text */}
                  <span className="text-sm sm:text-[15px] text-foreground leading-relaxed">
                    {t(item.textKey)}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtle bottom decoration */}
            <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10 text-muted-foreground/40">
              <div className="w-8 h-px bg-border" />
              <span className="text-[10px] uppercase tracking-widest">2 min</span>
              <div className="w-8 h-px bg-border" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-12 sm:py-20">
        <div className="container-content max-w-3xl px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
              Common Questions
            </p>
            <h2
              className="font-serif text-xl sm:text-2xl md:text-3xl font-normal text-foreground mb-3"
              style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
            >
              {t('landingPage.faq.title')}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto text-balance">
              Everything you need to know about Enterprise vs <span className="whitespace-nowrap">Sdn Bhd</span>
            </p>
          </div>

          {/* FAQ Items - Card-style accordion */}
          <div className="space-y-2 sm:space-y-3">
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
          <p className="text-center text-sm text-muted-foreground mt-8">
            Still have questions?{' '}
            <a
              href="mailto:hello@opentaxation.my"
              className="text-foreground underline underline-offset-4 hover:text-foreground/70 transition-colors"
            >
              Get in touch
            </a>
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-14 sm:py-20 lg:py-24 bg-foreground text-background overflow-hidden">
        {/* Content */}
        <div className="relative container-content text-center max-w-2xl px-4 sm:px-6">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-background/40 mb-4 sm:mb-5">
            Take the next step
          </p>

          <h2
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal mb-4 sm:mb-5 text-background"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            Ready to find out?
          </h2>

          <p className="text-sm sm:text-base text-background/60 mb-8 sm:mb-10 max-w-md mx-auto text-balance">
            Stop guessing. Get the numbers. Make the right decision.
          </p>

          {/* CTA Button */}
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-background text-foreground font-medium active:scale-95 active:opacity-90 transition-transform"
          >
            <span className="text-sm sm:text-[15px]">{t('landingPage.hero.cta')}</span>
            <ArrowRight weight="bold" className="h-4 w-4" />
          </button>

          {/* Trust indicators - stacked on mobile */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-8 sm:mt-10 text-xs sm:text-sm text-background/40">
            <span className="flex items-center gap-1.5">
              <CheckCircle weight="fill" className="h-3.5 w-3.5 text-background/30" />
              Free forever
            </span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-background/20" />
            <span className="flex items-center gap-1.5">
              <CheckCircle weight="fill" className="h-3.5 w-3.5 text-background/30" />
              No signup required
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 sm:py-14 bg-background border-t border-border">
        <div className="container-content px-4 sm:px-6">
          {/* Main footer content */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            {/* Logo & tagline */}
            <div className="flex flex-col gap-2">
              <a href="/" className="inline-flex items-center gap-2 group">
                <div className="relative flex-shrink-0 w-5 h-5">
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
                <span className="font-medium tracking-tight text-[15px] text-foreground">
                  opentaxation<span className="text-muted-foreground">.my</span>
                </span>
              </a>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Open-source tax calculator for Malaysian businesses
              </p>
            </div>

            {/* Navigation links */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {[
                { href: "https://github.com/hazlijohar95/opentaxation.my", label: "GitHub", external: true },
                { href: "#features", label: "Features" },
                { href: "#faq", label: "FAQ" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <SupportButton />
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-6 border-t border-border">
            <p
              className="text-xs text-muted-foreground/70 italic text-center sm:text-left max-w-xl text-balance"
              style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
            >
              {t('landingPage.footer.disclaimer')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
});

export default CalculatorContent;
