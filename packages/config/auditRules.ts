/**
 * Malaysia Audit Exemption Rules
 *
 * Effective 1 January 2025, SSM Practice Directive No. 10/2024 replaced
 * the old criteria. A private company is audit-exempt if it meets
 * ANY TWO of the three qualifying criteria (phased thresholds).
 *
 * Phase 1 (FY starting 1 Jan 2025): Revenue <= RM1M, Assets <= RM1M, Employees <= 10
 * Phase 2 (FY starting 1 Jan 2026): Revenue <= RM2M, Assets <= RM2M, Employees <= 20
 * Phase 3 (FY starting 1 Jan 2027): Revenue <= RM3M, Assets <= RM3M, Employees <= 30
 *
 * Source: SSM Practice Directive No. 10/2024, Companies Act 2016 Section 267
 */

export interface AuditExemptionCriteria {
  revenue: number;
  totalAssets: number;
  employees: number;
}

export interface AuditExemptionThresholds {
  revenue: number;
  totalAssets: number;
  employees: number;
}

/**
 * Phased audit exemption thresholds by financial year start
 */
const AUDIT_EXEMPTION_PHASES: { minYear: number; thresholds: AuditExemptionThresholds }[] = [
  { minYear: 2027, thresholds: { revenue: 3_000_000, totalAssets: 3_000_000, employees: 30 } },
  { minYear: 2026, thresholds: { revenue: 2_000_000, totalAssets: 2_000_000, employees: 20 } },
  { minYear: 2025, thresholds: { revenue: 1_000_000, totalAssets: 1_000_000, employees: 10 } },
];

/**
 * Get applicable audit exemption thresholds for a given financial year
 *
 * @param financialYearStart - Calendar year the financial year begins (defaults to current year)
 * @returns The applicable thresholds
 */
export function getAuditExemptionThresholds(financialYearStart?: number): AuditExemptionThresholds {
  const year = financialYearStart ?? new Date().getFullYear();

  for (const phase of AUDIT_EXEMPTION_PHASES) {
    if (year >= phase.minYear) {
      return phase.thresholds;
    }
  }

  // Pre-2025 legacy thresholds (all three must be met — handled by isAuditExempt)
  return { revenue: 100_000, totalAssets: 300_000, employees: 5 };
}

/**
 * Check if a company qualifies for audit exemption
 *
 * Post-2025: Must meet ANY TWO of three criteria.
 * Pre-2025 (legacy): Must meet ALL three criteria.
 *
 * @param criteria - Company criteria to check
 * @param financialYearStart - Calendar year the financial year begins (defaults to current year)
 * @returns true if company qualifies for audit exemption
 */
export function isAuditExempt(
  criteria: AuditExemptionCriteria,
  financialYearStart?: number,
): boolean {
  const year = financialYearStart ?? new Date().getFullYear();
  const thresholds = getAuditExemptionThresholds(year);

  const meetsRevenue = criteria.revenue <= thresholds.revenue;
  const meetsAssets = criteria.totalAssets <= thresholds.totalAssets;
  const meetsEmployees = criteria.employees <= thresholds.employees;

  if (year >= 2025) {
    // PD 10/2024: any two of three
    const metCount = [meetsRevenue, meetsAssets, meetsEmployees].filter(Boolean).length;
    return metCount >= 2;
  }

  // Pre-2025 legacy: all three must be met
  return meetsRevenue && meetsAssets && meetsEmployees;
}

/**
 * Current audit exemption thresholds (for display / backward compatibility)
 */
export const AUDIT_EXEMPTION_THRESHOLDS = getAuditExemptionThresholds();
