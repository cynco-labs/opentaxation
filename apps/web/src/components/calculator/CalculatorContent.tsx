import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  GithubLogo,
  User,
  Buildings,
  Coins,
  Receipt,
  Wallet,
  ChartLineUp,
  CheckCircle,
  Sparkle,
  Lightning,
  Plus,
  Minus,
} from 'phosphor-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/UserMenu';
import { useState } from 'react';

interface CalculatorContentProps {
  onStart: () => void;
}

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// FAQ Accordion Component
function FAQItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <motion.div
      className="group"
      initial={false}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 py-5 text-left border-b border-white/10 hover:border-white/20 transition-colors"
      >
        <span className="text-base sm:text-lg font-medium text-white/90 group-hover:text-white transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center"
        >
          <Plus weight="bold" className="h-3 w-3 text-white/60" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="py-4 text-sm sm:text-base text-white/60 leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function CalculatorContent({ onStart }: CalculatorContentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const featureItems = [
    { icon: Wallet, textKey: "landingPage.know.keep", gradient: "from-emerald-500 to-teal-500" },
    { icon: Coins, textKey: "landingPage.know.takehome", gradient: "from-amber-500 to-orange-500" },
    { icon: Receipt, textKey: "landingPage.know.epf", gradient: "from-blue-500 to-cyan-500" },
    { icon: Buildings, textKey: "landingPage.know.cost", gradient: "from-purple-500 to-pink-500" },
    { icon: ChartLineUp, textKey: "landingPage.know.crossover", gradient: "from-rose-500 to-red-500" },
    { icon: CheckCircle, textKey: "landingPage.know.fit", gradient: "from-teal-500 to-emerald-500" },
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
    <div className="min-h-full bg-[#0a0a0b] text-white overflow-hidden">
      {/* ============================================
          HERO SECTION - Dramatic with glowing orbs
          ============================================ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="glow-orb glow-orb-blue w-[600px] h-[600px] -top-48 -left-48"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="glow-orb glow-orb-purple w-[500px] h-[500px] top-1/4 -right-32"
            animate={{
              x: [0, -40, 0],
              y: [0, 50, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="glow-orb glow-orb-cyan w-[400px] h-[400px] bottom-0 left-1/3"
            animate={{
              x: [0, 30, 0],
              y: [0, -40, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-30" />

        {/* Spotlight effect */}
        <div className="absolute inset-0 spotlight" />

        {/* Grain overlay */}
        <div className="absolute inset-0 grain-overlay" />

        {/* Content */}
        <div className="relative z-10 container-content text-center py-20 sm:py-32">
          {/* Badge */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full premium-badge mb-8"
          >
            <Sparkle weight="fill" className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white/80">{t('landingPage.hero.free')}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="gradient-text">{t('landingPage.hero.title')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-lg sm:text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10"
          >
            {t('landingPage.hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isLoading ? (
              <div className="h-16 w-56 bg-white/10 animate-pulse rounded-2xl" />
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={onStart}
                  className="h-16 px-10 text-lg rounded-2xl bg-white text-black hover:bg-white/90 btn-shine group shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] transition-all duration-300"
                >
                  <span className="font-semibold">{t('landingPage.hero.cta')}</span>
                  <ArrowRight weight="bold" className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                {user && (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                      className="h-14 px-8 text-base rounded-2xl border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                    >
                      {t('landingPage.hero.dashboard')}
                    </Button>
                    <UserMenu />
                  </>
                )}
              </>
            )}
          </motion.div>

          {/* Social proof */}
          <motion.p
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="text-sm text-white/40 mt-10"
          >
            {t('landingPage.hero.socialProof')}
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================
          COMPARISON SECTION - Glass cards
          ============================================ */}
      <section className="relative py-24 sm:py-32">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />

        <div className="relative container-content">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {/* Enterprise Card */}
            <motion.div
              variants={staggerItem}
              className="group relative p-8 sm:p-10 rounded-3xl glass-card gradient-border hover:shadow-[0_0_60px_rgba(59,130,246,0.15)] transition-all duration-500"
            >
              <div className="flex items-start gap-5 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                  <User weight="duotone" className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">{t('landingPage.enterprise.title')}</h3>
                  <p className="text-sm text-white/50">{t('landingPage.enterprise.subtitle')}</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: t('landingPage.enterprise.taxRate'), value: t('landingPage.enterprise.taxRateValue') },
                  { label: t('landingPage.enterprise.setupCost'), value: t('landingPage.enterprise.setupCostValue') },
                  { label: t('landingPage.enterprise.compliance'), value: t('landingPage.enterprise.complianceValue') },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4 border-b border-white/10 last:border-0">
                    <span className="text-white/50">{item.label}</span>
                    <span className="font-semibold text-lg font-numbers text-white">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-white/50 leading-relaxed">
                  <strong className="text-emerald-400">{t('landingPage.enterprise.highlight')}</strong>{' '}
                  {t('landingPage.enterprise.description')}
                </p>
              </div>
            </motion.div>

            {/* Sdn Bhd Card */}
            <motion.div
              variants={staggerItem}
              className="group relative p-8 sm:p-10 rounded-3xl glass-card gradient-border hover:shadow-[0_0_60px_rgba(139,92,246,0.15)] transition-all duration-500"
            >
              <div className="flex items-start gap-5 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                  <Buildings weight="duotone" className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">{t('landingPage.sdnbhd.title')}</h3>
                  <p className="text-sm text-white/50">{t('landingPage.sdnbhd.subtitle')}</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: t('landingPage.sdnbhd.taxRate'), value: t('landingPage.sdnbhd.taxRateValue') },
                  { label: t('landingPage.sdnbhd.setupCost'), value: t('landingPage.sdnbhd.setupCostValue') },
                  { label: t('landingPage.sdnbhd.compliance'), value: t('landingPage.sdnbhd.complianceValue') },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4 border-b border-white/10 last:border-0">
                    <span className="text-white/50">{item.label}</span>
                    <span className="font-semibold text-lg font-numbers text-white">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-white/50 leading-relaxed">
                  <strong className="text-purple-400">{t('landingPage.sdnbhd.highlight')}</strong>{' '}
                  {t('landingPage.sdnbhd.description')}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Magic Number Insight */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
            <div className="relative p-10 sm:p-16 rounded-3xl glass-card text-center border border-white/10">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {t('landingPage.magic.title')}{' '}
                  <span className="gradient-text-blue">{t('landingPage.magic.range')}</span>
                </h2>
                <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-4">
                  {t('landingPage.magic.below')}<br className="hidden sm:inline" />
                  {t('landingPage.magic.above')}
                </p>
                <p className="text-sm text-white/40">
                  {t('landingPage.magic.caveat')}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          THE HONEST TRUTH - Bento Grid
          ============================================ */}
      <section className="relative py-24 sm:py-32">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
              {t('landingPage.truth.title')}
            </h2>
            <p className="text-lg text-white/50">{t('landingPage.truth.subtitle')}</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { icon: ChartLineUp, titleKey: 'landingPage.truth.noWinner.title', descKey: 'landingPage.truth.noWinner.desc', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Receipt, titleKey: 'landingPage.truth.hidden.title', descKey: 'landingPage.truth.hidden.desc', gradient: 'from-purple-500 to-pink-500' },
              { icon: Coins, titleKey: 'landingPage.truth.changed.title', descKey: 'landingPage.truth.changed.desc', gradient: 'from-amber-500 to-orange-500' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                className="group p-6 sm:p-8 rounded-2xl glass-card hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} bg-opacity-20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon weight="duotone" className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{t(item.titleKey)}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{t(item.descKey)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="divider-gradient mx-auto max-w-xl" />

      {/* ============================================
          WHAT YOU'LL GET - Feature Grid
          ============================================ */}
      <section className="relative py-24 sm:py-32">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              {t('landingPage.know.title')}
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6"
          >
            {featureItems.map((item, idx) => (
              <motion.div
                key={item.textKey}
                variants={staggerItem}
                className="group flex flex-col items-center text-center gap-4 p-6 sm:p-8 rounded-2xl glass-card hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} p-[1px] group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full rounded-2xl bg-[#0a0a0b] flex items-center justify-center">
                    <item.icon weight="duotone" className={`h-7 w-7 bg-gradient-to-br ${item.gradient} bg-clip-text`} style={{ color: 'currentColor' }} />
                  </div>
                </div>
                <span className="text-sm sm:text-base font-medium text-white/80 group-hover:text-white transition-colors">
                  {t(item.textKey)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
          FAQ SECTION - Minimalist Accordion
          ============================================ */}
      <section className="relative py-24 sm:py-32">
        <div className="container-content max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              {t('landingPage.faq.title')}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {faqItems.map((faq, idx) => (
              <FAQItem
                key={idx}
                question={t(faq.qKey)}
                answer={t(faq.aKey)}
                isOpen={openFAQ === idx}
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
          FINAL CTA SECTION
          ============================================ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 cta-gradient" />
          <motion.div
            className="glow-orb glow-orb-blue w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative container-content text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to find out?
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Stop guessing. Get the numbers. Make the right decision for your business.
            </p>
            <Button
              size="lg"
              onClick={onStart}
              className="h-16 px-12 text-lg rounded-2xl bg-white text-black hover:bg-white/90 btn-shine group shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] transition-all duration-300"
            >
              <Lightning weight="fill" className="mr-2 h-5 w-5" />
              <span className="font-semibold">{t('landingPage.hero.cta')}</span>
              <ArrowRight weight="bold" className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="relative py-16 border-t border-white/10">
        <div className="container-content text-center space-y-6">
          <a
            href="https://github.com/hazlijohar95/opentaxation.my"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <GithubLogo weight="duotone" className="h-5 w-5" />
            <span>{t('landingPage.footer.github')}</span>
          </a>

          <p className="text-xs text-white/30 max-w-md mx-auto leading-relaxed">
            {t('landingPage.footer.disclaimer')}
          </p>

          <p className="text-xs text-white/20 italic">
            {t('landingPage.footer.vibeCoded')}
          </p>
        </div>
      </footer>
    </div>
  );
}
