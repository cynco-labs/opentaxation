import { useMemo } from 'react';
import {
  calculateSolePropScenario,
  calculateSdnBhdScenario,
  compareScenarios,
  sanitizeInputs,
  validateInputs,
  type TaxCalculationInputs,
  type ComparisonResult,
} from '@tax-engine/core';

export function useTaxCalculation(inputs: TaxCalculationInputs): ComparisonResult | null {
  const reliefs = inputs.reliefs;
  const reliefsKey = reliefs
    ? `${reliefs.basic || 0}-${reliefs.epfAndLifeInsurance || 0}-${reliefs.medical || 0}-${reliefs.spouse || 0}-${reliefs.children || 0}-${reliefs.education || 0}`
    : '';

  const extendedReliefsKey = inputs.extendedReliefs
    ? JSON.stringify(inputs.extendedReliefs)
    : '';

  return useMemo(() => {
    if (inputs.businessProfit === undefined || inputs.businessProfit === null) {
      return null;
    }

    const sanitized = sanitizeInputs(inputs);
    const validationErrors = validateInputs(sanitized);

    if (validationErrors.length > 0) {
      return null;
    }

    if (!sanitized.businessProfit && sanitized.businessProfit !== 0) {
      return null;
    }

    try {
      const solePropResult = calculateSolePropScenario({
        businessProfit: sanitized.businessProfit,
        otherIncome: sanitized.otherIncome || 0,
        reliefs: sanitized.reliefs,
        extendedReliefs: sanitized.extendedReliefs,
        zakat: sanitized.zakat,
      });

      const sdnBhdResult = calculateSdnBhdScenario({
        businessProfit: sanitized.businessProfit,
        monthlySalary: sanitized.monthlySalary || 5000,
        otherIncome: sanitized.otherIncome || 0,
        complianceCosts: sanitized.complianceCosts || 5000,
        auditCost: sanitized.auditCost,
        auditCriteria: sanitized.auditCriteria,
        reliefs: sanitized.reliefs,
        extendedReliefs: sanitized.extendedReliefs,
        applyYa2025DividendSurcharge: sanitized.applyYa2025DividendSurcharge,
        dividendDistributionPercent: sanitized.dividendDistributionPercent,
        zakat: sanitized.zakat,
      });

      return compareScenarios(solePropResult, sdnBhdResult, sanitized.businessProfit, sanitized);
    } catch {
      return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    inputs.businessProfit,
    inputs.otherIncome,
    inputs.monthlySalary,
    inputs.complianceCosts,
    inputs.auditCost,
    inputs.auditCriteria?.revenue,
    inputs.auditCriteria?.totalAssets,
    inputs.auditCriteria?.employees,
    inputs.paidUpCapital,
    inputs.grossIncome,
    inputs.relatedCompanyShare,
    reliefsKey,
    extendedReliefsKey,
    inputs.applyYa2025DividendSurcharge,
    inputs.dividendDistributionPercent,
    inputs.zakat?.enabled,
    inputs.zakat?.autoCalculate,
    inputs.zakat?.amountPaid,
  ]);
}

