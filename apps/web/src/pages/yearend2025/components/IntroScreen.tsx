import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Receipt, CheckCircle, Clock, ArrowRight } from 'phosphor-react';
import Logo from '@/components/Logo';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF7F2] flex flex-col safe-area-inset">
      {/* Minimal Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#5A2129]/10">
        <Logo size="sm" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
          className="text-center space-y-8 sm:space-y-12 max-w-4xl mx-auto w-full"
        >
          {/* Elegant Header */}
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[2px] bg-[#5A2129]/5 border border-[#5A2129]/10"
            >
              <Receipt weight="fill" className="h-4 w-4 text-[#5A2129]" />
              <span className="text-sm font-medium text-[#5A2129]">Year End 2025</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight px-2"
            >
              <span className="text-[#4A3728]">Zakat Receipt</span>
              <br />
              <span className="text-[#5A2129]">Checklist</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-[#6B5B4F] max-w-2xl mx-auto leading-relaxed font-medium px-4"
            >
              Check your zakat receipt with 10 checkpoints before submitting to LHDN
            </motion.p>
          </div>

          {/* Elegant Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-[2px] bg-white border border-[#5A2129]/10 shadow-sm">
              <CheckCircle weight="duotone" className="h-5 w-5 text-[#5A2129]" />
              <span className="text-sm font-medium text-[#4A3728]">10 checkpoints</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-[2px] bg-white border border-[#5A2129]/10 shadow-sm">
              <Clock weight="duotone" className="h-5 w-5 text-[#5A2129]" />
              <span className="text-sm font-medium text-[#4A3728]">60 seconds</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-[2px] bg-white border border-[#E5A84B]/20 shadow-sm">
              <span className="text-sm font-semibold text-[#E5A84B]">⭐ IC matters!</span>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <Button
              size="lg"
              onClick={onStart}
              className="bg-[#5A2129] hover:bg-[#4A1B21] active:bg-[#3A1119] text-white px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg h-auto font-semibold rounded-[2px] shadow-lg hover:shadow-xl active:scale-95 transition-all group w-full sm:w-auto max-w-sm mx-auto touch-manipulation"
            >
              Start Checking Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" weight="bold" />
            </Button>
            <p className="text-sm sm:text-base text-[#6B5B4F] px-4">
              💡 Have your zakat receipt ready
            </p>
          </motion.div>

          {/* Minimal Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-8 border-t border-[#5A2129]/10"
          >
            <p className="text-xs text-[#8B7B6B] max-w-lg mx-auto leading-relaxed">
              This is not tax advice. Progress saved locally only.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
