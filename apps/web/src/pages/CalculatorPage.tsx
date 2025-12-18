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

// Default values for tax inputs
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
  inputMode: 'profit',
  targetNetIncome: 10000,
  extendedReliefs: {},
};

export default function CalculatorPage() {
  const { user } = useAuth();
  const isSignedIn = !!user;
  const isMobile = useIsMobile();

  // Use localStorage persistence for all inputs
  const { inputs: storedInputs, updateInput, updateAllInputs, clearInputs } = useTaxInputsStorage(DEFAULT_INPUTS);

  // Relief state kept separate since it has a different structure
  const [reliefs, setReliefs] = useState<PersonalReliefs>(getDefaultReliefs());

  // Handler for loading shared inputs from URL
  const handleLoadSharedInputs = useCallback((sharedInputs: Partial<StoredInputs>) => {
    updateAllInputs({
      ...storedInputs,
      ...sharedInputs,
    });
  }, [updateAllInputs, storedInputs]);

  // Shareable link functionality
  const { generateShareableLink } = useShareableLink(storedInputs, handleLoadSharedInputs);

  // Create wrapper setters that update localStorage
  const setBusinessProfit = useCallback((value: number) => updateInput('businessProfit', value), [updateInput]);
  const setOtherIncome = useCallback((value: number) => updateInput('otherIncome', value), [updateInput]);
  const setMonthlySalary = useCallback((value: number) => updateInput('monthlySalary', value), [updateInput]);
  const setComplianceCosts = useCallback((value: number) => updateInput('complianceCosts', value), [updateInput]);
  const setAuditRevenue = useCallback((value: number) => updateInput('auditRevenue', value), [updateInput]);
  const setAuditAssets = useCallback((value: number) => updateInput('auditAssets', value), [updateInput]);
  const setAuditEmployees = useCallback((value: number) => updateInput('auditEmployees', value), [updateInput]);
  const setAuditCost = useCallback((value: number) => updateInput('auditCost', value), [updateInput]);
  const setApplyYa2025DividendSurcharge = useCallback((value: boolean) => updateInput('applyYa2025DividendSurcharge', value), [updateInput]);
  const setDividendDistributionPercent = useCallback((value: number) => updateInput('dividendDistributionPercent', value), [updateInput]);
  const setHasForeignOwnership = useCallback((value: boolean) => updateInput('hasForeignOwnership', value), [updateInput]);
  const setInputMode = useCallback((value: InputMode) => updateInput('inputMode', value), [updateInput]);
  const setTargetNetIncome = useCallback((value: number) => updateInput('targetNetIncome', value), [updateInput]);
  const setZakat = useCallback((value: ZakatInput) => updateInput('zakat', value), [updateInput]);
  const setExtendedReliefs = useCallback((value: ReliefClaimValues) => updateInput('extendedReliefs', value), [updateInput]);

  // Handler to reset all inputs to defaults
  const handleClearInputs = useCallback(() => {
    clearInputs();
    setReliefs(getDefaultReliefs());
  }, [clearInputs]);

  // Create callbacks object for InputsSection
  const inputCallbacks: InputCallbacks = useMemo(() => ({
    onBusinessProfitChange: setBusinessProfit,
    onOtherIncomeChange: setOtherIncome,
    onMonthlySalaryChange: setMonthlySalary,
    onComplianceCostsChange: setComplianceCosts,
    onAuditRevenueChange: setAuditRevenue,
    onAuditAssetsChange: setAuditAssets,
    onAuditEmployeesChange: setAuditEmployees,
    onAuditCostChange: setAuditCost,
    onReliefsChange: setReliefs,
    onExtendedReliefsChange: setExtendedReliefs,
    onApplyYa2025DividendSurchargeChange: setApplyYa2025DividendSurcharge,
    onDividendDistributionPercentChange: setDividendDistributionPercent,
    onForeignOwnershipChange: setHasForeignOwnership,
    onClearInputs: handleClearInputs,
    onInputModeChange: setInputMode,
    onTargetNetIncomeChange: setTargetNetIncome,
    onZakatChange: setZakat,
  }), [
    setBusinessProfit, setOtherIncome, setMonthlySalary, setComplianceCosts,
    setAuditRevenue, setAuditAssets, setAuditEmployees, setAuditCost,
    setReliefs, setExtendedReliefs, setApplyYa2025DividendSurcharge, setDividendDistributionPercent,
    setHasForeignOwnership, handleClearInputs, setInputMode, setTargetNetIncome, setZakat,
  ]);

  // Calculate derived state
  const auditRequired = !isAuditExempt({
    revenue: storedInputs.auditRevenue,
    totalAssets: storedInputs.auditAssets,
    employees: storedInputs.auditEmployees,
  });

  // Calculate total reliefs for reverse calculation
  const hasExtendedReliefs = storedInputs.extendedReliefs && Object.keys(storedInputs.extendedReliefs).length > 0;
  const totalReliefs = hasExtendedReliefs
    ? getTotalReliefsFromExtended(storedInputs.extendedReliefs!)
    : calculateTotalReliefs(reliefs);

  // Calculate required income for target mode
  const annualTargetNetIncome = (storedInputs.targetNetIncome || 10000) * 12;
  const requiredGrossIncome = storedInputs.inputMode === 'target'
    ? calculateRequiredIncomeForNetCash(annualTargetNetIncome, totalReliefs)
    : 0;

  // Calculate effective business profit based on input mode
  const effectiveBusinessProfit = storedInputs.inputMode === 'target'
    ? Math.max(0, requiredGrossIncome - storedInputs.otherIncome)
    : storedInputs.businessProfit;

  // Create inputs object
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
            className="h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-background flex flex-row"
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
