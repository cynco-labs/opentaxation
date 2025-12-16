import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, CalendarBlank, CaretDown, List } from 'phosphor-react';
import Logo from '../Logo';
import LegalFooter from '../pages/LegalFooter';
import CalendarContent from '../calendar/CalendarContent';
import CalculatorContent from '../calculator/CalculatorContent';
import { ThemeToggle } from '../ThemeToggle';
import MobileMenu from '../mobile/MobileMenu';

type TabType = 'calculator' | 'calendar';

interface LandingSectionProps {
  onStart: () => void;
}

export default function LandingSection({ onStart }: LandingSectionProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <div id="main-content" className="min-h-screen min-h-[100dvh] w-full bg-background flex flex-col safe-area-insets">
        {/* Header - Responsive for mobile and desktop */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/30 supports-[backdrop-filter]:bg-background/80">
          {/* Mobile Header */}
          <div className="flex lg:hidden items-center justify-between px-5 py-4">
            <Logo size="md" className="flex-shrink-0" />
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2.5 -mr-2 rounded-xl hover:bg-muted/50 active:scale-95 transition-all touch-target"
              aria-label="Open menu"
            >
              <List weight="bold" className="h-6 w-6 text-foreground" />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between container-content py-4">
            <Logo size="md" className="flex-shrink-0" />

            {/* Dropdown Navigation */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-foreground bg-muted/40 hover:bg-muted/60"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {activeTab === 'calculator' ? (
                  <>
                    <Calculator weight="fill" className="h-[18px] w-[18px]" />
                    <span>{t('nav.calculator')}</span>
                  </>
                ) : (
                  <>
                    <CalendarBlank weight="fill" className="h-[18px] w-[18px]" />
                    <span>{t('nav.calendar')}</span>
                  </>
                )}
                <CaretDown
                  weight="bold"
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute top-full left-0 mt-2 w-48 py-1.5 bg-card border border-border rounded-xl shadow-lg z-50"
                  >
                    <button
                      onClick={() => { setActiveTab('calculator'); setDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        activeTab === 'calculator'
                          ? 'text-foreground bg-muted/50'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }`}
                    >
                      <Calculator
                        weight={activeTab === 'calculator' ? 'fill' : 'duotone'}
                        className="h-[18px] w-[18px]"
                      />
                      {t('nav.calculator')}
                    </button>
                    <button
                      onClick={() => { setActiveTab('calendar'); setDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        activeTab === 'calendar'
                          ? 'text-foreground bg-muted/50'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }`}
                    >
                      <CalendarBlank
                        weight={activeTab === 'calendar' ? 'fill' : 'duotone'}
                        className="h-[18px] w-[18px]"
                      />
                      {t('nav.calendar')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle (Desktop only) */}
            <ThemeToggle />
          </div>
        </header>

        {/* Mobile Segmented Control - Clean tabs below header */}
        <div className="lg:hidden px-5 py-2 bg-background border-b border-border/20">
          <nav className="flex gap-1" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'calculator'}
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 touch-target ${
                activeTab === 'calculator'
                  ? 'text-foreground bg-muted/60'
                  : 'text-muted-foreground active:bg-muted/30'
              }`}
            >
              <Calculator
                weight={activeTab === 'calculator' ? 'fill' : 'duotone'}
                className="h-[18px] w-[18px]"
              />
              <span>{t('nav.calculator')}</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'calendar'}
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 touch-target ${
                activeTab === 'calendar'
                  ? 'text-foreground bg-muted/60'
                  : 'text-muted-foreground active:bg-muted/30'
              }`}
            >
              <CalendarBlank
                weight={activeTab === 'calendar' ? 'fill' : 'duotone'}
                className="h-[18px] w-[18px]"
              />
              <span>{t('nav.calendar')}</span>
            </button>
          </nav>
        </div>

        {/* Mobile Menu Modal */}
        <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'calculator' ? (
              <motion.div
                key="calculator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <CalculatorContent onStart={onStart} />
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <CalendarContent />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <LegalFooter />
    </>
  );
}
