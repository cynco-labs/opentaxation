import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { isAuditExempt, getDefaultReliefs, calculateRequiredIncomeForNetCash, calculateTotalReliefs, type PersonalReliefs } from '@tax-engine/config';
import { type TaxCalculationInputs, type InputMode, type ZakatInput, type ReliefClaimValues, getTotalReliefsFromExtended } from '@tax-engine/core';
import { useTaxCalculation } from '@/hooks/useTaxCalculation';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useTaxInputsStorage, type StoredInputs } from '@/hooks/useLocalStorage';
import { useShareableLink } from '@/hooks/useShareableLink';
import { useIsMobile } from '@/hooks/useMediaQuery';
import InputsSection, { type InputCallbacks } from '@/components/sections/InputsSection';
import ResultsSection from '@/components/sections/ResultsSection';
import { MobileUnifiedLayout } from '@/components/mobile';

const DEFAULT_INPUTS: StoredInputs = {
  businessProfit: 0,
  otherIncome: 0,
  monthlySalary: 0,
  complianceCosts: 5000,
  auditRevenue: 100000,
  auditAssets: 300000,
  auditEmployees: 5,
  auditCost: 5000,
  applyYa2025DividendSurcharge: false,
  dividendDistributionPercent: 100,
  hasForeignOwnership: false,
  paidUpCapital: 0,
  grossIncome: 0,
  relatedCompanyShare: 0,
  inputMode: 'profit',
  targetNetIncome: 10000,
  extendedReliefs: {},
};

