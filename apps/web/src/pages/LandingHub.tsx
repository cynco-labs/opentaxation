import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  GithubLogo,
  Star,
  Calculator,
  CalendarCheck,
  Receipt,
  CaretLeft,
  CaretRight,
  TrendUp,
  CheckCircle,
  Warning,
  ArrowRight,
} from 'phosphor-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';

// Tool app previews with mock UI
const TOOL_APPS = [
  {
    id: 'calculator',
    title: 'Tax Calculator',
    subtitle: 'Enterprise vs Sdn Bhd',
    path: '/calculator',
    color: '#722F37',
    preview: 'calculator',
  },
  {
    id: 'calendar',
    title: 'Tax Calendar',
    subtitle: 'Never miss a deadline',
    path: '/calendar',
    color: '#C4A484',
    preview: 'calendar',
  },
  {
    id: 'e-invoicing',
    title: 'E-Invoicing',
    subtitle: 'MyInvois compliance',
    path: '/e-invoicing',
    color: '#5B8A72',
    isNew: true,
    preview: 'einvoice',
  },
];

// Mini app preview components
function CalculatorPreview() {
  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
            <Calculator weight="fill" className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-medium text-white/80">Tax Calculator</span>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/60">YA 2025</div>
      </div>

      {/* Mock input */}
      <div className="bg-white/10 rounded-xl p-3">
        <p className="text-[10px] text-white/50 mb-1">Annual Business Profit</p>
        <p className="text-lg font-semibold text-white">RM 250,000</p>
      </div>

      {/* Results comparison */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-[10px] text-white/50 mb-1">Enterprise</p>
          <p className="text-sm font-semibold text-white">RM 42,850</p>
          <p className="text-[10px] text-red-300">Higher tax</p>
        </div>
        <div className="bg-white/20 rounded-xl p-3 ring-1 ring-white/30">
          <p className="text-[10px] text-white/50 mb-1">Sdn Bhd</p>
          <p className="text-sm font-semibold text-white">RM 31,200</p>
          <div className="flex items-center gap-1">
            <CheckCircle weight="fill" className="w-3 h-3 text-emerald-300" />
            <p className="text-[10px] text-emerald-300">Save RM 11,650</p>
          </div>
        </div>
      </div>

      {/* Chart bars */}
      <div className="flex items-end gap-2 h-12 pt-2">
        <div className="flex-1 bg-white/20 rounded-t" style={{ height: '100%' }} />
        <div className="flex-1 bg-emerald-400/60 rounded-t" style={{ height: '73%' }} />
      </div>
    </div>
  );
}

