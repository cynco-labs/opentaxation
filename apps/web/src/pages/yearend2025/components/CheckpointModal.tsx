import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, X, Info, WarningCircle, CheckCircle } from 'phosphor-react';
import type { CheckpointData } from '../zakatReceiptChecklist';

interface CheckpointModalProps {
  checkpoint: CheckpointData | undefined;
  isOpen: boolean;
  isCompleted: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function CheckpointModal({
  checkpoint,
  isOpen,
  isCompleted,
  onClose,
  onComplete,
}: CheckpointModalProps) {
  if (!checkpoint) return null;

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <AnimatePresence>
          {isOpen && (
            <>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild forceMount>
                <motion.div
                  className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-3xl p-6 md:p-8 max-w-lg w-[calc(100%-2rem)] z-50 shadow-2xl max-h-[90vh] overflow-y-auto"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
                >
                  {/* Close button */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                      aria-label="Close"
                    >
                      <X weight="bold" className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </Dialog.Close>

                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#722F37]/10 flex items-center justify-center font-bold text-[#722F37] text-lg">
                        {checkpoint.id}
                      </div>
                      <div className="flex-1">
                        <Dialog.Title className="text-xl md:text-2xl font-bold text-[#722F37]">
                          {checkpoint.titleMy}
                        </Dialog.Title>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {checkpoint.titleEn}
                        </p>
                      </div>
                    </div>

                    {checkpoint.emphasis === 'high' && (
                      <Badge className="bg-[#E5A84B] text-white border-none">
                        penting! double check this one
                      </Badge>
                    )}
                  </div>

                  {/* Main description */}
                  <div className="mb-6">
                    <p className="text-base text-[#4A3728] leading-relaxed">
                      {checkpoint.descriptionMy}
                    </p>
                  </div>

                  <Separator className="my-6" />

                  {/* Info sections */}
                  <div className="space-y-4">
                    {/* Why it matters */}
                    <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                      <Info weight="duotone" className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          why this matters:
                        </p>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          {checkpoint.whyItMatters}
                        </p>
                      </div>
                    </div>

                    {/* Common mistake */}
                    <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <WarningCircle weight="duotone" className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-900 mb-1">
                          common mistake:
                        </p>
                        <p className="text-sm text-amber-800 leading-relaxed">
                          {checkpoint.commonMistake}
                        </p>
                      </div>
                    </div>

                    {/* How to check */}
                    <div className="flex gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <CheckCircle weight="duotone" className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-emerald-900 mb-2">
                          how to check:
                        </p>
                        <ul className="space-y-1.5">
                          {checkpoint.howToFix.map((step, index) => (
                            <li key={index} className="text-sm text-emerald-800 flex gap-2 leading-relaxed">
                              <span className="flex-shrink-0 mt-1">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 mt-6 pt-6 border-t">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={onClose}
                      size="lg"
                    >
                      close
                    </Button>
                    {!isCompleted && (
                      <Button
                        className="flex-1 bg-[#722F37] hover:bg-[#722F37]/90"
                        onClick={handleComplete}
                        size="lg"
                      >
                        <Check className="mr-2 h-5 w-5" weight="bold" />
                        mark as checked
                      </Button>
                    )}
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
