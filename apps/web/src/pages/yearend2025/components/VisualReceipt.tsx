import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'phosphor-react';
import { cn } from '@/lib/utils';
import { CHECKPOINTS } from '../zakatReceiptChecklist';
import Logo from '@/components/Logo';

interface VisualReceiptProps {
  completedIds: number[];
  activeId: number | null;
  onHotspotClick: (id: number, event: React.MouseEvent) => void;
}

export default function VisualReceipt({
  completedIds,
  activeId,
  onHotspotClick,
}: VisualReceiptProps) {
  const hotspotPositions = [
    { id: 1, top: '8%', left: '2.5%' },      // #1: Logo (mosque emoji)
    { id: 2, top: '22%', left: '2.5%' },     // #2: Nama Penuh label
    { id: 3, top: '31%', left: '2.5%' },     // #3: No. Kad Pengenalan ⭐ label
    { id: 4, top: '41%', left: '2.5%' },     // #4: Alamat label
    { id: 5, top: '54%', right: '2.5%' },    // #5: Jumlah Zakat label (RM field)
    { id: 6, top: '43%', right: '2.5%' },    // #6: Cara Bayaran label
    { id: 7, top: '31%', right: '2.5%' },    // #7: Jenis Zakat label
    { id: 8, top: '71%', left: '2.5%' },     // #8: Tarikh label
    { id: 9, top: '22%', right: '2.5%' },    // #9: No. Siri / Rujukan label
    { id: 10, top: '8%', right: '2.5%' },    // #10: RESIT RASMI badge
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Realistic Receipt Card */}
      <motion.div
        className="relative bg-white rounded-[2px] shadow-lg border border-gray-200"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.1 }}
      >
        {/* Receipt Header - Simple & Professional */}
        <div className="relative px-3 sm:px-6 py-2 sm:py-4 bg-gradient-to-b from-gray-50 to-white border-b-2 border-gray-300 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded-[2px] border border-gray-300 flex items-center justify-center">
              <span className="text-base sm:text-xl">🕌</span>
            </div>
            <div>
              <h3 className="text-xs sm:text-base font-bold text-gray-900 tracking-tight">
                Pusat Pungutan Zakat
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-600">Wilayah Persekutuan</p>
            </div>
          </div>
          <div className="bg-gray-900 px-2 sm:px-3 py-1 sm:py-1.5 rounded-[2px] border border-gray-700">
            <p className="text-white font-bold text-[10px] sm:text-xs tracking-wider">
              RESIT RASMI
            </p>
          </div>
        </div>

        {/* Receipt Body - Compact on mobile */}
        <div className="p-3 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-4">
            {/* Left Column */}
            <div className="space-y-2 sm:space-y-4">
              {/* Nama penuh */}
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                  Nama Penuh
                </label>
                <div className="mt-0.5 sm:mt-1 h-6 sm:h-8 bg-gray-50 border-b border-gray-300 flex items-center px-2">
                  <div className="w-full h-px bg-gray-300" />
                </div>
              </div>

              {/* IC - emphasized */}
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                  No. Kad Pengenalan
                  <span className="text-[10px] text-[#E5A84B]">⭐</span>
                </label>
                <div className="mt-0.5 sm:mt-1 h-6 sm:h-8 bg-amber-50/50 border-b-2 border-[#E5A84B] flex items-center px-2">
                  <div className="w-full h-px bg-[#E5A84B]/40" />
                </div>
              </div>

              {/* Alamat */}
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                  Alamat
                </label>
                <div className="mt-0.5 sm:mt-1 h-10 sm:h-14 bg-gray-50 border-b border-gray-300 flex items-center px-2">
                  <div className="w-full space-y-1 sm:space-y-1.5">
                    <div className="h-px bg-gray-300 w-full" />
                    <div className="h-px bg-gray-300 w-4/5" />
                    <div className="h-px bg-gray-300 w-3/5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2 sm:space-y-4">
              {/* No. Siri */}
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                  No. Siri / Rujukan
                </label>
                <div className="mt-0.5 sm:mt-1 h-6 sm:h-8 bg-gray-50 border-b border-gray-300 flex items-center px-2">
                  <div className="w-2/3 h-px bg-gray-300" />
                </div>
              </div>

              {/* Jenis Zakat */}
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                  Jenis Zakat
                </label>
                <div className="mt-0.5 sm:mt-1 h-6 sm:h-8 bg-gray-50 border-b border-gray-300 flex items-center px-2">
                  <div className="w-3/4 h-px bg-gray-300" />
                </div>
              </div>

              {/* Cara Bayaran */}
              <div>
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                  Cara Bayaran
                </label>
                <div className="mt-0.5 sm:mt-1 h-6 sm:h-8 bg-gray-50 border-b border-gray-300 flex items-center px-2">
                  <div className="w-1/2 h-px bg-gray-300" />
                </div>
              </div>

              {/* Jumlah */}
              <div>
                <label className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">
                  Jumlah Zakat
                </label>
                <div className="mt-0.5 sm:mt-1 h-8 sm:h-10 bg-emerald-50 border-b-2 border-emerald-600 flex items-center px-2">
                  <span className="text-base sm:text-xl font-bold text-emerald-700">RM</span>
                  <div className="ml-2 w-20 sm:w-28 h-px bg-emerald-600/30" />
                </div>
              </div>
            </div>
          </div>

          {/* Tarikh - Bottom section */}
          <div className="border-t-2 border-dashed border-gray-300 mt-3 sm:mt-6 pt-2 sm:pt-4 flex items-center justify-between">
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                Tarikh
              </label>
              <div className="mt-1 h-6 sm:h-8 bg-gray-50 border-b border-gray-300 flex items-center px-2 w-32 sm:w-40">
                <div className="w-24 sm:w-32 h-px bg-gray-300" />
              </div>
            </div>
            <div className="w-16 h-14 sm:w-24 sm:h-20 border-2 border-dashed border-gray-400 rounded-[2px] flex items-center justify-center bg-gray-50">
              <span className="text-[10px] text-gray-500 font-bold">
                COP
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 sm:mt-6 pt-2 sm:pt-4 border-t border-gray-200 flex items-center justify-center">
            <Logo size="sm" className="opacity-30" />
          </div>
        </div>

        {/* Hotspots Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {hotspotPositions.map((pos, index) => {
            const checkpoint = CHECKPOINTS.find((c) => c.id === pos.id);
            if (!checkpoint) return null;

            const isCompleted = completedIds.includes(pos.id);
            const isActive = activeId === pos.id;
            const isEmphasized = checkpoint.emphasis === 'high';

            return (
              <motion.button
                key={pos.id}
                className={cn(
                  'absolute pointer-events-auto touch-manipulation',
                  'w-9 h-9 sm:w-8 sm:h-8 md:w-7 md:h-7 rounded-[2px]',
                  'flex items-center justify-center',
                  'font-semibold text-xs',
                  'border-2 transition-all duration-150 active:scale-90',
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                    : isEmphasized
                    ? 'bg-amber-400 border-amber-500 text-white shadow-sm'
                    : 'bg-white/90 backdrop-blur-sm border-[#5A2129]/30 text-[#5A2129] shadow-sm',
                  isActive && 'ring-2 ring-[#5A2129]/20 scale-110'
                )}
                style={{
                  top: pos.top,
                  left: pos.left,
                  right: pos.right,
                }}
                onClick={(e) => onHotspotClick(pos.id, e)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: index * 0.03,
                  type: 'spring',
                  bounce: 0.3,
                  duration: 0.4,
                }}
                whileHover={{
                  scale: 1.15,
                  boxShadow: isCompleted
                    ? '0 2px 8px rgba(16, 185, 129, 0.3)'
                    : isEmphasized
                    ? '0 2px 8px rgba(251, 191, 36, 0.3)'
                    : '0 2px 8px rgba(90, 33, 41, 0.15)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
                    >
                      <Check weight="bold" className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="number"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="drop-shadow-sm"
                    >
                      {pos.id}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Elegant pulse for emphasized */}
                {isEmphasized && !isCompleted && (
                  <motion.div
                    className="absolute inset-0 rounded-[2px] border border-amber-400"
                    animate={{
                      scale: [1, 1.4],
                      opacity: [0.4, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: 'easeOut',
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
