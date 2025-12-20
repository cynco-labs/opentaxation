import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ArrowLeft, X, CheckCircle, WarningCircle, Receipt, Calendar, ArrowSquareOut } from 'phosphor-react';
import { cn } from '@/lib/utils';
import { CHECKPOINTS } from '../zakatReceiptChecklist';

interface ScoreScreenProps {
  completedIds: number[];
  onNext: () => void;
  onBack: () => void;
}

export default function ScoreScreen({
  completedIds,
  onNext,
  onBack,
}: ScoreScreenProps) {
  const totalCount = CHECKPOINTS.length;
  const completedCount = completedIds.length;
  const missingCheckpoints = CHECKPOINTS.filter(
    (c) => !completedIds.includes(c.id)
  );

  const isComplete = completedCount === totalCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF7F2] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: 'spring', bounce: 0.15 }}
        className="max-w-2xl w-full space-y-4 sm:space-y-6"
      >
        {isComplete ? (
          <>
            {/* Completed Receipt Visual */}
            <Card className="p-6 sm:p-8 md:p-10 shadow-xl border-gray-300">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center space-y-4 sm:space-y-6"
              >
                {/* Checkmark */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-[2px] bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center">
                    <CheckCircle weight="fill" className="h-12 w-12 text-emerald-600" />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-3 px-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    Your Receipt is Ready
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
                    All {totalCount} checkpoints verified. Your zakat receipt has everything needed to claim your tax rebate from LHDN.
                  </p>
                </div>

                {/* Receipt Preview - Mini version showing all completed */}
                <div className="py-6">
                  <div className="inline-flex flex-wrap gap-2 justify-center">
                    {CHECKPOINTS.map((checkpoint, index) => (
                      <motion.div
                        key={checkpoint.id}
                        className="w-10 h-10 rounded-[2px] bg-emerald-500 border-2 border-emerald-600 flex items-center justify-center"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.03 }}
                      >
                        <CheckCircle weight="bold" className="h-5 w-5 text-white" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Card>

            {/* CTA - Pay Zakat */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-5 sm:p-6 md:p-8 shadow-xl border-gray-300 bg-gradient-to-br from-[#5A2129] to-[#4A1B21] text-white rounded-[2px]">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-[2px] flex items-center justify-center mx-auto sm:mx-0">
                    <Calendar weight="duotone" className="h-6 w-6" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">Haven't Paid Zakat Yet?</h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-4 sm:mb-5">
                      Pay your zakat before <strong>December 31, 2025</strong> to fulfill your responsibility and claim your tax rebate from LHDN.
                    </p>
                    <Button
                      asChild
                      size="default"
                      className="bg-white hover:bg-gray-100 active:bg-gray-200 text-[#5A2129] font-semibold w-full sm:w-auto py-3 sm:py-2.5 touch-manipulation active:scale-95 transition-all"
                    >
                      <a
                        href="https://zakat2u.com.my/cart/troli"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center"
                      >
                        Pay Zakat Now
                        <ArrowSquareOut className="ml-2 h-4 w-4" weight="bold" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-3 px-2 sm:px-0">
              <Button
                size="lg"
                className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white font-semibold py-4 sm:py-3 touch-manipulation active:scale-95 transition-all"
                onClick={onNext}
              >
                <Receipt className="mr-2 h-5 w-5" weight="bold" />
                Get Your Wrapped Card
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50 active:bg-gray-100 font-semibold py-4 sm:py-3 touch-manipulation active:scale-95 transition-all"
                onClick={onBack}
                size="lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" weight="bold" />
                Review Checklist
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Incomplete State */}
            <Card className="p-8 md:p-10 shadow-xl border-gray-300">
              <div className="text-center space-y-6">
                <WarningCircle weight="duotone" className="h-16 w-16 text-amber-600 mx-auto" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Almost There
                  </h2>
                  <p className="text-sm text-gray-600">
                    You have {missingCheckpoints.length} checkpoint{missingCheckpoints.length > 1 ? 's' : ''} left to review
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Items to check:
                </p>
                <div className="space-y-2">
                  {missingCheckpoints.map((checkpoint, index) => (
                    <motion.div
                      key={checkpoint.id}
                      className="flex items-start gap-3 p-3 rounded-[2px] border border-gray-300 bg-gray-50"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-[2px] border-2 border-gray-400 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-gray-600">{checkpoint.id}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">
                          {checkpoint.titleMy}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {checkpoint.titleEn}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50 font-semibold"
                onClick={onBack}
                size="lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" weight="bold" />
                Back to Checklist
              </Button>
            </div>
          </>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-center text-gray-500">
          Ensure your zakat receipt is from a body recognized by LHDN
        </p>
      </motion.div>
    </div>
  );
}
