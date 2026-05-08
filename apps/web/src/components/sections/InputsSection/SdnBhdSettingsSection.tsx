import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import Slider from '@/components/Slider';
import { SectionHeader, CollapsibleSection } from './shared';
import type { SdnBhdSettingsSectionProps } from './types';
import InputField from '@/components/InputField';

export default function SdnBhdSettingsSection({
  inputs,
  callbacks,
}: SdnBhdSettingsSectionProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.04, duration: 0.3 }}
    >
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-5 sm:p-5 space-y-4">
          <SectionHeader
            title={t('inputs.sdnbhd.title')}
            subtitle={t('inputs.sdnbhd.subtitle')}
            tip={t('inputs.sdnbhd.tip')}
          />

          <div className="space-y-5">
            <div className="space-y-2">
              <Slider
                label={t('inputs.salary.label')}
                value={inputs.monthlySalary || 0}
                onChange={callbacks.onMonthlySalaryChange}
                min={0}
                max={20000}
                step={500}
                tooltip={t('inputs.salary.tooltip')}
              />
              <p className="text-xs text-muted-foreground pl-1">
                {t('inputs.salary.helper')}
              </p>
              {(inputs.monthlySalary || 0) * 12 > (inputs.businessProfit || 0) && inputs.businessProfit > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-500 pl-1 flex items-start gap-1.5">
                  <span className="flex-shrink-0">⚠️</span>
                  <span>
                    {t('inputs.salary.warning', {
                      annualSalary: ((inputs.monthlySalary || 0) * 12).toLocaleString('en-MY'),
                      profit: (inputs.businessProfit || 0).toLocaleString('en-MY'),
                    })}
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Slider
                label={t('inputs.compliance.label')}
                value={inputs.complianceCosts || 3000}
                onChange={callbacks.onComplianceCostsChange}
                min={3000}
                max={15000}
                step={500}
                tooltip={t('inputs.compliance.tooltip')}
              />
              <p className="text-xs text-muted-foreground pl-1">
                {t('inputs.compliance.helper')}
              </p>
            </div>

            <div className="space-y-2">
              <Slider
                label={t('inputs.dividend.label')}
                value={inputs.dividendDistributionPercent ?? 100}
                onChange={callbacks.onDividendDistributionPercentChange}
                min={0}
                max={100}
                step={10}
                prefix=""
                formatValue={(v) => `${v}%`}
                tooltip={t('inputs.dividend.tooltip')}
              />
              <p className="text-xs text-muted-foreground pl-1">
                {t('inputs.dividend.helper')}
              </p>
              <p className="text-xs text-muted-foreground/80 pl-1 italic">
                {inputs.dividendDistributionPercent === 100
                  ? t('inputs.dividend.takingAll')
                  : inputs.dividendDistributionPercent === 0
                  ? t('inputs.dividend.keepingAll')
                  : t('inputs.dividend.partial', { percent: inputs.dividendDistributionPercent, keep: 100 - (inputs.dividendDistributionPercent ?? 100) })}
              </p>
            </div>
          </div>

          {/* Advanced options */}
          <CollapsibleSection title={t('inputs.advanced.title')} defaultOpen={false}>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <InputField
                  label={t('inputs.advanced.paidUpCapital')}
                  value={inputs.paidUpCapital || 0}
                  onChange={(v) => { callbacks.onSmePaidUpCapitalChange?.(v); }}
                  prefix="RM"
                  helperText={t('inputs.advanced.paidUpCapitalHelper')}
                />
                <InputField
                  label={t('inputs.advanced.grossIncome')}
                  value={inputs.grossIncome || 0}
                  onChange={(v) => { callbacks.onSmeGrossIncomeChange?.(v); }}
                  prefix="RM"
                  helperText={t('inputs.advanced.grossIncomeHelper')}
                />
                <InputField
                  label={t('inputs.advanced.relatedShare')}
                  value={inputs.relatedCompanyShare || 0}
                  onChange={(v) => { callbacks.onSmeRelatedShareChange?.(v); }}
                  suffix="%"
                  helperText={t('inputs.advanced.relatedShareHelper')}
                  max={100}
                />
              </div>
              <label className="flex items-start gap-3 cursor-pointer group py-1">
                <input
                  type="checkbox"
                  checked={inputs.applyYa2025DividendSurcharge || false}
                  onChange={(e) => callbacks.onApplyYa2025DividendSurchargeChange(e.target.checked)}
                  className="h-5 w-5 mt-0.5 text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 border-border rounded transition-colors flex-shrink-0"
                />
                <div>
                  <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                    {t('inputs.advanced.surcharge')}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('inputs.advanced.surchargeHelper')}
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group py-1">
                <input
                  type="checkbox"
                  checked={inputs.hasForeignOwnership || false}
                  onChange={(e) => callbacks.onForeignOwnershipChange(e.target.checked)}
                  className="h-5 w-5 mt-0.5 text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 border-border rounded transition-colors flex-shrink-0"
                />
                <div>
                  <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                    {t('inputs.advanced.foreign')}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('inputs.advanced.foreignHelper')}
                  </p>
                </div>
              </label>
            </div>
          </CollapsibleSection>
        </CardContent>
      </Card>
    </motion.div>
  );
}
