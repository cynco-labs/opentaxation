import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Link as LinkIcon,
  WhatsappLogo,
  TelegramLogo,
  EnvelopeSimple,
  Copy,
  Check,
  Share,
  ShareNetwork,
} from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import type { ComparisonResult } from '@tax-engine/core';

interface ShareButtonProps {
  comparison: ComparisonResult | null;
  generateShareableLink: () => string;
  className?: string;
}

export default function ShareButton({
  comparison,
  generateShareableLink,
  className = '',
}: ShareButtonProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate share URL when popover opens
  useEffect(() => {
    if (isOpen) {
      setShareUrl(generateShareableLink());
      setCopied(false);
    }
  }, [isOpen, generateShareableLink]);

  const shareText = comparison
    ? `I compared Enterprise vs Sdn Bhd taxes for my business. Check it out:`
    : 'Compare Enterprise vs Sdn Bhd tax in Malaysia';

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const shareViaWhatsApp = useCallback(() => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`, '_blank');
  }, [shareText, shareUrl]);

  const shareViaTelegram = useCallback(() => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  }, [shareText, shareUrl]);

  const shareViaEmail = useCallback(() => {
    window.location.href = `mailto:?subject=${encodeURIComponent('Tax Comparison')}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
  }, [shareText, shareUrl]);

  // Close on escape or click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Share Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center justify-center gap-2 px-5 sm:px-5 h-12 sm:h-11 bg-card border border-border/50 text-xs sm:text-sm hover:bg-muted/50 hover:border-primary/30 active:scale-[0.98] transition-all duration-200 rounded-xl font-medium shadow-sm min-h-[48px] touch-target"
      >
        <ShareNetwork weight="duotone" className="h-4 w-4 text-primary" />
        <span>{t('results.share')}</span>
      </motion.button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-2 sm:right-0 mb-3 z-50 w-[320px] max-w-[calc(100vw-2rem)]"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-background rounded-xl shadow-xl border border-border overflow-hidden">
              {/* Arrow */}
              <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-background border-r border-b border-border rotate-45" />

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <Share weight="duotone" className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold">Share Results</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Close share dialog"
                >
                  <X weight="bold" className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Copy Link */}
              <div className="px-5 pb-5 space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="w-full h-10 px-3 pr-9 bg-muted/50 border border-border rounded-lg text-sm font-mono truncate focus:outline-none focus:ring-2 focus:ring-primary/20"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <LinkIcon
                      weight="duotone"
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    />
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`h-10 px-4 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      copied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check weight="bold" className="h-4 w-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy weight="bold" className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Share buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={shareViaWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
                  >
                    <WhatsappLogo weight="fill" className="h-5 w-5 text-[#25D366]" />
                    <span className="text-sm font-medium text-[#25D366]">WhatsApp</span>
                  </button>
                  <button
                    onClick={shareViaTelegram}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0088cc]/10 hover:bg-[#0088cc]/20 transition-colors"
                  >
                    <TelegramLogo weight="fill" className="h-5 w-5 text-[#0088cc]" />
                    <span className="text-sm font-medium text-[#0088cc]">Telegram</span>
                  </button>
                  <button
                    onClick={shareViaEmail}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <EnvelopeSimple weight="duotone" className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
