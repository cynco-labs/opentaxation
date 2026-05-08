import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'phosphor-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CheckpointData } from '../zakatReceiptChecklist';

interface ReceiptFieldProps {
  checkpoint: CheckpointData;
  isCompleted: boolean;
  onClick: () => void;
}

export default function ReceiptField({
  checkpoint,
  isCompleted,
  onClick,
}: ReceiptFieldProps) {
  const isEmphasized = checkpoint.emphasis === 'high';

  return (
    <motion.button
      className={cn(
        'relative w-full text-left p-4 rounded-xl transition-all group',
        'border-2 hover:shadow-md active:scale-[0.98]',
        isCompleted
          ? 'border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50'
          : 'border-border/40 bg-white hover:border-brand-burgundy/30 hover:bg-brand-ivory/50',
        isEmphasized && !isCompleted && 'ring-2 ring-brand-amber/30 border-brand-amber/50'
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      animate={
        isEmphasized && !isCompleted
          ? {
              scale: [1, 1.015, 1],
              boxShadow: [
                '0 0 0 0 rgba(229, 168, 75, 0)',
                '0 0 0 6px rgba(229, 168, 75, 0.2)',
                '0 0 0 0 rgba(229, 168, 75, 0)',
              ],
            }
          : {}
      }
      transition={{
        repeat: isEmphasized && !isCompleted ? Infinity : 0,
        duration: 2.5,
        ease: 'easeInOut',
      }}
      aria-label={`Checkpoint ${checkpoint.id}: ${checkpoint.titleEn}`}
      aria-checked={isCompleted}
      role="checkbox"
    >
      <div className="flex items-center gap-3">
        {/* Number / Checkmark */}
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base transition-all',
            isCompleted
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'bg-muted text-muted-foreground group-hover:bg-brand-burgundy/10 group-hover:text-brand-burgundy'
          )}
        >
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
            >
              <Check weight="bold" className="h-6 w-6" />
            </motion.div>
          ) : (
            checkpoint.id
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-brand-espresso mb-0.5 group-hover:text-brand-burgundy transition-colors">
                {checkpoint.titleMy}
              </p>
              <p className="text-sm text-muted-foreground">
                {checkpoint.titleEn}
              </p>
            </div>

            {/* Arrow indicator */}
            {!isCompleted && (
              <ArrowRight
                weight="bold"
                className="h-5 w-5 text-muted-foreground group-hover:text-brand-burgundy group-hover:translate-x-1 transition-all flex-shrink-0"
              />
            )}
          </div>
        </div>

        {/* Emphasis badge */}
        {isEmphasized && !isCompleted && (
          <Badge className="bg-brand-amber text-white border-none flex-shrink-0 text-xs px-2 py-0.5">
            penting
          </Badge>
        )}
      </div>
    </motion.button>
  );
}
