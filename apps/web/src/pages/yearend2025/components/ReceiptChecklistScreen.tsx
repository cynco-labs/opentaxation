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
      className="h-screen w-full bg-[#FAF7F2] overflow-hidden flex flex-col"
    >
      {/* Compact Header */}
      <div className="flex-shrink-0 bg-white/95 backdrop-blur-xl border-b border-border/20 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#4A3728]">
              {completedIds.length}/{CHECKPOINTS.length} checked
            </span>
            <div className="w-32 h-1.5 bg-muted rounded-[2px] overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-[#5A2129] to-[#722F37] shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${(completedIds.length / CHECKPOINTS.length) * 100}%` }}
                transition={{ type: 'spring', bounce: 0.2 }}
                style={{
                  boxShadow: completedIds.length > 0 ? '0 0 8px rgba(90, 33, 41, 0.3)' : 'none',
                }}
              />
            </div>
          </div>
          {completedIds.length > 0 && (
            <button
              onClick={onReset}
              className="text-xs text-muted-foreground hover:text-[#5A2129] transition-colors"
            >
              reset
            </button>
          )}
        </div>
      </div>

      {/* Main Content - Fits in viewport */}
      <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
        <div className="w-full max-w-7xl h-full flex flex-col">
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
