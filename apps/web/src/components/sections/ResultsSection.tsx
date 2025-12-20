import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkle, UserCircle } from 'phosphor-react';
import { Link } from 'react-router-dom';
import TaxCard from '../TaxCard';
import RecommendationCard from '../RecommendationCard';
import WhatsNextCTA from '../WhatsNextCTA';
import CrossoverChart from '../CrossoverChart';
import NonTaxFactorsCard from '../NonTaxFactorsCard';
import ShareButton from '../ShareButton';
import SupportButton from '../SupportButton';
import type { ComparisonResult, TaxCalculationInputs } from '@tax-engine/core';

interface ResultsSectionProps {
  comparison: ComparisonResult | null;
  inputs: TaxCalculationInputs;
  generateShareableLink?: () => string;
  /** Hide header for mobile tab layout (header is in MobileHeader instead) */
  hideHeader?: boolean;
  /** Whether user is signed in - used to show save prompt for guests */
  isSignedIn?: boolean;
}

function ResultsSection({ comparison, inputs, generateShareableLink, hideHeader = false, isSignedIn = false }: ResultsSectionProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex-1 overflow-hidden bg-brand-muted-ivory"
    >
      <div className="h-full flex flex-col">
        {/* Sticky header - iOS native style - hidden when using MobileTabLayout */}
        {!hideHeader && (
          <header className="sticky top-0 z-40 bg-brand-muted-ivory/90 backdrop-blur-xl border-b border-brand-border-ivory/60 supports-[backdrop-filter]:bg-brand-muted-ivory/80 lg:bg-transparent lg:backdrop-blur-none lg:border-0">
            <div className="px-5 sm:px-5 lg:px-8 py-4 sm:py-4 lg:py-6">
              <h2 className="font-display text-lg sm:text-xl lg:text-3xl font-bold tracking-tight" id="results-heading">
                {t('results.header.title')}
              </h2>
              <p className="text-xs text-muted-foreground">{t('results.header.subtitle')}</p>
            </div>
          </header>
        )}

        <AnimatePresence mode="wait">
          {comparison ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
              role="region"
              aria-labelledby="results-heading"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="px-4 sm:px-5 lg:px-8 py-4 sm:py-5 lg:py-6 space-y-3 sm:space-y-4 pb-safe">
                {/* Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.02, duration: 0.25 }}
                  >
                    <TaxCard
                      title={t('results.enterprise')}
                      tax={comparison.solePropResult.personalTax}
                      netCash={comparison.solePropResult.netCash}
                      effectiveTaxRate={comparison.solePropResult.effectiveTaxRate}
                      waterfall={comparison.solePropResult.waterfall}
                      insights={comparison.solePropResult.insights}
                      taxBracketBreakdown={comparison.solePropResult.taxBracketBreakdown}
                      taxableIncome={comparison.solePropResult.breakdown.taxableIncome}
                      zakat={comparison.solePropResult.zakat}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04, duration: 0.25 }}
                  >
                    <TaxCard
                      title={t('results.sdnbhd')}
                      tax={comparison.sdnBhdResult.corporateTax + comparison.sdnBhdResult.personalTax + comparison.sdnBhdResult.breakdown.dividendTax}
                      netCash={comparison.hasAffordabilityIssue ? 0 : comparison.sdnBhdResult.netCash}
                      effectiveTaxRate={
                        inputs.businessProfit > 0 && !comparison.hasAffordabilityIssue
                          ? (comparison.sdnBhdResult.corporateTax + comparison.sdnBhdResult.personalTax + comparison.sdnBhdResult.breakdown.dividendTax) /
                            inputs.businessProfit
                          : 0
                      }
                      companyWaterfall={comparison.sdnBhdResult.companyWaterfall}
                      personalWaterfall={comparison.sdnBhdResult.personalWaterfall}
                      insights={comparison.sdnBhdResult.insights}
                      hasWarning={comparison.hasAffordabilityIssue}
                      warningText={comparison.hasAffordabilityIssue ? t('results.salaryWarning') : undefined}
                      corporateTaxBracketBreakdown={comparison.sdnBhdResult.corporateTaxBracketBreakdown}
                      personalTaxBracketBreakdown={comparison.sdnBhdResult.personalTaxBracketBreakdown}
                      companyTaxableProfit={comparison.sdnBhdResult.breakdown.companyTaxableProfit}
                      personalTaxableIncome={comparison.sdnBhdResult.breakdown.annualSalary}
                      zakat={comparison.sdnBhdResult.zakat}
                    />
                  </motion.div>
                </div>

                {/* Recommendation */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, duration: 0.25 }}
                >
                  <RecommendationCard comparison={comparison} />
                </motion.div>

                {/* What's Next CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.25 }}
                >
                  <WhatsNextCTA comparison={comparison} />
                </motion.div>

                {/* Crossover Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.25 }}
                >
                  <CrossoverChart inputs={inputs} />
                </motion.div>

                {/* Non-Tax Factors */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.25 }}
                >
                  <NonTaxFactorsCard />
                </motion.div>

                {/* Action Buttons */}
                {generateShareableLink && (
                  <div className="flex justify-center gap-3 pt-3 sm:pt-4 pb-2">
                    <ShareButton
                      comparison={comparison}
                      generateShareableLink={generateShareableLink}
                    />
                  </div>
                )}

                {/* Sign-in prompt for guests */}
                {!isSignedIn && (
                  <div className="pb-4 sm:pb-6">
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl transition-colors"
                    >
                      <UserCircle weight="duotone" className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <span className="text-xs sm:text-sm text-foreground">
                        <span className="font-medium">{t('results.signIn')}</span>
                        <span className="text-muted-foreground"> {t('results.signInPrompt')}</span>
                      </span>
                    </Link>
                  </div>
                )}

                {/* Support prompt */}
                <div className="flex justify-center pt-3 sm:pt-4 pb-4 sm:pb-6">
                  <SupportButton />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-brand-muted-ivory flex items-center justify-center border border-brand-border-ivory">
                  <Sparkle weight="duotone" className="h-8 w-8 sm:h-10 sm:w-10 text-brand-espresso/50" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-medium text-brand-espresso">{t('results.empty.title')}</p>
                  <p className="text-xs sm:text-sm text-brand-espresso/60">{t('results.empty.subtitle')}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default memo(ResultsSection);
