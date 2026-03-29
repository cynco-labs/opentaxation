/**
 * EPF (Employees Provident Fund) Rules for Malaysia
 * 
 * Source: EPF Act 1991, EPF Malaysia
 *
 * NOTE: This module now derives rates from taxYears.ts (single source of truth).
 * The exported constants are for backward compatibility.
 */

import { getCurrentTaxYear } from './taxYears';
import { calculateEmployerSOCSO, calculateEmployerEIS } from './socsoRules';

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
 * Total cost = salary + employer EPF + employer SOCSO + employer EIS
 * We find the salary where total cost = businessProfit exactly.
 *
 * Uses iterative refinement since SOCSO/EIS have salary caps and step changes.
 */
export function calculateMaxAffordableSalary(businessProfit: number): number {
  if (businessProfit <= 0) return 0;

  const config = getEPFConfig();

  // Start with EPF-only estimate
  const epfRate = (businessProfit / 12) > config.salaryThreshold
    ? config.employerRateHigh
    : config.employerRateLow;
  let salary = businessProfit / (1 + epfRate);

  // Iteratively refine to account for SOCSO + EIS
  for (let i = 0; i < 10; i++) {
    const monthlySalary = salary / 12;
    const epf = calculateEmployerEPF(salary);
    const socso = calculateEmployerSOCSO(monthlySalary) * 12;
    const eis = calculateEmployerEIS(monthlySalary) * 12;
    const totalCost = salary + epf + socso + eis;
    const overshoot = totalCost - businessProfit;

    if (Math.abs(overshoot) < 1) break; // converged within RM1
    salary -= overshoot * 0.9; // damped correction
    salary = Math.max(0, salary);
  }

  return Math.round(salary * 100) / 100;
}
