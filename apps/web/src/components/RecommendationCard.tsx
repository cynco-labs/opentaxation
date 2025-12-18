import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ComparisonResult } from '@tax-engine/core';
import { ArrowRight, ArrowLeft, Minus, Sparkle, Warning } from 'phosphor-react';
import { motion } from 'framer-motion';

interface RecommendationCardProps {
  comparison: ComparisonResult;
}

export default function RecommendationCard({ comparison }: RecommendationCardProps) {
  const { t } = useTranslation();
  const { whichIsBetter, savingsIfSwitch, recommendation, hasAffordabilityIssue, hasSmeQualificationIssue, warnings } = comparison;

  const isSdnBhdBetter = whichIsBetter === 'sdnBhd';
  const isSolePropBetter = whichIsBetter === 'soleProp';
  const isSimilar = whichIsBetter === 'similar';
  const hasWarnings = warnings.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`shadow-lg ${
        hasWarnings ? 'border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10' :
        isSdnBhdBetter ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10' :
        isSolePropBetter ? 'border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10' :
        ''
      }`}>
        {/* Warnings Banner */}
        {hasWarnings && (
          <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2.5 sm:px-5 sm:py-3">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Warning weight="duotone" className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-destructive">
                  {hasAffordabilityIssue
                    ? t('recommendation.salaryExceeds')
                    : hasSmeQualificationIssue
                    ? t('recommendation.smeNotApply')
                    : t('recommendation.importantNotice')}
                </p>
                {warnings.map((warning, index) => (
                  <p key={`warning-${warning.slice(0, 20).replace(/\s+/g, '-')}-${index}`} className="text-[11px] sm:text-xs text-destructive/80 mt-1 leading-relaxed">
                    {warning}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        <CardContent className="flex flex-col items-center justify-center p-4 sm:p-5 lg:p-6 text-center space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 mb-1 sm:mb-2">
            {isSdnBhdBetter && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <ArrowRight weight="duotone" className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
              </motion.div>
            )}
            {isSolePropBetter && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                  <ArrowLeft weight="duotone" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </motion.div>
            )}
            {isSimilar && (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center">
                <Minus weight="duotone" className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          <Badge
            className={`text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${
              isSdnBhdBetter ? 'bg-emerald-600 text-white' :
              isSolePropBetter ? 'bg-blue-600 text-white' :
              'bg-muted text-muted-foreground'
            }`}
          >
            {isSdnBhdBetter && t('recommendation.switchToSdnBhd')}
            {isSolePropBetter && t('recommendation.stayEnterprise')}
            {isSimilar && t('recommendation.bothSimilar')}
          </Badge>

          <div className="space-y-1 sm:space-y-2">
            {isSimilar ? (
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {t('recommendation.tooClose')}
              </h2>
            ) : (
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {t('recommendation.save')}{' '}
                <span className="font-numbers text-foreground">
                  RM{savingsIfSwitch.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                <span className="text-muted-foreground text-base sm:text-xl md:text-2xl font-normal"> {t('recommendation.perYear')}</span>
              </h2>
            )}
          </div>

          <Separator className="w-12 sm:w-16 bg-border/50" />

          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm sm:max-w-md leading-relaxed">
            {recommendation}
          </p>

          {!isSimilar && (
            <div className="flex items-center gap-1.5 pt-1 sm:pt-2">
              <Sparkle weight="duotone" className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                {t('recommendation.basedOnInputs')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
