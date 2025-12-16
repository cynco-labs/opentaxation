import { useEffect, useRef, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, X, Heart, ArrowUpRight } from 'phosphor-react';

interface SupportButtonProps {
  className?: string;
}

const SupportButton = memo(function SupportButton({ className = '' }: SupportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const handleSupport = () => {
    window.open('https://donate.stripe.com/7sY4gA3nIc2CaPe2t98AE04', '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border/50 hover:border-border rounded-full transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Coffee weight="duotone" className="h-3 w-3 text-amber-500" />
        <span>Support</span>
        <Heart weight="fill" className="h-2 w-2 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
          >
            <div className="bg-background rounded-lg shadow-lg border border-border p-3 w-[200px]">
              {/* Arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background border-r border-b border-border rotate-45" />

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-1.5 right-1.5 p-0.5 rounded hover:bg-muted transition-colors"
              >
                <X weight="bold" className="h-3 w-3 text-muted-foreground" />
              </button>

              {/* Content */}
              <p className="text-xs text-muted-foreground mb-2.5 pr-4">
                Help keep this tool free & open source
              </p>

              {/* CTA Button */}
              <button
                onClick={handleSupport}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-md transition-colors"
              >
                <Coffee weight="fill" className="h-3.5 w-3.5" />
                Buy us a coffee
                <ArrowUpRight weight="bold" className="h-3 w-3 opacity-60" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default SupportButton;
