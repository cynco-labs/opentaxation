/**
 * E-Invoice Implementation Phases
 * Based on official LHDN timeline (updated December 2025)
 * Source: https://www.hasil.gov.my/en/e-invoice/implementation-of-e-invoicing-in-malaysia/e-invoice-implementation-timeline/
 */

export interface EInvoicePhase {
  id: number | 'exempt';
  name: string;
  nameMalay: string;
  revenueMin: number;
  revenueMax: number;
  revenueLabel: string;
  startDate: string | null;
  relaxationEndDate: string | null;
  status: 'completed' | 'active' | 'upcoming' | 'exempt';
  description: string;
  keyPoints: string[];
}

export const einvoicePhases: EInvoicePhase[] = [
  {
    id: 1,
    name: 'Phase 1',
    nameMalay: 'Fasa 1',
    revenueMin: 100_000_000,
    revenueMax: Infinity,
    revenueLabel: '> RM100 million',
    startDate: '2024-08-01',
    relaxationEndDate: '2025-01-31',
    status: 'completed',
    description: 'Large enterprises with annual turnover exceeding RM100 million',
    keyPoints: [
      'First wave of mandatory e-invoicing',
      '6-month relaxation period ended 31 Jan 2025',
      'Full compliance now required'
    ]
  },
  {
    id: 2,
    name: 'Phase 2',
    nameMalay: 'Fasa 2',
    revenueMin: 25_000_000,
    revenueMax: 100_000_000,
    revenueLabel: 'RM25M - RM100M',
    startDate: '2025-01-01',
    relaxationEndDate: '2025-06-30',
    status: 'active',
    description: 'Mid-sized businesses with annual turnover between RM25 million and RM100 million',
    keyPoints: [
      'Implementation began 1 January 2025',
      'Relaxation period until 30 June 2025',
      'Must register on MyInvois portal'
    ]
  },
  {
    id: 3,
    name: 'Phase 3',
    nameMalay: 'Fasa 3',
    revenueMin: 5_000_000,
    revenueMax: 25_000_000,
    revenueLabel: 'RM5M - RM25M',
    startDate: '2025-07-01',
    relaxationEndDate: '2025-12-31',
    status: 'upcoming',
    description: 'Small-medium businesses with annual turnover between RM5 million and RM25 million',
    keyPoints: [
      'Implementation starts 1 July 2025',
      '6-month relaxation period until 31 Dec 2025',
      'Prepare systems now for smooth transition'
    ]
  },
  {
    id: 4,
    name: 'Phase 4',
    nameMalay: 'Fasa 4',
    revenueMin: 1_000_000,
    revenueMax: 5_000_000,
    revenueLabel: 'RM1M - RM5M',
    startDate: '2026-01-01',
    relaxationEndDate: '2026-06-30',
    status: 'upcoming',
    description: 'Small businesses with annual turnover between RM1 million and RM5 million',
    keyPoints: [
      'Implementation starts 1 January 2026',
      '6-month relaxation period until 30 June 2026',
      'Final phase before full nationwide compliance'
    ]
  },
  {
    id: 'exempt',
    name: 'Exempt',
    nameMalay: 'Dikecualikan',
    revenueMin: 0,
    revenueMax: 1_000_000,
    revenueLabel: '< RM1 million',
    startDate: null,
    relaxationEndDate: null,
    status: 'exempt',
    description: 'Micro businesses with annual turnover below RM1 million are exempt from e-invoicing requirements',
    keyPoints: [
      'Exemption threshold raised from RM500K to RM1M (Dec 2025)',
      'Must not have affiliates that exceed threshold',
      'If revenue exceeds RM1M in future, must comply from 2nd year after'
    ]
  }
];

/**
 * Get the phase for a given revenue amount
 */
export function getPhaseByRevenue(annualRevenue: number): EInvoicePhase {
  // Check from highest threshold to lowest
  for (const phase of einvoicePhases) {
    if (annualRevenue >= phase.revenueMin && annualRevenue < phase.revenueMax) {
      return phase;
    }
  }
  // Default to exempt if below all thresholds
  return einvoicePhases[einvoicePhases.length - 1];
}

/**
 * Get days until a phase starts
 */
export function getDaysUntilPhase(phase: EInvoicePhase): number | null {
  if (!phase.startDate) return null;

  const today = new Date();
  const startDate = new Date(phase.startDate);
  const diffTime = startDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

/**
 * Check if we're in relaxation period for a phase
 */
export function isInRelaxationPeriod(phase: EInvoicePhase): boolean {
  if (!phase.startDate || !phase.relaxationEndDate) return false;

  const today = new Date();
  const startDate = new Date(phase.startDate);
  const relaxationEnd = new Date(phase.relaxationEndDate);

  return today >= startDate && today <= relaxationEnd;
}

/**
 * Key dates for the timeline
 */
export const keyDates = {
  phase1Start: '2024-08-01',
  phase1RelaxationEnd: '2025-01-31',
  phase2Start: '2025-01-01',
  phase2RelaxationEnd: '2025-06-30',
  phase3Start: '2025-07-01',
  phase3RelaxationEnd: '2025-12-31',
  phase4Start: '2026-01-01',
  phase4RelaxationEnd: '2026-06-30',
  consolidatedInvoiceThreshold: '2026-01-01', // RM10K threshold for consolidated invoices
  exemptionThresholdUpdate: '2025-12-06' // When RM1M threshold was announced
};

/**
 * Important rule changes
 */
export const ruleChanges = [
  {
    date: '2025-12-06',
    title: 'Exemption Threshold Raised',
    description: 'Exemption threshold raised from RM500,000 to RM1,000,000. Phase 5 effectively cancelled.',
    impact: 'positive'
  },
  {
    date: '2026-01-01',
    title: 'RM10,000 Consolidated Invoice Rule',
    description: 'Individual e-invoices mandatory for transactions exceeding RM10,000. Consolidated invoices no longer allowed for these amounts.',
    impact: 'neutral'
  },
  {
    date: '2025-06-05',
    title: 'Previous Threshold Update',
    description: 'Exemption threshold was raised from RM150,000 to RM500,000.',
    impact: 'positive'
  }
];