function CalendarPreview() {
  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
            <CalendarCheck weight="fill" className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-medium text-white/80">Tax Calendar</span>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/60">2025</div>
      </div>

      {/* Upcoming deadline */}
      <div className="bg-white/10 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <Warning weight="fill" className="w-4 h-4 text-amber-300" />
          <span className="text-[10px] font-medium text-amber-300">Due in 45 days</span>
        </div>
        <p className="text-sm font-semibold text-white">Form BE Submission</p>
        <p className="text-[10px] text-white/50">Individual tax return</p>
      </div>

      {/* Mini calendar grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-[8px] text-white/40">{d}</div>
        ))}
        {Array.from({ length: 28 }, (_, i) => (
          <div
            key={i}
            className={`text-[9px] py-0.5 rounded ${
              i === 14 ? 'bg-amber-400 text-[#4A3728] font-bold' :
              i === 29 ? 'bg-red-400 text-white font-bold' :
              'text-white/60'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-3 text-[9px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-white/50">Form BE</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-white/50">CP204</span>
        </div>
      </div>
    </div>
  );
}

function EInvoicePreview() {
  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
            <Receipt weight="fill" className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-medium text-white/80">E-Invoicing</span>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-[10px] text-emerald-300 font-medium">NEW</div>
      </div>

      {/* Compliance status */}
      <div className="bg-white/10 rounded-xl p-3">
        <p className="text-[10px] text-white/50 mb-1">Your Revenue Band</p>
        <p className="text-sm font-semibold text-white">RM 25M - RM 100M</p>
        <div className="flex items-center gap-1 mt-1">
          <TrendUp weight="bold" className="w-3 h-3 text-emerald-300" />
          <p className="text-[10px] text-emerald-300">Mandatory from 1 Jan 2025</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <p className="text-[10px] text-white/50">Implementation Timeline</p>
        <div className="space-y-1.5">
          {[
            { phase: 'Phase 1', date: '1 Aug 2024', done: true },
            { phase: 'Phase 2', date: '1 Jan 2025', done: true },
            { phase: 'Phase 3', date: '1 Jul 2025', done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.done ? 'bg-emerald-400' : 'bg-white/20'}`}>
                {item.done && <CheckCircle weight="fill" className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1 flex justify-between">
                <span className="text-[10px] text-white/80">{item.phase}</span>
                <span className="text-[10px] text-white/50">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA hint */}
      <div className="flex items-center justify-center gap-1 text-[10px] text-white/60">
        <span>Check your timeline</span>
        <ArrowRight weight="bold" className="w-3 h-3" />
      </div>
    </div>
  );
}

export default function LandingHub() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [starCount, setStarCount] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/hazlijohar95/opentaxation.my')
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count !== undefined) {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);

  const scrollTo = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, TOOL_APPS.length - 1));
    setActiveIndex(newIndex);
    if (carouselRef.current) {
      // Use smaller card width on mobile (sm breakpoint = 640px)
      const isMobile = window.innerWidth < 640;
      const cardWidth = isMobile ? 260 : 280;
      const gap = 16;
      carouselRef.current.scrollTo({
        left: newIndex * (cardWidth + gap),
        behavior: 'smooth',
      });
    }
  };

  const PreviewComponents: Record<string, React.FC> = {
    calculator: CalculatorPreview,
    calendar: CalendarPreview,
    einvoice: EInvoicePreview,
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#FAF7F2] flex flex-col">
      {/* Main Content - Single viewport hero */}
      <main className="flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Headline */}
              <h1 className="font-serif text-[38px] sm:text-[48px] lg:text-[56px] leading-[1.1] font-normal text-[#4A3728] mb-5">
                {user ? (
                  <>Welcome back,<br />{user.user_metadata?.full_name?.split(' ')[0] || 'there'}</>
                ) : (
                  <>Malaysian Tax<br />Tools, Simplified</>
                )}
              </h1>

              {/* Description */}
              <p className="text-lg text-[#6B5B4F] mb-8 max-w-md leading-relaxed">
                {user
                  ? 'Your tax toolkit is ready. Continue where you left off.'
                  : 'Free, open-source tools for smarter tax decisions. Compare structures, track deadlines, stay compliant.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => navigate('/calculator')}
                  className="px-7 py-3.5 rounded-full bg-[#E5A84B] text-[#4A3728] font-medium hover:bg-[#D9A045] transition-colors"
                >
                  Open Calculator
                </button>
                <button
                  onClick={() => navigate('/docs')}
                  className="px-7 py-3.5 rounded-full border border-[#D4C4B0] text-[#4A3728] font-medium hover:bg-[#F5EDE3] transition-colors"
                >
                  Read the Docs
                </button>
              </div>

              {/* Social proof */}
              <div>
                <p className="text-sm text-[#8B7B6B] mb-3">Open source</p>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/hazlijohar95/opentaxation.my"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#E8DDD0] bg-white/50 hover:bg-white transition-colors"
                  >
                    <GithubLogo weight="fill" className="h-4 w-4 text-[#4A3728]" />
                    <span className="text-sm font-medium text-[#4A3728]">GitHub</span>
                    <span className="w-px h-4 bg-[#E8DDD0]" />
                    <Star weight="fill" className="h-3.5 w-3.5 text-[#E5A84B]" />
                    <span className="text-sm font-medium text-[#4A3728]">{starCount ?? '—'}</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right: Netflix-style app carousel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
            >
              {/* Carousel navigation */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-[#8B7B6B]">Explore Tools</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollTo(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border border-[#E8DDD0] flex items-center justify-center hover:bg-[#F5EDE3] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <CaretLeft weight="bold" className="w-4 h-4 text-[#4A3728]" />
                  </button>
                  <button
                    onClick={() => scrollTo(activeIndex + 1)}
                    disabled={activeIndex === TOOL_APPS.length - 1}
                    className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border border-[#E8DDD0] flex items-center justify-center hover:bg-[#F5EDE3] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <CaretRight weight="bold" className="w-4 h-4 text-[#4A3728]" />
                  </button>
                </div>
              </div>

              {/* Carousel container */}
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {TOOL_APPS.map((app) => {
                  const Preview = PreviewComponents[app.preview];
                  return (
                    <motion.button
                      key={app.id}
                      onClick={() => navigate(app.path)}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative flex-shrink-0 w-[260px] sm:w-[280px] h-[320px] sm:h-[340px] rounded-3xl overflow-hidden snap-start cursor-pointer group"
                      style={{ backgroundColor: app.color }}
                    >
                      {/* NEW badge */}
                      {app.isNew && (
                        <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-semibold text-white">
                          NEW
                        </div>
                      )}

                      {/* App preview content */}
                      <div className="h-full flex flex-col">
                        {/* Preview UI */}
                        <div className="flex-1">
                          <Preview />
                        </div>

                        {/* Bottom label */}
                        <div className="p-4 pt-0 flex items-center justify-between">
                          <div>
                            <p className="font-serif text-base font-medium text-white">
                              {app.title}
                            </p>
                            <p className="text-xs text-white/60">{app.subtitle}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <ArrowRight weight="bold" className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </motion.button>
                  );
                })}
              </div>

              {/* Carousel dots */}
              <div className="flex justify-center gap-2 mt-2">
                {TOOL_APPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeIndex ? 'w-6 bg-[#4A3728]' : 'w-1.5 bg-[#D4C4B0]'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer - Simple dark bar */}
      <footer className="bg-[#4A3728] py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[#C4B8A8]">
          <p>&copy; {new Date().getFullYear()} OpenTaxation</p>
          <p className="font-serif italic text-[#9B8E7E] order-first sm:order-none">
            {t('landingPage.footer.vibeCoded')}
          </p>
          <div className="flex items-center gap-4">
            <Link to="/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <a
              href="https://github.com/hazlijohar95/opentaxation.my"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
