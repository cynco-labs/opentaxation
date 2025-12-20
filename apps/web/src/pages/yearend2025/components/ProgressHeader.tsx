import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowCounterClockwise } from 'phosphor-react';
import { CHECKPOINTS } from '../zakatReceiptChecklist';

interface ProgressHeaderProps {
  completedCount: number;
  onReset: () => void;
}

export default function ProgressHeader({
  completedCount,
  onReset,
}: ProgressHeaderProps) {
  const totalCount = CHECKPOINTS.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border/30 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-[#4A3728]">
              {completedCount}/{totalCount} completed
            </span>
            {completedCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-xs h-7 px-2 text-[#6B5B4F] hover:text-[#722F37]"
              >
                <ArrowCounterClockwise className="mr-1 h-3 w-3" weight="bold" />
                reset
              </Button>
            )}
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-2 bg-muted rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={totalCount}
          >
            <motion.div
              className="h-full bg-[#722F37]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0.2, stiffness: 100 }}
            />
          </div>

          <span className="sr-only">
            {completedCount} out of {totalCount} checkpoints completed
          </span>
        </div>
      </div>
    </div>
  );
}
