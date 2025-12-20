import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Info, WarningCircle, CheckCircle } from 'phosphor-react';
import type { CheckpointData } from '../zakatReceiptChecklist';

interface FloatingCheckpointModalProps {
  checkpoint: CheckpointData | undefined;
  isOpen: boolean;
  isCompleted: boolean;
  anchorPosition: { x: number; y: number } | null;
  onClose: () => void;
  onComplete: () => void;
}

export default function FloatingCheckpointModal({
  checkpoint,
  isOpen,
  isCompleted,
  anchorPosition,
  onClose,
  onComplete,
}: FloatingCheckpointModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isCompleted) {
          onComplete();
        }
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, isCompleted, onComplete]);

  if (!checkpoint) return null;

  const handleClose = () => {
    // Mark as complete when closing (user has read it)
    if (!isCompleted) {
      onComplete();
    }
    onClose();
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            {/* Centered Modal */}
            <motion.div
              ref={modalRef}
              className="relative bg-white rounded-[2px] shadow-2xl border border-gray-300 max-w-lg w-full my-auto max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.25 }}
            >

              {/* Minimal Header */}
              <div className="relative bg-gray-50 px-4 sm:px-6 py-4 sm:py-5 border-b-2 border-gray-300">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-[2px] transition-colors"
                  aria-label="Close"
                >
                  <X weight="bold" className="h-4 w-4 text-gray-600" />
                </button>

                <div className="flex items-start gap-4 pr-8">
                  {/* Minimal number badge */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-[2px] border-2 border-gray-900 bg-white flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">
                      {checkpoint.id}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-base font-bold text-gray-900 leading-tight mb-1">
                      {checkpoint.titleMy}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {checkpoint.titleEn}
                    </p>
                    {checkpoint.emphasis === 'high' && (
                      <p className="text-[10px] text-[#E5A84B] font-bold mt-1">
                        ⭐ PENTING
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                {/* Main description */}
                <p className="text-sm sm:text-base text-gray-900 leading-relaxed mb-6">
                  {checkpoint.descriptionMy}
                </p>

                {/* Info sections - minimal gray design */}
                <div className="space-y-4">
                  {/* Why it matters */}
                  <div className="border-l-2 border-gray-400 pl-4">
                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                      Kenapa Penting
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {checkpoint.whyItMatters}
                    </p>
                  </div>

                  {/* Common mistake */}
                  <div className="border-l-2 border-gray-400 pl-4">
                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                      Kesilapan Biasa
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {checkpoint.commonMistake}
                    </p>
                  </div>

                  {/* How to check */}
                  <div className="border-l-2 border-gray-400 pl-4">
                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Cara Semak
                    </p>
                    <ul className="space-y-1.5">
                      {checkpoint.howToFix.map((step, index) => (
                        <li key={index} className="text-xs text-gray-700 flex gap-2 leading-relaxed">
                          <span className="flex-shrink-0 text-gray-500">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
                <Button
                  className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white transition-colors font-semibold py-3 sm:py-2.5 touch-manipulation active:scale-95"
                  onClick={handleClose}
                >
                  <Check className="mr-2 h-4 w-4" weight="bold" />
                  Faham, Tutup
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
