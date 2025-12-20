import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CaretDown, NotePencil, Coins } from 'phosphor-react';
import MobileHeader from './MobileHeader';

interface MobileUnifiedLayoutProps {
  inputsContent: React.ReactNode;
  resultsContent: React.ReactNode;
  hasResults: boolean;
  onClearInputs?: () => void;
}

/**
 * Mobile Unified Layout
 *
 * Shows inputs in a collapsible section at the top with results always visible below.
 * This eliminates the need to switch tabs and provides instant feedback as users adjust inputs.
 */
function MobileUnifiedLayout({
  inputsContent,
  resultsContent,
  hasResults,
  onClearInputs,
}: MobileUnifiedLayoutProps) {
  const { t } = useTranslation();
  const [inputsExpanded, setInputsExpanded] = useState(true);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background">
      {/* Compact header */}
      <MobileHeader onClearInputs={onClearInputs} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {/* Collapsible Inputs Section */}
        <div className="border-b border-border/50">
          <button
            type="button"
            onClick={() => setInputsExpanded(!inputsExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors sticky top-0 z-10"
            aria-expanded={inputsExpanded}
            aria-controls="inputs-accordion"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <NotePencil weight="duotone" className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <span className="text-sm font-medium text-foreground block">
                  {t('inputs.header.title')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {inputsExpanded ? t('mobile.tapToCollapse') : t('mobile.tapToExpand')}
                </span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: inputsExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <CaretDown weight="bold" className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {inputsExpanded && (
              <motion.div
                id="inputs-accordion"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="pb-2">
                  {inputsContent}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Section - Always visible */}
        <div className="p-4 pb-safe">
          {hasResults ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-semibold text-foreground" id="results-heading">
                  {t('results.title')}
                </h2>
                <div className="flex-1 h-px bg-border/50" />
              </div>
              {resultsContent}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Coins weight="duotone" className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium mb-1">{t('results.enterProfit')}</p>
              <p className="text-xs opacity-70">{t('results.enterProfitHint')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(MobileUnifiedLayout);
