import { motion } from 'framer-motion';
import { ArrowRight } from 'phosphor-react';
import { useState, useEffect } from 'react';

interface IntroScreenProps {
  onStart: () => void;
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const deadline = new Date('2025-12-31T23:59:59');
  const timeLeft = useCountdown(deadline);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#F5F1EA] to-[#FAF7F2] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.8 }}
        className="text-center space-y-10 sm:space-y-16 max-w-3xl mx-auto w-full"
      >
        {/* Elegant Logo Mark with Shadow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-[2px] border-2 border-gray-900 bg-white shadow-2xl"
        >
          <span className="text-4xl sm:text-5xl">🕌</span>
        </motion.div>

        {/* Minimal Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 sm:space-y-6"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            zakat receipt
            <br />
            <span className="text-gray-600">year-end check</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
            verify your receipt before dec 31
          </p>
        </motion.div>

        {/* Beautiful Countdown Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', bounce: 0.2 }}
          className="relative overflow-hidden"
        >
          <div className="inline-flex items-center gap-4 sm:gap-8 px-8 sm:px-12 py-5 sm:py-7 bg-gradient-to-br from-white to-gray-50 rounded-[2px] border border-gray-200 shadow-2xl backdrop-blur-sm">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#5A2129]/5 to-transparent opacity-50" />

            <div className="text-center relative z-10">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 tabular-nums">
                {timeLeft.days}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider mt-1 font-medium">
                days
              </div>
            </div>
            <div className="text-gray-300 text-3xl sm:text-4xl font-light relative z-10">:</div>
            <div className="text-center relative z-10">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider mt-1 font-medium">
                hours
              </div>
            </div>
            <div className="text-gray-300 text-3xl sm:text-4xl font-light relative z-10">:</div>
            <div className="text-center relative z-10">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider mt-1 font-medium">
                mins
              </div>
            </div>
          </div>
        </motion.div>

        {/* Elegant CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-3 px-12 sm:px-16 py-5 sm:py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold text-base sm:text-lg rounded-[2px] shadow-2xl hover:shadow-3xl active:shadow-lg transition-all duration-300 hover:-translate-y-1 active:translate-y-0 overflow-hidden touch-manipulation"
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#5A2129] to-[#722F37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Content */}
            <span className="relative z-10">start checking</span>
            <ArrowRight
              className="relative z-10 h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-1.5"
              weight="bold"
            />

            {/* Subtle border */}
            <div className="absolute inset-0 rounded-[2px] ring-1 ring-white/20" />
          </button>
        </motion.div>

        {/* Minimal Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs sm:text-sm text-gray-500"
        >
          10 checkpoints • 60 seconds • ic matters
        </motion.p>
      </motion.div>
    </div>
  );
}