export default function CalculatorPage() {
  const { user } = useAuth();
  const isSignedIn = !!user;
  const isMobile = useIsMobile();

  const { inputs: storedInputs, updateInput, updateAllInputs, clearInputs } = useTaxInputsStorage(DEFAULT_INPUTS);
  const [reliefs, setReliefs] = useState<PersonalReliefs>(getDefaultReliefs());

  const handleLoadSharedInputs = useCallback((sharedInputs: Partial<StoredInputs>) => {
    updateAllInputs({ ...storedInputs, ...sharedInputs });
  }, [updateAllInputs, storedInputs]);

  const { generateShareableLink } = useShareableLink(storedInputs, handleLoadSharedInputs);

  const handleClearInputs = useCallback(() => {
    clearInputs();
    setReliefs(getDefaultReliefs());
  }, [clearInputs]);

  const inputCallbacks: InputCallbacks = useMemo(() => ({
    onBusinessProfitChange: (v: number) => updateInput('businessProfit', v),
    onOtherIncomeChange: (v: number) => updateInput('otherIncome', v),
    onMonthlySalaryChange: (v: number) => updateInput('monthlySalary', v),
    onComplianceCostsChange: (v: number) => updateInput('complianceCosts', v),
    onAuditRevenueChange: (v: number) => updateInput('auditRevenue', v),
    onAuditAssetsChange: (v: number) => updateInput('auditAssets', v),
    onAuditEmployeesChange: (v: number) => updateInput('auditEmployees', v),
    onAuditCostChange: (v: number) => updateInput('auditCost', v),
    onReliefsChange: setReliefs,
    onExtendedReliefsChange: (v: ReliefClaimValues) => updateInput('extendedReliefs', v),
    onApplyYa2025DividendSurchargeChange: (v: boolean) => updateInput('applyYa2025DividendSurcharge', v),
    onDividendDistributionPercentChange: (v: number) => updateInput('dividendDistributionPercent', v),
    onForeignOwnershipChange: (v: boolean) => updateInput('hasForeignOwnership', v),
    onSmePaidUpCapitalChange: (v: number) => updateInput('paidUpCapital', v),
    onSmeGrossIncomeChange: (v: number) => updateInput('grossIncome', v),
    onSmeRelatedShareChange: (v: number) => updateInput('relatedCompanyShare', v),
    onClearInputs: handleClearInputs,
    onInputModeChange: (v: InputMode) => updateInput('inputMode', v),
    onTargetNetIncomeChange: (v: number) => updateInput('targetNetIncome', v),
    onZakatChange: (v: ZakatInput) => updateInput('zakat', v),
  }), [updateInput, setReliefs, handleClearInputs]);

  const auditRequired = !isAuditExempt({
    revenue: storedInputs.auditRevenue,
    totalAssets: storedInputs.auditAssets,
    employees: storedInputs.auditEmployees,
  });

  const hasExtendedReliefs = storedInputs.extendedReliefs && Object.keys(storedInputs.extendedReliefs).length > 0;
  const totalReliefs = hasExtendedReliefs
    ? getTotalReliefsFromExtended(storedInputs.extendedReliefs!)
    : calculateTotalReliefs(reliefs);

  const annualTargetNetIncome = (storedInputs.targetNetIncome || 10000) * 12;
  const requiredGrossIncome = storedInputs.inputMode === 'target'
    ? calculateRequiredIncomeForNetCash(annualTargetNetIncome, totalReliefs)
    : 0;

  const effectiveBusinessProfit = storedInputs.inputMode === 'target'
    ? Math.max(0, requiredGrossIncome - storedInputs.otherIncome)
    : storedInputs.businessProfit;

  const inputs: TaxCalculationInputs = {
    businessProfit: effectiveBusinessProfit,
    otherIncome: storedInputs.otherIncome,
    monthlySalary: storedInputs.monthlySalary,
    complianceCosts: storedInputs.complianceCosts,
    auditCost: auditRequired ? storedInputs.auditCost : 0,
    auditCriteria: {
      revenue: storedInputs.auditRevenue,
      totalAssets: storedInputs.auditAssets,
      employees: storedInputs.auditEmployees,
    },
    paidUpCapital: storedInputs.paidUpCapital,
    grossIncome: storedInputs.grossIncome,
    relatedCompanyShare: storedInputs.relatedCompanyShare,
    reliefs,
    extendedReliefs: storedInputs.extendedReliefs,
    applyYa2025DividendSurcharge: storedInputs.applyYa2025DividendSurcharge,
    dividendDistributionPercent: storedInputs.dividendDistributionPercent,
    hasForeignOwnership: storedInputs.hasForeignOwnership,
    inputMode: storedInputs.inputMode,
    targetNetIncome: storedInputs.targetNetIncome,
    zakat: storedInputs.zakat,
  };

  const comparison = useTaxCalculation(inputs);
  const { ErrorToastContainer } = useErrorToast();

  return (
    <>
      <ErrorToastContainer />
      <a
        href="#inputs-heading"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md"
      >
        Skip to inputs
      </a>
      <a
        href="#results-heading"
        className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md"
      >
        Skip to results
      </a>
      <AnimatePresence mode="wait">
        {isMobile ? (
          <motion.div
            key="calc-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="safe-area-insets"
          >
            <MobileUnifiedLayout
              hasResults={!!comparison}
              onClearInputs={handleClearInputs}
              inputsContent={
                <InputsSection
                  inputs={inputs}
                  auditRequired={auditRequired}
                  callbacks={inputCallbacks}
                  calculatedProfit={effectiveBusinessProfit}
                  hideHeader
                />
              }
              resultsContent={
                <ResultsSection
                  comparison={comparison}
                  inputs={inputs}
                  generateShareableLink={generateShareableLink}
                  hideHeader
                  isSignedIn={isSignedIn}
                />
              }
            />
          </motion.div>
        ) : (
          <motion.div
            key="calc-desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-brand-ivory flex flex-row"
          >
            <InputsSection
              inputs={inputs}
              auditRequired={auditRequired}
              callbacks={inputCallbacks}
              calculatedProfit={effectiveBusinessProfit}
            />
            <ResultsSection
              comparison={comparison}
              inputs={inputs}
              generateShareableLink={generateShareableLink}
              isSignedIn={isSignedIn}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
