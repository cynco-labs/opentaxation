import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretDown } from 'phosphor-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

/**
 * Accordion FAQ item with numbered badges and smooth animations
 */
const FAQItem = React.memo(function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
  index
}: FAQItemProps) {
  const answerId = `faq-answer-${question.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div
      className={`group relative rounded-xl sm:rounded-2xl transition-all duration-200 ${
        isOpen
          ? 'bg-card border border-border'
          : 'bg-transparent border border-transparent hover:bg-card/50'
      }`}
    >
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={answerId}
        className="w-full flex items-start gap-3 sm:gap-4 p-4 sm:p-5 text-left min-h-[52px] active:bg-foreground/5 transition-colors"
      >
        {/* Number indicator */}
        <span className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${
          isOpen
            ? 'bg-foreground text-background'
            : 'bg-muted text-muted-foreground'
        }`}>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Question and toggle */}
        <div className="flex-1 flex items-start justify-between gap-3">
          <span className={`text-sm sm:text-[15px] font-medium leading-snug transition-colors ${
            isOpen ? 'text-foreground' : 'text-foreground/80'
          }`}>
            {question}
          </span>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="flex-shrink-0 mt-0.5"
          >
            <CaretDown weight="bold" className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
              isOpen ? 'text-foreground' : 'text-muted-foreground'
            }`} />
          </motion.div>
        </div>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={answerId}
            role="region"
            aria-hidden={!isOpen}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pl-[3.25rem] sm:pl-[4rem]">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default FAQItem;
