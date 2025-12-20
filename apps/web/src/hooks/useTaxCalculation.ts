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

/**
 * Custom hook for tax calculations
 * Uses useMemo with primitive dependencies to avoid unnecessary recalculations
 * 
 * Per React best practices: https://react.dev/learn/you-might-not-need-an-effect
 * - Calculates expensive computations during render (not in Effects)
 * - Uses useMemo to cache results based on primitive dependencies
 * - Sanitizes and validates inputs before calculation
 */
export function useTaxCalculation(inputs: TaxCalculationInputs): ComparisonResult | null {
  // Use primitive values in dependency array instead of the object
  // This ensures memoization works correctly
  // Extract reliefs values for dependency array
  // Using individual properties ensures proper memoization
  const reliefs = inputs.reliefs;
  const reliefsKey = reliefs
    ? `${reliefs.basic || 0}-${reliefs.epfAndLifeInsurance || 0}-${reliefs.medical || 0}-${reliefs.spouse || 0}-${reliefs.children || 0}-${reliefs.education || 0}`
    : '';

  // Create a stable key for extended reliefs
  const extendedReliefs = inputs.extendedReliefs;
  const extendedReliefsKey = extendedReliefs
    ? JSON.stringify(extendedReliefs)
    : '';

  return useMemo(() => {
    // If required businessProfit is missing, bail out early
    if (inputs.businessProfit === undefined || inputs.businessProfit === null) {
      return null;
    }

    // Sanitize inputs first (replaces NaN/Infinity with safe defaults)
    const sanitized = sanitizeInputs(inputs);
    
    // Validate inputs (returns errors if any)
    const validationErrors = validateInputs(sanitized);
    
    // If there are validation errors, return null to prevent calculation
    // In a production app, you might want to log these or show them to the user
    if (validationErrors.length > 0) {
      // Log validation errors in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Tax calculation inputs validation failed:', validationErrors);
      }
      return null;
    }

    // Check if businessProfit is valid (required field)
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
    } catch (error) {
      // Catch any calculation errors and return null
      // In production, you might want to log these or show them to the user
      if (process.env.NODE_ENV === 'development') {
        console.error('Tax calculation error:', error);
      }
      return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Using primitive values intentionally to avoid unnecessary recalculations from object reference changes
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
    reliefsKey, // Use serialized reliefs instead of object reference
    extendedReliefsKey, // Use serialized extended reliefs
    inputs.applyYa2025DividendSurcharge,
    inputs.dividendDistributionPercent,
    inputs.zakat?.enabled,
    inputs.zakat?.autoCalculate,
    inputs.zakat?.amountPaid,
    inputs.paidUpCapital,
    inputs.grossIncome,
    inputs.relatedCompanyShare,
  ]);
}

