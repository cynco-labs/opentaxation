import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, CalendarBlank, CaretDown, List, SignOut, Receipt } from 'phosphor-react';
import Logo from '../Logo';
import LegalFooter from '../pages/LegalFooter';
import CalendarContent from '../calendar/CalendarContent';
import CalculatorContent from '../calculator/CalculatorContent';
import { ThemeToggle } from '../ThemeToggle';
import MobileMenu from '../mobile/MobileMenu';
import { useAuth } from '@/contexts/AuthContext';

// Google "G" Logo SVG Component
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// Premium Google Login Button
function GoogleLoginButton() {
  const { user, signInWithGoogle, signOut, isLoading } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  if (isLoading) {
    return (
      <div className="h-9 w-24 bg-muted/50 animate-pulse rounded-full" />
    );
  }

  // User is logged in - show avatar
  if (user) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="relative flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-muted/30 hover:bg-muted/50 border border-border/40 hover:border-border/60 transition-all duration-200"
        >
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="w-7 h-7 rounded-full ring-2 ring-background"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <CaretDown weight="bold" className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-56 py-2 bg-card border border-border rounded-xl shadow-lg z-50"
            >
              <div className="px-3 py-2 border-b border-border/50">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <button
                onClick={() => { signOut(); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <SignOut weight="duotone" className="h-4 w-4" />
                Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // User is not logged in - show login button
  return (
    <button
      onClick={() => signInWithGoogle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-full bg-brand-ivory border border-brand-border-ivory hover:border-brand-rose/40 shadow-soft hover:shadow-soft-hover transition-all duration-200"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4285F4]/5 via-[#34A853]/5 to-[#EA4335]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Google logo with animation */}
      <div className="relative">
        <GoogleLogo className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
      </div>

      {/* Text */}
      <span className="relative text-sm font-medium text-foreground">
        Sign in
      </span>

      {/* Animated border gradient on hover */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-[-1px] rounded-full bg-gradient-to-r from-[#4285F4]/20 via-[#34A853]/20 to-[#EA4335]/20 blur-[1px]" />
      </div>
    </button>
  );
}

type TabType = 'calculator' | 'calendar';

interface LandingSectionProps {
  onStart: () => void;
}

export default function LandingSection({ onStart }: LandingSectionProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [menuOpen, setMenuOpen] = useState(false);

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

            {/* Elegant Segmented Control */}
            <div className="relative flex items-center p-1 bg-muted/30 rounded-full border border-border/40">
              {/* Sliding background indicator */}
              <motion.div
                className="absolute top-1 bottom-1 bg-background rounded-full shadow-sm border border-border/50"
                initial={false}
                animate={{
                  left: activeTab === 'calculator' ? '4px' : '50%',
                  width: 'calc(50% - 4px)',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />

              {/* Calculator Tab */}
              <button
                onClick={() => setActiveTab('calculator')}
                className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'calculator'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground/70'
                }`}
              >
                <Calculator
                  weight={activeTab === 'calculator' ? 'fill' : 'regular'}
                  className="h-4 w-4"
                />
                <span>{t('nav.calculator')}</span>
              </button>

              {/* Calendar Tab */}
              <button
                onClick={() => setActiveTab('calendar')}
                className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'calendar'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground/70'
                }`}
              >
                <CalendarBlank
                  weight={activeTab === 'calendar' ? 'fill' : 'regular'}
                  className="h-4 w-4"
                />
                <span>{t('nav.calendar')}</span>
              </button>
            </div>

            {/* E-Invoicing, Theme Toggle & Login (Desktop only) */}
            <div className="flex items-center gap-2">
              <Link
                to="/e-invoicing"
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Receipt weight="duotone" className="h-4 w-4" />
                <span>E-Invoicing</span>
              </Link>
              <ThemeToggle />
              <GoogleLoginButton />
            </div>
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
