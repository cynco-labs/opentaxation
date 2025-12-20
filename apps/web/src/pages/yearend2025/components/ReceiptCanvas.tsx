import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Confetti } from 'phosphor-react';
import { CHECKPOINTS } from '../zakatReceiptChecklist';
import VisualReceipt from './VisualReceipt';

interface ReceiptCanvasProps {
  completedIds: number[];
  activeId: number | null;
  onHotspotClick: (id: number, event: React.MouseEvent) => void;
  onContinue: () => void;
  allCompleted: boolean;
}

export default function ReceiptCanvas({
  completedIds,
  activeId,
  onHotspotClick,
  onContinue,
  allCompleted,
}: ReceiptCanvasProps) {
  const completionPercentage = Math.round(
    (completedIds.length / CHECKPOINTS.length) * 100
  );

  return (
    <div className="w-full space-y-3 sm:space-y-6">
      {/* Compact Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center flex-shrink-0"
      >
        <h1 className="text-lg sm:text-2xl md:text-4xl font-black text-[#4A3728] leading-tight mb-1 sm:mb-2 px-2">
          Zakat Receipt Checklist{' '}
          <span className="text-[#5A2129]">10 Essential Items</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#6B5B4F] max-w-3xl mx-auto px-2">
          Verify items 1 to 10 to ensure your zakat receipt has sufficient proof and accurate data
        </p>

        {/* Compact Progress Badge */}
        {completionPercentage > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-block mt-1 sm:mt-2"
          >
            <Badge className="bg-emerald-500 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1">
              {completionPercentage}% complete
            </Badge>
          </motion.div>
        )}
      </motion.div>

      {/* Visual Receipt - Responsive */}
      <div className="w-full">
        <VisualReceipt
          completedIds={completedIds}
          activeId={activeId}
          onHotspotClick={onHotspotClick}
        />
      </div>

      {/* Bottom Section - Always visible with proper spacing */}
      <div className="mt-4 sm:mt-6 pb-4 sm:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {allCompleted ? (
            <div className="bg-white rounded-[2px] border border-gray-300 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 sm:px-6 py-2.5 sm:py-4">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Confetti weight="fill" className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-sm sm:text-lg font-bold text-white">
                      All Checkpoints Verified
                    </h3>
                    <p className="text-[10px] sm:text-sm text-white/90">
                      Your receipt is ready for review
                    </p>
                  </div>
                  <Button
                    onClick={onContinue}
                    size="sm"
                    className="bg-white hover:bg-gray-100 active:bg-gray-200 text-emerald-700 font-semibold shadow-md w-full sm:w-auto py-2.5 sm:py-2 text-sm touch-manipulation active:scale-95 transition-all"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" weight="bold" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <p className="text-[10px] sm:text-xs text-gray-600 text-center px-2">
                💡 Click on the numbered circles (1-10) to read details and mark as checked
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={onContinue}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-gray-50 active:bg-gray-100 font-semibold py-2.5 px-6 text-sm touch-manipulation active:scale-95 transition-all"
                >
                  Preview Your Wrapped
                  <ArrowRight className="ml-2 h-4 w-4" weight="bold" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
