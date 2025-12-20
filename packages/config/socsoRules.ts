/**
 * SOCSO (Social Security Organization) Rules for Malaysia
 *
 * SOCSO contributions are mandatory for employees earning ≤ threshold/month
 * Optional for employees earning > threshold/month
 *
 * Source: https://www.perkeso.gov.my/en/rate-of-contribution.html
 *
 * Note: This uses simplified percentage rates for estimation.
 * Actual SOCSO uses a table-based contribution system.
 *
 * NOTE: This module now derives rates from taxYears.ts (single source of truth).
 * The exported constants are for backward compatibility.
 */

import { getCurrentTaxYear } from './taxYears';

export interface SOCSORates {
  employee: number; // Employee contribution rate
  employer: number; // Employer contribution rate
  eisEmployee: number; // EIS employee contribution rate
  eisEmployer: number; // EIS employer contribution rate
  eisWageCap: number; // EIS wage cap (monthly)
}

/**
 * Get SOCSO configuration for the current tax year
 * This is the authoritative source - use this in new code
 */
export function getSOCSOConfig() {
  return getCurrentTaxYear().socso;
}

/**
 * Calculate employer SOCSO contribution
 *
 * SOCSO rates vary by salary brackets (simplified for estimation)
 *
 * @param monthlySalary - Monthly salary
 * @returns Monthly employer SOCSO contribution
 */
export function calculateEmployerSOCSO(monthlySalary: number): number {
  if (monthlySalary <= 0) return 0;

  const config = getSOCSOConfig();
  // SOCSO is calculated based on salary brackets
  // Simplified: For salary ≤ threshold/month, employer contributes at employerRate
  // For salary > threshold/month, SOCSO is optional
  if (monthlySalary <= config.wageThreshold) {
    return Math.round(monthlySalary * config.employerRate * 100) / 100;
  }

  // Optional for higher salaries - return 0
  return 0;
}

/**
 * Calculate employee SOCSO contribution
 *
 * @param monthlySalary - Monthly salary
 * @returns Monthly employee SOCSO contribution
 */
export function calculateEmployeeSOCSO(monthlySalary: number): number {
  if (monthlySalary <= 0) return 0;

  const config = getSOCSOConfig();
  // SOCSO is calculated based on salary brackets
  // Simplified: For salary ≤ threshold/month, employee contributes at employeeRate
  // For salary > threshold/month, SOCSO is optional
  if (monthlySalary <= config.wageThreshold) {
    return Math.round(monthlySalary * config.employeeRate * 100) / 100;
  }

  // Optional for higher salaries - return 0
  return 0;
}

/**
 * Calculate EIS contributions (simplified percentage up to wage cap)
 */
export function calculateEmployerEIS(monthlySalary: number): number {
  if (monthlySalary <= 0) return 0;
  const config = getSOCSOConfig();
  const cap = Math.min(monthlySalary, config.eisWageCap);
  return Math.round(cap * config.eisEmployerRate * 100) / 100;
}

export function calculateEmployeeEIS(monthlySalary: number): number {
  if (monthlySalary <= 0) return 0;
  const config = getSOCSOConfig();
  const cap = Math.min(monthlySalary, config.eisWageCap);
  return Math.round(cap * config.eisEmployeeRate * 100) / 100;
}

/**
 * SOCSO rates for reference (current tax year)
 * Note: Actual rates vary by salary brackets - this is simplified
 * @deprecated Use getSOCSOConfig() for new code to support multiple tax years
 */
export const SOCSO_RATES = (() => {
  const config = getSOCSOConfig();
  return {
    employer: {
      low: config.employerRate,
      threshold: config.wageThreshold,
    },
    employee: {
      low: config.employeeRate,
      threshold: config.wageThreshold,
    },
    eis: {
      employer: config.eisEmployerRate,
      employee: config.eisEmployeeRate,
      wageCap: config.eisWageCap,
    },
  } as const;
})();

