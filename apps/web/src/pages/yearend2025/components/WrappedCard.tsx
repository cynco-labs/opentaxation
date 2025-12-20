import { forwardRef } from 'react';
import { Check, ArrowSquareOut } from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CHECKPOINTS } from '../zakatReceiptChecklist';

interface WrappedCardProps {
  completedIds: number[];
  score: number;
  totalCount: number;
}

const WrappedCard = forwardRef<HTMLDivElement, WrappedCardProps>(
  ({ completedIds, score, totalCount }, ref) => {
    const isComplete = score === totalCount;

    return (
      <div
        ref={ref}
        className="bg-white rounded-[2px] p-5 sm:p-10 shadow-xl max-w-2xl mx-auto border border-gray-300"
      >
        <div className="text-center space-y-3 sm:space-y-6">
          {/* Minimal Header */}
          <div className="space-y-2 sm:space-y-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-[2px] border-2 border-gray-900 flex items-center justify-center">
              <span className="text-xl sm:text-2xl">🕌</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                Zakat Receipt Check
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Year End 2025</p>
            </div>
          </div>

          {/* Quranic Verse with Arabic */}
          <div className="py-3 sm:py-6 border-y border-gray-200 space-y-2 sm:space-y-4">
            {/* Arabic Text */}
            <p className="text-xl sm:text-3xl leading-loose text-gray-900" style={{ fontFamily: 'serif' }} dir="rtl">
              خُذۡ مِنۡ أَمۡوَٰلِهِمۡ صَدَقَةً تُطَهِّرُهُمۡ وَتُزَكِّيهِم بِهَا
            </p>
            {/* English Translation */}
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic max-w-md mx-auto px-2 sm:px-0">
              "Take from their wealth a charity by which you purify them and cause them increase"
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">
              — Surah At-Tawbah (9:103)
            </p>
          </div>

          {/* Checkpoint Grid - Compact */}
          <div className="py-2 sm:py-4">
            <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap">
              {CHECKPOINTS.map((checkpoint) => {
                const isCompleted = completedIds.includes(checkpoint.id);
                return (
                  <div
                    key={checkpoint.id}
                    className={cn(
                      'w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] flex items-center justify-center text-xs font-bold border-2',
                      isCompleted
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    )}
                    title={checkpoint.titleEn}
                  >
                    {isCompleted ? (
                      <Check weight="bold" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : (
                      checkpoint.id
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-600 mt-2 sm:mt-3">
              {isComplete ? 'All checkpoints completed' : `${score}/${totalCount} completed`}
            </p>
          </div>

          {/* Hadith - Minimal */}
          <div className="py-2 sm:py-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-800 italic">
              "Charity does not decrease wealth."
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
              — Prophet Muhammad ﷺ
            </p>
          </div>

          {/* CTA - Pay Zakat */}
          {isComplete && (
            <div className="pt-2 sm:pt-4 border-t border-gray-200 space-y-2 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  Haven't Paid Zakat Yet?
                </p>
                <p className="text-[10px] sm:text-xs text-gray-600 max-w-md mx-auto leading-relaxed px-2 sm:px-0">
                  Pay before <strong>Dec 31, 2025</strong> to fulfill your responsibility and claim tax rebate
                </p>
              </div>
              <Button
                asChild
                className="bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white font-semibold text-xs sm:text-sm py-2.5 sm:py-3 w-full sm:w-auto px-6 sm:px-8 touch-manipulation active:scale-95 transition-all"
              >
                <a
                  href="https://zakat2u.com.my/cart/troli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  Pay Zakat Now
                  <ArrowSquareOut className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" weight="bold" />
                </a>
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="pt-2 sm:pt-4 text-[10px] sm:text-xs text-gray-500">
            <p>opentaxation.my/yearend2025</p>
          </div>
        </div>
      </div>
    );
  }
);

WrappedCard.displayName = 'WrappedCard';

export default WrappedCard;
