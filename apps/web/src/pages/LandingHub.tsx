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
import { useState, useEffect, useRef } from 'react';

// Tool app previews with mock UI
const TOOL_APPS = [
  {
    id: 'calculator',
    title: 'Tax Calculator',
    subtitle: 'Enterprise vs Sdn Bhd',
    path: '/calculator',
    preview: 'calculator',
  },
  {
    id: 'calendar',
    title: 'Tax Calendar',
    subtitle: 'Never miss a deadline',
    path: '/calendar',
    preview: 'calendar',
  },
  {
    id: 'e-invoicing',
    title: 'E-Invoicing',
    subtitle: 'MyInvois compliance',
    path: '/e-invoicing',
    isNew: true,
    preview: 'einvoice',
  },
];

// Mini app preview components
function CalculatorPreview() {
  return (
    <div className="p-4 space-y-3 bg-white/85 border border-brand-border-ivory/70 rounded-xl shadow-sm text-brand-espresso">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-muted-ivory flex items-center justify-center">
            <Calculator weight="fill" className="w-3.5 h-3.5 text-brand-espresso" />
          </div>
          <span className="text-xs font-semibold">Tax Calculator</span>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-brand-muted-ivory text-[11px] text-brand-espresso/70 border border-brand-border-ivory">
          YA 2025
        </div>
      </div>

      {/* Mock input */}
      <div className="rounded-lg border border-brand-border-ivory bg-brand-muted-ivory/80 p-3">
        <p className="text-[11px] text-brand-espresso/60 mb-1">Annual Business Profit</p>
        <p className="text-lg font-semibold text-brand-espresso">RM 250,000</p>
      </div>

      {/* Results comparison */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-brand-border-ivory bg-white/80 p-3">
          <p className="text-[11px] text-brand-espresso/60 mb-1">Enterprise</p>
          <p className="text-sm font-semibold text-brand-espresso">RM 42,850</p>
          <p className="text-[11px] text-brand-rose">Higher tax</p>
        </div>
        <div className="rounded-lg border border-brand-border-ivory bg-brand-muted-ivory/80 p-3 ring-1 ring-brand-border-ivory/60">
          <p className="text-[11px] text-brand-espresso/60 mb-1">Sdn Bhd</p>
          <p className="text-sm font-semibold text-brand-espresso">RM 31,200</p>
          <div className="flex items-center gap-1">
            <CheckCircle weight="fill" className="w-3 h-3 text-emerald-500" />
            <p className="text-[11px] text-brand-espresso/80">Save RM 11,650</p>
          </div>
        </div>
      </div>

      {/* Chart bars */}
      <div className="flex items-end gap-2 h-12 pt-2">
        <div className="flex-1 bg-brand-muted-rose/40 rounded-sm" style={{ height: '100%' }} />
        <div className="flex-1 bg-brand-gold/70 rounded-sm" style={{ height: '73%' }} />
      </div>
    </div>
  );
}

function CalendarPreview() {
  return (
    <div className="p-4 space-y-3 bg-white/85 border border-brand-border-ivory/70 rounded-xl shadow-sm text-brand-espresso">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-muted-ivory flex items-center justify-center">
            <CalendarCheck weight="fill" className="w-3.5 h-3.5 text-brand-espresso" />
          </div>
          <span className="text-xs font-semibold">Tax Calendar</span>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-brand-muted-ivory text-[11px] text-brand-espresso/70 border border-brand-border-ivory">2025</div>
      </div>

      {/* Upcoming deadline */}
      <div className="rounded-lg border border-brand-border-ivory bg-brand-muted-ivory/80 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Warning weight="fill" className="w-4 h-4 text-brand-gold" />
          <span className="text-[11px] font-medium text-brand-espresso/80">Due in 45 days</span>
        </div>
        <p className="text-sm font-semibold text-brand-espresso">Form BE Submission</p>
        <p className="text-[11px] text-brand-espresso/60">Individual tax return</p>
      </div>

      {/* Mini calendar grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-[10px] text-brand-espresso/50">{d}</div>
        ))}
        {Array.from({ length: 28 }, (_, i) => (
          <div
            key={i}
            className={`text-[10px] py-0.5 rounded-sm ${
              i === 14 ? 'bg-brand-gold text-brand-espresso font-bold' :
              i === 29 ? 'bg-brand-rose text-brand-on-maroon font-bold' :
              'text-brand-espresso/60 bg-white/70 border border-brand-border-ivory/60'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-3 text-[11px] text-brand-espresso/70">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-brand-gold" />
          <span>Form BE</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-brand-rose" />
          <span>CP204</span>
        </div>
      </div>
    </div>
  );
}

function EInvoicePreview() {
  return (
    <div className="p-4 space-y-3 bg-white/85 border border-brand-border-ivory/70 rounded-xl shadow-sm text-brand-espresso">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-muted-ivory flex items-center justify-center">
            <Receipt weight="fill" className="w-3.5 h-3.5 text-brand-espresso" />
          </div>
          <span className="text-xs font-semibold">E-Invoicing</span>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-brand-gold text-brand-espresso text-[11px] font-semibold">NEW</div>
      </div>

      {/* Compliance status */}
      <div className="rounded-lg border border-brand-border-ivory bg-brand-muted-ivory/80 p-3">
        <p className="text-[11px] text-brand-espresso/60 mb-1">Your Revenue Band</p>
        <p className="text-sm font-semibold text-brand-espresso">RM 25M - RM 100M</p>
        <div className="flex items-center gap-1 mt-1 text-emerald-600">
          <TrendUp weight="bold" className="w-3 h-3" />
          <p className="text-[11px] font-medium">Mandatory from 1 Jan 2025</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <p className="text-[11px] text-brand-espresso/60">Implementation Timeline</p>
        <div className="space-y-1.5">
          {[
            { phase: 'Phase 1', date: '1 Aug 2024', done: true },
            { phase: 'Phase 2', date: '1 Jan 2025', done: true },
            { phase: 'Phase 3', date: '1 Jul 2025', done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${item.done ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-brand-border-ivory'}`}>
                {item.done && <CheckCircle weight="fill" className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1 flex justify-between">
                <span className="text-[11px] text-brand-espresso/80">{item.phase}</span>
                <span className="text-[11px] text-brand-espresso/60">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA hint */}
      <div className="flex items-center justify-center gap-1 text-[11px] text-brand-espresso/70">
        <span>Check your timeline</span>
        <ArrowRight weight="bold" className="w-3 h-3" />
      </div>
    </div>
  );
}

export default function LandingHub() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const isMobile = window.innerWidth < 640;
        const cardWidth = isMobile ? 260 : 280;
        const gap = 16;
        const index = Math.round(carousel.scrollLeft / (cardWidth + gap));
        const clampedIndex = Math.max(0, Math.min(index, TOOL_APPS.length - 1));
        setActiveIndex((prev) => (prev !== clampedIndex ? clampedIndex : prev));
        ticking = false;
      });
    };

    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      carousel.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const PreviewComponents: Record<string, React.FC> = {
    calculator: CalculatorPreview,
    calendar: CalendarPreview,
    einvoice: EInvoicePreview,
  };

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-brand-ivory flex flex-col">
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
              <h1 className="text-[38px] sm:text-[48px] lg:text-[56px] leading-[1.08] font-normal text-brand-espresso tracking-[-0.015em] mb-4 max-w-4xl">
                Embedded Malaysian tax tools, simplified.
              </h1>

              {/* Description */}
              <p className="text-lg text-brand-espresso/75 mb-7 max-w-2xl leading-relaxed">
                Compare structures, track deadlines, and stay compliant in one clean workspace.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => navigate('/calculator')}
                  className="h-12 px-7 rounded-full bg-brand-gold text-brand-espresso font-medium uppercase tracking-[0.08em] hover:bg-brand-gold/90 shadow-sm hover:shadow-soft transition-all duration-200"
                >
                  Open Calculator
                </button>
                <button
                  onClick={() => navigate('/docs')}
                  className="h-12 px-7 rounded-full border border-brand-border-ivory bg-brand-ivory text-brand-espresso font-medium uppercase tracking-[0.08em] hover:bg-brand-muted-ivory hover:border-brand-rose/40 transition-all duration-200"
                >
                  Read the Docs
                </button>
              </div>

              {/* Social proof */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-espresso/60 mb-2">Open source</p>
                <div className="flex gap-2">
                  <a
                    href="https://github.com/hazlijohar95/opentaxation.my"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-brand-border-ivory bg-white/80 hover:bg-white transition-colors shadow-sm"
                  >
                    <GithubLogo weight="fill" className="h-4 w-4 text-brand-espresso" />
                    <span className="text-sm font-medium text-brand-espresso">GitHub</span>
                    <span className="w-px h-4 bg-brand-border-ivory" />
                    <Star weight="fill" className="h-3.5 w-3.5 text-brand-gold" />
                    <span className="text-sm font-medium text-brand-espresso">{starCount ?? '—'}</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right: Netflix-style app carousel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full overflow-hidden"
            >
              {/* Carousel navigation */}
              <div className="flex items-center justify-between mb-4 px-1 sm:px-0">
                <p className="text-sm font-medium text-brand-espresso/60">Explore Tools</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollTo(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border border-brand-border-ivory flex items-center justify-center hover:bg-brand-muted-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <CaretLeft weight="bold" className="w-4 h-4 text-brand-espresso" />
                  </button>
                  <button
                    onClick={() => scrollTo(activeIndex + 1)}
                    disabled={activeIndex === TOOL_APPS.length - 1}
                    className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border border-brand-border-ivory flex items-center justify-center hover:bg-brand-muted-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <CaretRight weight="bold" className="w-4 h-4 text-brand-espresso" />
                  </button>
                </div>
              </div>

              {/* Carousel container */}
              <div
                ref={carouselRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
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
                      className="relative flex-shrink-0 w-[240px] sm:w-[260px] h-[300px] sm:h-[320px] rounded-3xl overflow-hidden snap-start cursor-pointer group bg-gradient-to-br from-white to-brand-muted-ivory text-brand-espresso shadow-card border border-brand-border-ivory"
                    >
                      {/* NEW badge */}
                      {app.isNew && (
                        <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-semibold text-brand-on-maroon">
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
                        <div className="p-3.5 sm:p-4 pt-0 flex items-center justify-between">
                          <div>
                            <p className="font-serif text-base font-medium text-brand-on-maroon">
                              {app.title}
                            </p>
                            <p className="text-xs text-brand-on-maroon/70">{app.subtitle}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                            <ArrowRight weight="bold" className="w-4 h-4 text-brand-on-maroon" />
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
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-2">
                {TOOL_APPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeIndex ? 'w-5 sm:w-6 bg-brand-espresso' : 'w-1.5 bg-brand-border-ivory'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer - Brand-aligned maroon band */}
      <footer className="bg-brand-maroon py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-brand-on-maroon">
          <p>&copy; {new Date().getFullYear()} OpenTaxation</p>
          <p className="italic text-brand-on-maroon/70 order-first sm:order-none">
            {t('landingPage.footer.vibeCoded')}
          </p>
          <div className="flex items-center gap-4">
            <Link to="/docs" className="hover:text-brand-on-maroon transition-colors">Docs</Link>
            <Link to="/blog" className="hover:text-brand-on-maroon transition-colors">Blog</Link>
            <Link to="/privacy" className="hover:text-brand-on-maroon transition-colors">Privacy</Link>
            <a
              href="https://github.com/hazlijohar95/opentaxation.my"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-on-maroon transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
