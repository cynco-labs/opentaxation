/**
 * EPF (Employees Provident Fund) Rules for Malaysia
 * 
 * Source: EPF Act 1991, EPF Malaysia
 *
 * NOTE: This module now derives rates from taxYears.ts (single source of truth).
 * The exported constants are for backward compatibility.
 */

import { getCurrentTaxYear } from './taxYears';

/**
 * Get EPF configuration for the current tax year
 * This is the authoritative source - use this in new code
 */
export function getEPFConfig() {
  return getCurrentTaxYear().epf;
}

/**
 * Calculate employer EPF contribution
 * - Salary ≤ threshold/month: employerRateLow
 * - Salary > threshold/month: employerRateHigh
 * 
 * Note: EPF is calculated on monthly salary, but we use annual salary for convenience
 * and apply the rate based on monthly equivalent
 */
export function calculateEmployerEPF(annualSalary: number): number {
  if (annualSalary <= 0) return 0;
  
  const config = getEPFConfig();
  const monthlySalary = annualSalary / 12;
  const rate = monthlySalary <= config.salaryThreshold 
    ? config.employerRateLow 
    : config.employerRateHigh;
  
  return Math.round(annualSalary * rate * 100) / 100;
}

/**
 * Calculate employee EPF contribution
 * - Employee contribution: employeeRate of salary
 * 
 * Note: Employee can opt for lower rate (minimum 8%) but standard rate is used here
 */
export function calculateEmployeeEPF(annualSalary: number): number {
  if (annualSalary <= 0) return 0;
  
  const config = getEPFConfig();
  return Math.round(annualSalary * config.employeeRate * 100) / 100;
}

/**
 * EPF rates for reference (current tax year)
 * @deprecated Use getEPFConfig() for new code to support multiple tax years
 */
export const EPF_RATES = (() => {
  const config = getEPFConfig();
  return {
    employer: {
      low: config.employerRateLow,
      high: config.employerRateHigh,
      threshold: config.salaryThreshold,
    },
    employee: config.employeeRate,
  } as const;
})();

/**
 * Calculate maximum affordable annual salary given business profit
 *
 * This is the salary where: salary + employer EPF = businessProfit exactly
 * Formula: maxSalary = businessProfit / (1 + employerEPFRate)
 *
 * Note: EPF rate depends on salary level, so we need to check which rate applies
 */
export function calculateMaxAffordableSalary(businessProfit: number): number {
  if (businessProfit <= 0) return 0;

  // First try with lower EPF rate (12% for salary > RM5k/month)
  // maxSalary = businessProfit / (1 + 0.12) = businessProfit / 1.12
  const maxWithLowerRate = businessProfit / 1.12;
  const monthlyWithLowerRate = maxWithLowerRate / 12;

  // If monthly salary would be > threshold, the high rate applies
  const config = getEPFConfig();
  if (monthlyWithLowerRate > config.salaryThreshold) {
    return Math.round(maxWithLowerRate * 100) / 100;
  }

  // Otherwise, use higher rate (for salary <= threshold/month)
  // maxSalary = businessProfit / (1 + employerRateLow)
  return Math.round((businessProfit / (1 + config.employerRateLow)) * 100) / 100;
}
