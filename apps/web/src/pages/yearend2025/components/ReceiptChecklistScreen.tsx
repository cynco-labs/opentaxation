import { useState } from 'react';
import { motion } from 'framer-motion';
import { CHECKPOINTS } from '../zakatReceiptChecklist';
import type { CheckpointData } from '../zakatReceiptChecklist';
import ReceiptCanvas from './ReceiptCanvas';
import FloatingCheckpointModal from './FloatingCheckpointModal';

interface ReceiptChecklistScreenProps {
  completedIds: number[];
  activeCheckpoint: CheckpointData | undefined;
  onCheckpointClick: (id: number) => void;
  onCheckpointComplete: (id: number) => void;
  onCloseModal: () => void;
  onContinue: () => void;
  onReset: () => void;
}

export default function ReceiptChecklistScreen({
  completedIds,
  activeCheckpoint,
  onCheckpointClick,
  onCheckpointComplete,
  onCloseModal,
  onContinue,
  onReset,
}: ReceiptChecklistScreenProps) {
  const [modalAnchor, setModalAnchor] = useState<{ x: number; y: number } | null>(null);
  const allCompleted = completedIds.length === CHECKPOINTS.length;

  const handleHotspotClick = (id: number, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalAnchor({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    onCheckpointClick(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-[#FAF7F2] flex flex-col"
    >
      {/* Beautiful Header - Sticky */}
      <div className="sticky top-0 z-20 flex-shrink-0 bg-gradient-to-b from-white to-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Progress Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[2px] bg-gradient-to-br from-[#5A2129] to-[#722F37] flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">{completedIds.length}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {completedIds.length}/{CHECKPOINTS.length} completed
                </p>
                <p className="text-xs text-gray-500">
                  {allCompleted ? 'All done!' : `${CHECKPOINTS.length - completedIds.length} more to go`}
                </p>
              </div>
            </div>
            {completedIds.length > 0 && (
              <button
                onClick={onReset}
                className="text-xs text-gray-500 hover:text-[#5A2129] transition-colors font-medium"
              >
                reset
              </button>
            )}
          </div>

          {/* Beautiful Progress Bar */}
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#5A2129] to-[#722F37] rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${(completedIds.length / CHECKPOINTS.length) * 100}%` }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.8 }}
            />
            {/* Shimmer effect */}
            {completedIds.length > 0 && completedIds.length < CHECKPOINTS.length && (
              <motion.div
                className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                style={{ width: `${(completedIds.length / CHECKPOINTS.length) * 100}%` }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto">
          <ReceiptCanvas
            completedIds={completedIds}
            activeId={activeCheckpoint?.id || null}
            onHotspotClick={handleHotspotClick}
            onContinue={onContinue}
            allCompleted={allCompleted}
          />
        </div>
      </div>

      {/* Floating Modal */}
      <FloatingCheckpointModal
        checkpoint={activeCheckpoint}
        isOpen={!!activeCheckpoint}
        isCompleted={
          activeCheckpoint ? completedIds.includes(activeCheckpoint.id) : false
        }
        anchorPosition={modalAnchor}
        onClose={() => {
          onCloseModal();
          setModalAnchor(null);
        }}
        onComplete={() => {
          if (activeCheckpoint) {
            onCheckpointComplete(activeCheckpoint.id);
          }
        }}
      />
    </motion.div>
  );
}
