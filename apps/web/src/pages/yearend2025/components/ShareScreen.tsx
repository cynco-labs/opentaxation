import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import {
  DownloadSimple,
  Link as LinkIcon,
  ArrowLeft,
  ArrowCounterClockwise,
} from 'phosphor-react';
import { CHECKPOINTS } from '../zakatReceiptChecklist';
import WrappedCard from './WrappedCard';

interface ShareScreenProps {
  completedIds: number[];
  onBack: () => void;
  onReset: () => void;
}

export default function ShareScreen({
  completedIds,
  onBack,
  onReset,
}: ShareScreenProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalCount = CHECKPOINTS.length;
  const score = completedIds.length;

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);

    try {
      // Wait for fonts to load
      await document.fonts.ready;

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#FAF7F2',
        scale: 2, // High quality / retina display
        logging: false,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = 'opentaxation-zakat-wrapped-2025.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate PNG:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/yearend2025`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link. Please copy manually: ' + url);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#FAF7F2] flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: 'spring', bounce: 0.2 }}
        className="w-full max-w-2xl space-y-2 sm:space-y-4"
      >
        {/* Title - Compact on mobile */}
        <div className="text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-[#722F37] mb-1">
            your zakat wrapped
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            download and share your checklist status
          </p>
        </div>

        {/* Wrapped Card - Scaled for mobile */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.2 }}
          className="px-2 sm:px-0"
        >
          <WrappedCard
            ref={cardRef}
            completedIds={completedIds}
            score={score}
            totalCount={totalCount}
          />
        </motion.div>

        {/* Action buttons - Better mobile UX */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 px-2 sm:px-0"
        >
          <Button
            size="lg"
            className="flex-1 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white py-3 touch-manipulation active:scale-95 transition-all"
            onClick={handleDownloadPNG}
            disabled={isDownloading}
          >
            <DownloadSimple
              className="h-5 w-5 sm:mr-2"
              weight="bold"
            />
            <span className="hidden sm:inline">
              {isDownloading ? 'generating...' : 'download PNG'}
            </span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-gray-300 py-3 touch-manipulation active:scale-95 transition-all active:bg-gray-50"
            onClick={handleCopyLink}
          >
            <LinkIcon className="h-5 w-5 sm:mr-2" weight="bold" />
            <span className="hidden sm:inline">
              {copied ? 'copied!' : 'copy link'}
            </span>
          </Button>
        </motion.div>

        {/* Back and reset - Desktop only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="hidden sm:flex gap-3"
        >
          <Button
            variant="outline"
            className="flex-1 border-gray-300 py-2 touch-manipulation active:scale-95 transition-all active:bg-gray-50"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" weight="bold" />
            back
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-gray-300 py-2 touch-manipulation active:scale-95 transition-all active:bg-gray-50"
            onClick={onReset}
          >
            <ArrowCounterClockwise className="mr-2 h-4 w-4" weight="bold" />
            start over
          </Button>
        </motion.div>

        {/* Footer note - Smaller on mobile */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[10px] sm:text-xs text-muted-foreground px-4"
        >
          share this tool with friends and family to help them verify their zakat receipts before year end.
        </motion.p>
      </motion.div>
    </div>
  );
}
