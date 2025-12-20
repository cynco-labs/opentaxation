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
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.8 }}
        className="text-center space-y-10 sm:space-y-16 max-w-3xl mx-auto w-full"
      >
        {/* Minimal Logo Mark */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-[2px] border-2 border-gray-900 bg-white shadow-lg"
        >
          <span className="text-3xl sm:text-4xl">🕌</span>
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

        {/* Elegant Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', bounce: 0.2 }}
          className="inline-flex items-center gap-3 sm:gap-6 px-6 sm:px-10 py-4 sm:py-5 bg-white rounded-[2px] border border-gray-200 shadow-lg"
        >
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">
              {timeLeft.days}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-0.5">
              days
            </div>
          </div>
          <div className="text-gray-300 text-2xl sm:text-3xl font-light">:</div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-0.5">
              hours
            </div>
          </div>
          <div className="text-gray-300 text-2xl sm:text-3xl font-light">:</div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-0.5">
              mins
            </div>
          </div>
        </motion.div>

        {/* Beautiful Custom Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-3 px-10 sm:px-14 py-4 sm:py-5 bg-gray-900 text-white font-semibold text-base sm:text-lg rounded-[2px] shadow-xl hover:shadow-2xl active:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden touch-manipulation"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <span className="relative z-10">start checking</span>
            <ArrowRight
              className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              weight="bold"
            />

            {/* Border accent */}
            <div className="absolute inset-0 rounded-[2px] border-2 border-white/10" />
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
