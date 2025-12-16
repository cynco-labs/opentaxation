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
export default function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
  index
}: FAQItemProps) {
  const answerId = `faq-answer-${question.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`group relative rounded-2xl transition-all duration-300 ${
        isOpen
          ? 'bg-card border border-border shadow-sm'
          : 'bg-transparent hover:bg-card/50'
      }`}
    >
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={answerId}
        className="w-full flex items-start gap-4 p-5 sm:p-6 text-left min-h-[56px] active:bg-foreground/5 transition-colors"
      >
        {/* Number indicator */}
        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
          isOpen
            ? 'bg-foreground text-background'
            : 'bg-foreground/5 text-muted-foreground group-hover:bg-foreground/10'
        }`}>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Question and toggle */}
        <div className="flex-1 flex items-start justify-between gap-4">
          <span className={`text-[15px] sm:text-base font-medium transition-colors duration-200 ${
            isOpen ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'
          }`}>
            {question}
          </span>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex-shrink-0 mt-0.5"
          >
            <CaretDown weight="bold" className={`h-4 w-4 transition-colors duration-200 ${
              isOpen ? 'text-foreground' : 'text-muted-foreground'
            }`} />
          </motion.div>
        </div>
      </button>

      {/* Answer with height animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={answerId}
            role="region"
            aria-hidden={!isOpen}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[4.5rem] sm:pl-[5rem]">
              <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
