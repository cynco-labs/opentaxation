import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Receipt,
  Wallet,
  Buildings,
  ChartLineUp,
  Coins,
  Calculator,
  Vault,
  TrendUp,
  ShieldCheck,
} from 'phosphor-react';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';

// Smooth easing
const smoothEase = [0.25, 0.1, 0.25, 1];

// Premium Google Logo with brand colors
function GoogleLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

// Phosphor-style topographic background with floating icons
function PhosphorBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Topographic contour lines */}
      <svg
        className="absolute w-full h-full opacity-[0.35]"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
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
          d="M-100 300 Q 150 280, 350 300 T 700 280 T 1300 320"
          className="stroke-border"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M-100 200 Q 180 170, 380 190 T 750 170 T 1300 210"
          className="stroke-border"
          strokeWidth="1"
          fill="none"
        />

        {/* Contour clusters */}
        <ellipse cx="950" cy="150" rx="100" ry="50" className="stroke-border" strokeWidth="1" fill="none" />
        <ellipse cx="950" cy="150" rx="60" ry="30" className="stroke-border" strokeWidth="1" fill="none" />
        <ellipse cx="150" cy="650" rx="80" ry="40" className="stroke-border" strokeWidth="1" fill="none" />
        <ellipse cx="150" cy="650" rx="40" ry="20" className="stroke-border" strokeWidth="1" fill="none" />
      </svg>

      {/* Scattered Phosphor icons with labels - like documentation */}
      <div className="absolute top-[12%] left-[8%] flex flex-col items-center gap-1 opacity-40">
        <Receipt weight="light" className="h-6 w-6 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">receipt-light</span>
      </div>

      <div className="absolute top-[65%] left-[5%] flex flex-col items-center gap-1 opacity-40">
        <Vault weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">vault-light</span>
      </div>

      <div className="absolute top-[20%] right-[8%] flex flex-col items-center gap-1 opacity-40">
        <Buildings weight="light" className="h-6 w-6 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">buildings-light</span>
      </div>

      <div className="absolute top-[75%] right-[12%] flex flex-col items-center gap-1 opacity-40">
        <ChartLineUp weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">chart-line-up</span>
      </div>

      <div className="absolute bottom-[20%] left-[20%] flex flex-col items-center gap-1 opacity-40">
        <Coins weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">coins-light</span>
      </div>

      <div className="absolute top-[40%] right-[5%] flex flex-col items-center gap-1 opacity-40">
        <Wallet weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">wallet-light</span>
      </div>

      <div className="absolute top-[50%] left-[3%] flex flex-col items-center gap-1 opacity-40">
        <Calculator weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">calculator</span>
      </div>

      <div className="absolute bottom-[35%] right-[4%] flex flex-col items-center gap-1 opacity-40">
        <TrendUp weight="light" className="h-5 w-5 text-foreground" />
        <div className="w-1 h-1 rounded-full bg-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">trend-up</span>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, isLoading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-background relative overflow-hidden">
      <PhosphorBackground />

      {/* Main container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-6 sm:p-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft weight="bold" className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <Logo size="sm" />
        </header>

        {/* Main content - centered */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="w-full max-w-sm"
          >
            {/* Card */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="font-display text-2xl font-bold tracking-tight mb-2">
                  Welcome back, taxpayer
                </h1>
                <p className="text-muted-foreground text-sm">
                  Don't worry, we won't tell LHDN about your secret spreadsheet addiction.
                </p>
              </div>

              {/* Google Sign In */}
              <motion.button
                onClick={signInWithGoogle}
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full h-12 rounded-xl bg-background border border-border hover:border-foreground/20 hover:bg-muted/30 transition-all duration-200 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
                    <span className="text-sm font-medium">Signing in...</span>
                  </>
                ) : (
                  <>
                    <GoogleLogo className="h-5 w-5" />
                    <span className="text-sm font-medium">Continue with Google</span>
                  </>
                )}
              </motion.button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">what you get</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <Calculator weight="duotone" className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <span className="font-medium">Save calculations</span>
                    <span className="text-muted-foreground"> — for when you forget everything</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <ChartLineUp weight="duotone" className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <span className="font-medium">Track changes</span>
                    <span className="text-muted-foreground"> — watch your savings grow (hopefully)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck weight="duotone" className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <span className="font-medium">100% private</span>
                    <span className="text-muted-foreground"> — your data stays between us</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <p className="mt-6 text-center text-xs text-muted-foreground">
                By signing in, you agree to our{' '}
                <a href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">
                  Terms
                </a>{' '}
                &{' '}
                <a href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
                  Privacy
                </a>
                .
                <br />
                <span className="opacity-70">No spam, we promise. We're too lazy for that.</span>
              </p>
            </div>

            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground"
            >
              <span>YA 2024/2025</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>Forever Free</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>LHDN Rates</span>
            </motion.div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="p-6 sm:p-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} opentaxation.my — Built for Malaysian entrepreneurs who'd rather not do math.
          </p>
        </footer>
      </div>
    </div>
  );
}
