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
    <div className="h-full flex flex-col">
      {/* Compact Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4 flex-shrink-0"
      >
        <h1 className="text-2xl md:text-4xl font-black text-[#4A3728] leading-tight mb-2">
          Zakat Receipt Checklist{' '}
          <span className="text-[#5A2129]">10 Essential Items</span>
        </h1>
        <p className="text-sm md:text-base text-[#6B5B4F] max-w-3xl mx-auto">
          Verify items 1 to 10 to ensure your zakat receipt has sufficient proof and accurate data
        </p>

        {/* Compact Progress Badge */}
        {completionPercentage > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-block mt-2"
          >
            <Badge className="bg-emerald-500 text-white text-xs px-3 py-1">
              {completionPercentage}% complete
            </Badge>
          </motion.div>
        )}
      </motion.div>

      {/* Visual Receipt - Centered and scaled to fit */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="w-full max-w-6xl">
          <VisualReceipt
            completedIds={completedIds}
            activeId={activeId}
            onHotspotClick={onHotspotClick}
          />
        </div>
      </div>

      {/* Compact Bottom Section */}
      <div className="flex-shrink-0 mt-4">
        {allCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-[2px] border border-gray-300 shadow-lg overflow-hidden mx-2 sm:mx-0">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-8 h-8 rounded-[2px] bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Confetti weight="fill" className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      All Checkpoints Verified
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90">
                      Your receipt is ready for review
                    </p>
                  </div>
                  <Button
                    onClick={onContinue}
                    size="sm"
                    className="bg-white hover:bg-gray-100 active:bg-gray-200 text-emerald-700 font-semibold shadow-md w-full sm:w-auto py-3 sm:py-2 touch-manipulation active:scale-95 transition-all"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" weight="bold" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-xs text-gray-600">
              💡 Click on the numbered circles (1-10) to read details and mark as checked
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
